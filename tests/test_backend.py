"""
Backend API Comprehensive Unit & Integration Tests
Tests /health, /predict, /explain endpoints and input validation.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


class TestBackendAPI(unittest.TestCase):

    def test_root_endpoint(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")

    def test_health_endpoint(self):
        # Test both /health and /api/health
        for endpoint in ["/health", "/api/health"]:
            response = client.get(endpoint)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn("status", data)
            self.assertEqual(data["service"], "CrowdFundAI ML Gateway")
            self.assertTrue(data["isModelLoaded"])

    def test_predict_endpoint_valid_input(self):
        valid_sample = {
            "title": "Solar Powered Wireless Earbuds",
            "category": "Technology",
            "subCategory": "Gadgets",
            "goalAmount": 5000.0,
            "durationDays": 30,
            "currency": "USD",
            "country": "US"
        }
        for endpoint in ["/predict", "/api/predictions"]:
            response = client.post(endpoint, json=valid_sample)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertTrue(data["success"])
            self.assertIn(data["prediction"], ["Successful", "Failed"])
            self.assertGreaterEqual(data["probability"], 0.0)
            self.assertLessEqual(data["probability"], 1.0)

    def test_predict_endpoint_invalid_input(self):
        # Negative goal amount should fail Pydantic validation (422)
        invalid_sample = {
            "title": "Invalid Goal Project",
            "category": "Technology",
            "goalAmount": -100.0,
            "durationDays": 30
        }
        response = client.post("/predict", json=invalid_sample)
        self.assertEqual(response.status_code, 422)

    def test_explain_endpoint_valid_input(self):
        valid_sample = {
            "title": "Artistic Board Game",
            "category": "Games",
            "subCategory": "Tabletop Games",
            "goalAmount": 3000.0,
            "durationDays": 25,
            "currency": "USD",
            "country": "US"
        }
        for endpoint in ["/explain", "/api/explain"]:
            response = client.post(endpoint, json=valid_sample)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertTrue(data["success"])
            self.assertIn(data["prediction"], ["Successful", "Failed"])
            self.assertIn("top_positive_factors", data)
            self.assertIn("top_negative_factors", data)
            self.assertIn("shap_factors", data)

    def test_list_models_endpoint(self):
        response = client.get("/api/models")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("models", data)
        self.assertGreater(data["count"], 0)


if __name__ == "__main__":
    unittest.main()
