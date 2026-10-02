"""
Model Inference Module for CrowdFundAI
Loads the trained ML model pipeline (models/best_model.joblib)
and performs real prediction inference for campaign inputs.
"""

import os
import sys
import json
from typing import Dict, Any, Optional, Tuple
import pandas as pd
import numpy as np
import joblib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "best_model.joblib")


# Category statistics derived from historical Kickstarter dataset
CATEGORY_STATS: Dict[str, Dict[str, float]] = {
    "Art": {"success_rate": 0.44889, "median_goal": 2966.7},
    "Comics": {"success_rate": 0.59142, "median_goal": 3500.0},
    "Crafts": {"success_rate": 0.27053, "median_goal": 2176.06},
    "Dance": {"success_rate": 0.65435, "median_goal": 3200.0},
    "Design": {"success_rate": 0.41594, "median_goal": 10000.0},
    "Fashion": {"success_rate": 0.28283, "median_goal": 5500.0},
    "Film & Video": {"success_rate": 0.41791, "median_goal": 6400.0},
    "Food": {"success_rate": 0.27591, "median_goal": 10000.0},
    "Games": {"success_rate": 0.43890, "median_goal": 7500.0},
    "Journalism": {"success_rate": 0.24391, "median_goal": 5000.0},
    "Music": {"success_rate": 0.52661, "median_goal": 4000.0},
    "Photography": {"success_rate": 0.34111, "median_goal": 3925.0},
    "Publishing": {"success_rate": 0.34702, "median_goal": 4998.56},
    "Technology": {"success_rate": 0.23786, "median_goal": 18000.0},
    "Theater": {"success_rate": 0.63796, "median_goal": 3101.35}
}

# Frontend Category options mapped to (main_category, subcategory) in trained model
CATEGORY_MAP: Dict[str, Tuple[str, str]] = {
    'Technology': ('Technology', 'Technology'),
    'FinTech': ('Technology', 'Software'),
    'Design & Hardware': ('Design', 'Product Design'),
    'Games': ('Games', 'Tabletop Games'),
    'Film & Video': ('Film & Video', 'Documentary'),
    'Publishing': ('Publishing', 'Fiction'),
    'Music': ('Music', 'Music'),
    'Art': ('Art', 'Art'),
    'Food & Craft': ('Food', 'Food'),
    'Community & Social': ('Publishing', 'Periodicals')
}


def build_feature_dataframe(campaign: Dict[str, Any]) -> pd.DataFrame:
    """
    Transforms raw campaign input into a single-row DataFrame matching the exact 22 features
    and ordering used during model training.
    """
    title = str(campaign.get('title') or campaign.get('campaignName') or campaign.get('name') or 'My Project')
    goal = float(campaign.get('goalAmount') or campaign.get('fundingGoal') or campaign.get('usd_goal_real') or 5000.0)
    duration = float(campaign.get('durationDays') or campaign.get('campaignDuration') or campaign.get('duration_days') or 30.0)
    raw_cat = str(campaign.get('category') or campaign.get('main_category') or 'Technology')
    raw_subcat = str(campaign.get('subCategory') or campaign.get('category') or raw_cat)
    currency = str(campaign.get('currency') or 'USD')
    country = str(campaign.get('country') or 'US')
    launched_year = int(campaign.get('launched_year', 2026))
    launched_month = int(campaign.get('launched_month', 10))
    launched_day_of_week = int(campaign.get('launched_day_of_week', 3))
    launched_hour = int(campaign.get('launched_hour', 14))

    # Map frontend selection to trained model's main_category and subcategory
    if raw_cat in CATEGORY_MAP:
        main_category, category = CATEGORY_MAP[raw_cat]
    elif raw_cat in CATEGORY_STATS:
        main_category = raw_cat
        category = raw_subcat if raw_subcat != raw_cat else raw_cat
    else:
        main_category = 'Technology'
        category = 'Technology'

    stats = CATEGORY_STATS.get(main_category, {"success_rate": 0.4039, "median_goal": 5001.0})
    category_success_rate = stats["success_rate"]
    goal_to_cat_median_ratio = goal / (stats["median_goal"] + 1.0)
    log_goal_to_cat_median_ratio = float(np.log1p(goal_to_cat_median_ratio))

    log_usd_goal = float(np.log1p(goal))
    name_length = len(title)
    name_word_count = len(title.split())
    goal_per_day = goal / (duration + 1.0)
    log_goal_per_day = float(np.log1p(goal_per_day))

    is_usd_currency = 1 if currency == 'USD' else 0
    is_top_country = 1 if country in ['US', 'GB', 'CA'] else 0
    is_weekend_launch = 1 if launched_day_of_week >= 5 else 0
    launched_quarter = (launched_month - 1) // 3 + 1

    feature_dict = {
        'category': category,
        'main_category': main_category,
        'currency': currency,
        'country': country,
        'usd_goal_real': goal,
        'log_usd_goal': log_usd_goal,
        'duration_days': duration,
        'name_length': name_length,
        'name_word_count': name_word_count,
        'goal_per_day': goal_per_day,
        'log_goal_per_day': log_goal_per_day,
        'category_success_rate': category_success_rate,
        'goal_to_cat_median_ratio': goal_to_cat_median_ratio,
        'log_goal_to_cat_median_ratio': log_goal_to_cat_median_ratio,
        'is_usd_currency': is_usd_currency,
        'is_top_country': is_top_country,
        'is_weekend_launch': is_weekend_launch,
        'launched_year': launched_year,
        'launched_month': launched_month,
        'launched_day_of_week': launched_day_of_week,
        'launched_hour': launched_hour,
        'launched_quarter': launched_quarter
    }

    return pd.DataFrame([feature_dict])


def load_model_pipeline(model_path: str = MODEL_PATH):
    """
    Load trained Scikit-Learn Pipeline artifact from models/.
    """
    if not os.path.exists(model_path):
        return None

    try:
        pipeline = joblib.load(model_path)
        return pipeline
    except Exception as e:
        print(f"Error loading model artifact from {model_path}: {e}")
        return None


def predict_campaign_success(campaign: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes real ML prediction inference for input campaign attributes.
    Converts raw campaign inputs into the required feature schema.
    """
    pipeline = load_model_pipeline()
    if pipeline is None:
        return {
            "success": False,
            "error": "No trained ML model artifact found. Ensure models/best_model.joblib exists."
        }

    try:
        X_input = build_feature_dataframe(campaign)

        # Execute prediction and probability calculation
        prediction_class = int(pipeline.predict(X_input)[0])
        probabilities = pipeline.predict_proba(X_input)[0]
        prob_success = float(probabilities[1])

        return {
            "success": True,
            "prediction": prediction_class,  # 1 = Successful, 0 = Failed
            "predicted_status": "Successful" if prediction_class == 1 else "Failed",
            "success_probability": round(prob_success, 4),
            "failure_probability": round(float(probabilities[0]), 4),
            "confidence_score": round(max(prob_success, 1.0 - prob_success), 4)
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Prediction error: {str(e)}"
        }


if __name__ == "__main__":
    test_sample = {
        "title": "Smart Solar Backpack",
        "category": "Technology",
        "goalAmount": 5000,
        "durationDays": 30
    }
    result = predict_campaign_success(test_sample)
    print("Sample Prediction Result:")
    print(json.dumps(result, indent=2))

