"""
Unit tests for Machine Learning Model Training & Inference Pipeline
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import load_model_pipeline, predict_campaign_success


class TestModelTraining(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.model_dir = os.path.join(os.path.dirname(__file__), "..", "models")
        cls.best_model_path = os.path.join(cls.model_dir, "best_model.joblib")
        cls.json_path = os.path.join(cls.model_dir, "model_comparison.json")
        cls.md_path = os.path.join(cls.model_dir, "MODEL_COMPARISON.md")

    def test_best_model_artifact_exists(self):
        self.assertTrue(os.path.exists(self.best_model_path), "best_model.joblib must exist in models/")

    def test_pipeline_loading(self):
        pipeline = load_model_pipeline(self.best_model_path)
        self.assertIsNotNone(pipeline, "Trained model pipeline must load successfully.")

    def test_comparison_artifacts_exist(self):
        self.assertTrue(os.path.exists(self.json_path), "model_comparison.json must exist in models/")
        self.assertTrue(os.path.exists(self.md_path), "MODEL_COMPARISON.md must exist in models/")

    def test_real_model_inference(self):
        sample_campaign = {
            "title": "Smart Solar Charger",
            "category": "Technology",
            "goalAmount": 10000,
            "durationDays": 30
        }
        res = predict_campaign_success(sample_campaign)
        self.assertTrue(res["success"], "Inference must return success=True")
        self.assertIn("success_probability", res)
        self.assertGreaterEqual(res["success_probability"], 0.0)
        self.assertLessEqual(res["success_probability"], 1.0)
        self.assertIn(res["prediction"], [0, 1])


if __name__ == "__main__":
    unittest.main()
