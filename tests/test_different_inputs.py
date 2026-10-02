import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import predict_campaign_success
from ml.explainability import explain_prediction

tests = [
    {
        "name": "Test A: Low goal, short duration, Technology",
        "input": {
            "title": "Tiny Tech Accessory",
            "category": "Technology",
            "subCategory": "Gadgets",
            "goalAmount": 100,
            "durationDays": 10
        }
    },
    {
        "name": "Test B: High goal, long duration, Technology",
        "input": {
            "title": "Huge Supercomputer Project Mega Enterprise Solution",
            "category": "Technology",
            "subCategory": "Gadgets",
            "goalAmount": 10000000,
            "durationDays": 60
        }
    },
    {
        "name": "Test C: Low goal, medium duration, Comics",
        "input": {
            "title": "Indie Graphic Novel Issue 1",
            "category": "Comics",
            "subCategory": "Comic Books",
            "goalAmount": 500,
            "durationDays": 30
        }
    },
    {
        "name": "Test D: High goal, short duration, Food",
        "input": {
            "title": "Luxury Gourmet Restaurant Experience Chain",
            "category": "Food & Craft",
            "subCategory": "Food",
            "goalAmount": 500000,
            "durationDays": 15
        }
    },
    {
        "name": "Test E: Different goal, duration, category & title",
        "input": {
            "title": "Acoustic Folk Song Album Recording",
            "category": "Music",
            "subCategory": "Music",
            "goalAmount": 1500,
            "durationDays": 21
        }
    }
]

if __name__ == "__main__":
    print("=== TESTING /predict FUNCTION / API LOGIC ===")
    for t in tests:
        res = predict_campaign_success(t["input"])
        exp = explain_prediction(t["input"])
        print(f"\n{t['name']}:")
        print(f"  Input: {t['input']}")
        print(f"  Predict result: success_probability={res.get('success_probability')}, status={res.get('predicted_status')}")
        print(f"  Explain result: success_probability={exp.get('success_probability')}, status={exp.get('predicted_status')}")

