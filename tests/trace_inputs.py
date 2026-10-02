import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import predict_campaign_success, build_feature_dataframe

inp_a = {
    'campaignName': 'Tiny USB Charger',
    'title': 'Tiny USB Charger',
    'category': 'Technology',
    'subCategory': 'Gadgets',
    'fundingGoal': 100,
    'goalAmount': 100,
    'campaignDuration': 7,
    'durationDays': 7,
    'country': 'US',
    'currency': 'USD',
    'launched_month': 5,
    'launched_hour': 10
}

inp_b = {
    'campaignName': 'Mega Sci-Fi Blockbuster Movie',
    'title': 'Mega Sci-Fi Blockbuster Movie',
    'category': 'Film & Video',
    'subCategory': 'Documentary',
    'fundingGoal': 5000000,
    'goalAmount': 5000000,
    'campaignDuration': 60,
    'durationDays': 60,
    'country': 'US',
    'currency': 'USD',
    'launched_month': 11,
    'launched_hour': 20
}

print("=======================================================================")
print("                   STEP 2: END-TO-END INPUT TRACE                      ")
print("=======================================================================")

print("\n--- INPUT A (Low Goal $100, 7 Days, Tech Gadgets) ---")
print("Frontend Payload A:", json.dumps(inp_a, indent=2))
feat_a = build_feature_dataframe(inp_a)
print("\nGenerated Model Feature Vector A (22 features):")
print(json.dumps(feat_a.to_dict(orient='records')[0], indent=2))
res_a = predict_campaign_success(inp_a)
print(f"\nRaw Model Probability A: {res_a['success_probability']:.4f} ({res_a['success_probability']*100:.2f}%)")
print(f"Predicted Status A: {res_a['predicted_status']}")

print("\n-----------------------------------------------------------------------")

print("\n--- INPUT B (High Goal $5,000,000, 60 Days, Film Documentary) ---")
print("Frontend Payload B:", json.dumps(inp_b, indent=2))
feat_b = build_feature_dataframe(inp_b)
print("\nGenerated Model Feature Vector B (22 features):")
print(json.dumps(feat_b.to_dict(orient='records')[0], indent=2))
res_b = predict_campaign_success(inp_b)
print(f"\nRaw Model Probability B: {res_b['success_probability']:.4f} ({res_b['success_probability']*100:.2f}%)")
print(f"Predicted Status B: {res_b['predicted_status']}")

print("=======================================================================")
