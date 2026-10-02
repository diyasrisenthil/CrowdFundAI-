"""
Unit tests for Explainable AI (XAI) & SHAP Explanations
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.explainability import explain_prediction, generate_global_shap_summary


class TestExplainability(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.sample_campaign = {
            "title": "Eco Smart Water Bottle",
            "category": "Technology",
            "subCategory": "Gadgets",
            "goalAmount": 5000,
            "durationDays": 30,
            "currency": "USD",
            "country": "US"
        }

    def test_explain_prediction_structure(self):
        res = explain_prediction(self.sample_campaign)
        self.assertTrue(res["success"], "SHAP explanation should return success=True")
        self.assertIn("top_positive_factors", res)
        self.assertIn("top_negative_factors", res)
        self.assertIn("shap_factors", res)
        self.assertIn("base_value", res)

    def test_positive_and_negative_factors_non_empty(self):
        res = explain_prediction(self.sample_campaign)
        pos = res["top_positive_factors"]
        neg = res["top_negative_factors"]
        self.assertIsInstance(pos, list)
        self.assertIsInstance(neg, list)

        if len(pos) > 0:
            self.assertGreater(pos[0]["impact"], 0)
            self.assertIn("feature", pos[0])
            self.assertIn("description", pos[0])

        if len(neg) > 0:
            self.assertLess(neg[0]["impact"], 0)
            self.assertIn("feature", neg[0])
            self.assertIn("description", neg[0])

    def test_global_shap_summary(self):
        global_summary = generate_global_shap_summary(sample_size=50)
        self.assertIn("top_features", global_summary)
        self.assertGreater(len(global_summary["top_features"]), 0)


if __name__ == "__main__":
    unittest.main()
