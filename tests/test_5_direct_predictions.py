import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import predict_campaign_success, build_feature_dataframe

tests = [
    {
        "test_name": "TEST 1: Low goal + short campaign + Technology",
        "campaign": {
            "title": "Compact Portable USB Solar Battery Charger",
            "category": "Technology",
            "subCategory": "Gadgets",
            "fundingGoal": 500,
            "campaignDuration": 10,
            "country": "US",
            "currency": "USD"
        }
    },
    {
        "test_name": "TEST 2: Very high goal + long campaign + Technology",
        "campaign": {
            "title": "Quantum Microchip Supercomputer Facility Project Enterprise",
            "category": "Technology",
            "subCategory": "Software",
            "fundingGoal": 10000000,
            "campaignDuration": 60,
            "country": "US",
            "currency": "USD"
        }
    },
    {
        "test_name": "TEST 3: Low goal + medium campaign + Games",
        "campaign": {
            "title": "Fantasy Dungeon Quest Card Game Deck",
            "category": "Games",
            "subCategory": "Tabletop Games",
            "fundingGoal": 500,
            "campaignDuration": 30,
            "country": "US",
            "currency": "USD"
        }
    },
    {
        "test_name": "TEST 4: High goal + short campaign + Film & Video",
        "campaign": {
            "title": "Hollywood Studio Feature Film Action Blockbuster Movie",
            "category": "Film & Video",
            "subCategory": "Documentary",
            "fundingGoal": 500000,
            "campaignDuration": 15,
            "country": "US",
            "currency": "USD"
        }
    },
    {
        "test_name": "TEST 5: Medium goal + medium campaign + Art",
        "campaign": {
            "title": "Interactive Digital Art Exhibition Gallery Experience",
            "category": "Art",
            "subCategory": "Digital Art",
            "fundingGoal": 2000,
            "campaignDuration": 25,
            "country": "US",
            "currency": "USD"
        }
    }
]

if __name__ == "__main__":
    print("=======================================================================")
    print("          DIRECT MODEL INFERENCE TEST (ZERO FRONTEND INTERACTION)      ")
    print("=======================================================================")

    for t in tests:
        c = t["campaign"]
        df_feat = build_feature_dataframe(c)
        res = predict_campaign_success(c)
        
        print(f"\n---> {t['test_name']}")
        print(f"     Inputs: Goal=${c['fundingGoal']:,}, Duration={c['campaignDuration']}d, Category='{c['category']}' ({c['subCategory']})")
        print(f"     Title: '{c['title']}'")
        print(f"     Engineered Features Sample: log_usd_goal={df_feat['log_usd_goal'].values[0]:.2f}, goal_per_day=${df_feat['goal_per_day'].values[0]:.2f}, cat_success_rate={df_feat['category_success_rate'].values[0]:.4f}")
        print(f"     Raw Model Probability: {res['success_probability']:.4f} ({res['success_probability']*100:.2f}%)")
        print(f"     Predicted Outcome Class: {res['prediction']} ({res['predicted_status']})")

    print("=======================================================================")

