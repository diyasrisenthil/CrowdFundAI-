"""
CrowdFundAI Explainable AI (XAI) Module
Uses SHAP (SHapley Additive exPlanations) to explain global model behavior
and provide local feature attribution (positive & negative factors) for individual predictions.
"""

import os
import sys
import json
from typing import Dict, Any, List, Optional, Tuple

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import shap

# Ensure root project directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import load_model_pipeline, build_feature_dataframe
from ml.data_loader import get_processed_dataset_path

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "best_model.joblib")
PLOTS_DIR = os.path.join(os.path.dirname(__file__), "..", "notebooks", "eda_plots")
GLOBAL_IMPORTANCE_JSON = os.path.join(os.path.dirname(__file__), "..", "models", "global_feature_importance.json")


FEATURE_NAME_MAP = {
    'num__usd_goal_real': 'Funding Goal (USD)',
    'num__log_usd_goal': 'Log Funding Goal',
    'num__duration_days': 'Campaign Duration (Days)',
    'num__name_length': 'Title Character Length',
    'num__name_word_count': 'Title Word Count',
    'num__goal_per_day': 'Daily Funding Target (USD/Day)',
    'num__log_goal_per_day': 'Log Daily Funding Target',
    'num__category_success_rate': 'Category Historical Success Rate',
    'num__goal_to_cat_median_ratio': 'Goal vs Category Median Ratio',
    'num__log_goal_to_cat_median_ratio': 'Log Goal vs Category Median Ratio',
    'num__is_usd_currency': 'USD Currency Flag',
    'num__is_top_country': 'Top Market Country (US/GB/CA)',
    'num__is_weekend_launch': 'Weekend Launch Flag',
    'num__launched_year': 'Launch Year',
    'num__launched_month': 'Launch Month',
    'num__launched_day_of_week': 'Launch Day of Week',
    'num__launched_hour': 'Launch Hour of Day',
    'num__launched_quarter': 'Launch Quarter'
}


def clean_feature_name(raw_name: str) -> str:
    """Converts internal feature transformer names to human-readable strings."""
    if raw_name in FEATURE_NAME_MAP:
        return FEATURE_NAME_MAP[raw_name]
    if raw_name.startswith('cat__'):
        parts = raw_name.replace('cat__', '').split('_', 1)
        if len(parts) == 2:
            return f"{parts[0].replace('_', ' ').title()}: {parts[1]}"
        return raw_name.replace('cat__', '').replace('_', ' ').title()
    if raw_name.startswith('num__'):
        return raw_name.replace('num__', '').replace('_', ' ').title()
    return raw_name


def format_campaign_dataframe(campaign: Dict[str, Any]) -> pd.DataFrame:
    """Formats raw campaign dictionary into feature matrix DataFrame."""
    return build_feature_dataframe(campaign)


def explain_prediction(campaign: Dict[str, Any], top_n: int = 5) -> Dict[str, Any]:
    """
    Computes real SHAP feature attribution for an individual campaign prediction.
    Identifies top positive factors (pushing towards success) and top negative factors (pushing towards failure).
    """
    pipeline = load_model_pipeline()
    if pipeline is None:
        return {
            "success": False,
            "error": "Trained model pipeline not found in models/best_model.joblib."
        }

    try:
        prep = pipeline.named_steps['prep']
        clf = pipeline.named_steps['clf']

        X_input = format_campaign_dataframe(campaign)

        # Transform inputs using preprocessor
        X_trans = prep.transform(X_input)
        raw_feature_names = prep.get_feature_names_out()

        # Compute SHAP values using TreeExplainer / Explainer
        explainer = shap.Explainer(clf)
        shap_explanation = explainer(X_trans)

        # Get SHAP values array for first sample
        shap_vals = shap_explanation.values[0]
        base_value = float(shap_explanation.base_values[0]) if hasattr(shap_explanation.base_values, '__len__') else float(shap_explanation.base_values)

        # Calculate model probability
        probs = pipeline.predict_proba(X_input)[0]
        prob_success = float(probs[1])
        prediction_class = int(pipeline.predict(X_input)[0])

        # Pair feature names, values, and SHAP impacts
        impacts = []
        for i, raw_name in enumerate(raw_feature_names):
            impact = float(shap_vals[i])
            if abs(impact) > 1e-4:  # Only non-zero impactful features
                impacts.append({
                    "raw_feature": raw_name,
                    "feature": clean_feature_name(raw_name),
                    "impact": round(impact, 4),
                    "abs_impact": round(abs(impact), 4),
                    "value": round(float(X_trans[0, i]), 2)
                })

        # Separate into Positive and Negative Factors
        pos_factors = sorted([item for item in impacts if item["impact"] > 0], key=lambda x: x["impact"], reverse=True)[:top_n]
        neg_factors = sorted([item for item in impacts if item["impact"] < 0], key=lambda x: x["impact"])[:top_n]

        # Add human explanations
        for item in pos_factors:
            item["description"] = f"Increases success chance by +{abs(item['impact']):.2f} (SHAP impact)"
        for item in neg_factors:
            item["description"] = f"Reduces success chance by -{abs(item['impact']):.2f} (SHAP impact)"

        # All SHAP factors dictionary
        all_shap_dict = {item["feature"]: item["impact"] for item in sorted(impacts, key=lambda x: x["abs_impact"], reverse=True)[:15]}

        return {
            "success": True,
            "prediction": prediction_class,
            "predicted_status": "Successful" if prediction_class == 1 else "Failed",
            "success_probability": round(prob_success, 4),
            "failure_probability": round(float(probs[0]), 4),
            "base_value": round(base_value, 4),
            "top_positive_factors": pos_factors,
            "top_negative_factors": neg_factors,
            "shap_factors": all_shap_dict
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"SHAP explanation failed: {str(e)}"
        }


def generate_global_shap_summary(sample_size: int = 500) -> Dict[str, Any]:
    """
    Computes global SHAP feature importance across a dataset sample and saves summary visualizations.
    """
    os.makedirs(PLOTS_DIR, exist_ok=True)
    pipeline = load_model_pipeline()
    if pipeline is None:
        raise FileNotFoundError("Model pipeline best_model.joblib not found.")

    data_path = get_processed_dataset_path("model_features.csv")
    df = pd.read_csv(data_path, nrows=sample_size)
    X = df.drop(columns=['is_successful'])

    prep = pipeline.named_steps['prep']
    clf = pipeline.named_steps['clf']

    X_trans = prep.transform(X)
    raw_feature_names = prep.get_feature_names_out()
    clean_names = [clean_feature_name(n) for n in raw_feature_names]

    explainer = shap.Explainer(clf)
    shap_values = explainer(X_trans)

    # Compute mean absolute SHAP value per feature
    mean_abs_shap = np.abs(shap_values.values).mean(axis=0)
    top_indices = np.argsort(mean_abs_shap)[::-1][:15]

    global_importance = []
    for idx in top_indices:
        global_importance.append({
            "feature": clean_names[idx],
            "raw_feature": raw_feature_names[idx],
            "mean_abs_shap": round(float(mean_abs_shap[idx]), 4)
        })

    # Save Global Importance JSON
    with open(GLOBAL_IMPORTANCE_JSON, "w") as f:
        json.dump({"top_features": global_importance}, f, indent=2)

    # Generate SHAP Bar Chart
    plt.figure(figsize=(10, 6))
    top_features_df = pd.DataFrame(global_importance).sort_values(by="mean_abs_shap", ascending=True)
    plt.barh(top_features_df["feature"], top_features_df["mean_abs_shap"], color="#3498db")
    plt.title("Global SHAP Feature Importance (Mean |SHAP Value|)", fontsize=12, fontweight="bold")
    plt.xlabel("Mean |SHAP Value| (Impact on Model Outcome)", fontsize=10)
    plt.tight_layout()
    chart_path = os.path.join(PLOTS_DIR, "shap_feature_importance.png")
    plt.savefig(chart_path, dpi=200)
    plt.close()

    print(f"Global SHAP summary computed on {sample_size} samples.")
    print(f"Saved SHAP importance chart to: {os.path.abspath(chart_path)}")
    print(f"Saved Global Importance JSON to: {os.path.abspath(GLOBAL_IMPORTANCE_JSON)}")

    return {"top_features": global_importance}


if __name__ == "__main__":
    print("Generating Global SHAP Summary...")
    generate_global_shap_summary(sample_size=500)

    print("\nTesting Individual Prediction Explanation:")
    sample = {
        "title": "Smart Solar Charger",
        "category": "Technology",
        "goalAmount": 5000,
        "durationDays": 30,
        "currency": "USD",
        "country": "US"
    }
    exp = explain_prediction(sample)
    print(json.dumps(exp, indent=2))
