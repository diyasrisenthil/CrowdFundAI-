"""
Integration tests for FastAPI /predict and /explain endpoints using TestClient.
"""

import sys
import os
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


class TestApiEndpoints(unittest.TestCase):

    def setUp(self):
        self.tests = [
            {
                "test_id": "Test A (Low Goal, Short Duration, Technology)",
                "payload": {
                    "title": "Tiny Tech Accessory",
                    "campaignName": "Tiny Tech Accessory",
                    "category": "Technology",
                    "subCategory": "Gadgets",
                    "goalAmount": 100,
                    "fundingGoal": 100,
                    "durationDays": 10,
                    "campaignDuration": 10,
                    "currency": "USD",
                    "country": "US"
                }
            },
            {
                "test_id": "Test B (Very High Goal, Long Duration, Technology)",
                "payload": {
                    "title": "Huge Supercomputer Project Mega Enterprise Solution",
                    "campaignName": "Huge Supercomputer Project Mega Enterprise Solution",
                    "category": "Technology",
                    "subCategory": "Gadgets",
                    "goalAmount": 10000000,
                    "fundingGoal": 10000000,
                    "durationDays": 60,
                    "campaignDuration": 60,
                    "currency": "USD",
                    "country": "US"
                }
            },
            {
                "test_id": "Test C (Low Goal, Medium Duration, Publishing / Comics)",
                "payload": {
                    "title": "Indie Graphic Novel Issue 1",
                    "campaignName": "Indie Graphic Novel Issue 1",
                    "category": "Publishing",
                    "subCategory": "Fiction",
                    "goalAmount": 500,
                    "fundingGoal": 500,
                    "durationDays": 30,
                    "campaignDuration": 30,
                    "currency": "USD",
                    "country": "US"
                }
            },
            {
                "test_id": "Test D (High Goal, Short Duration, Food & Craft)",
                "payload": {
                    "title": "Luxury Gourmet Restaurant Experience Chain",
                    "campaignName": "Luxury Gourmet Restaurant Experience Chain",
                    "category": "Food & Craft",
                    "subCategory": "Food",
                    "goalAmount": 500000,
                    "fundingGoal": 500000,
                    "durationDays": 15,
                    "campaignDuration": 15,
                    "currency": "USD",
                    "country": "US"
                }
            },
            {
                "test_id": "Test E (Substantially Different Goal, Duration, Category & Title - Music)",
                "payload": {
                    "title": "Acoustic Folk Song Album Recording",
                    "campaignName": "Acoustic Folk Song Album Recording",
                    "category": "Music",
                    "subCategory": "Music",
                    "goalAmount": 1500,
                    "fundingGoal": 1500,
                    "durationDays": 21,
                    "campaignDuration": 21,
                    "currency": "USD",
                    "country": "US"
                }
            }
        ]

    def test_all_api_endpoint_payloads(self):
        for t in self.tests:
            test_id = t["test_id"]
            payload = t["payload"]

            resp_p = client.post("/predict", json=payload)
            self.assertEqual(resp_p.status_code, 200, f"Failed /predict for {test_id}")
            res_predict = resp_p.json()

            resp_e = client.post("/explain", json=payload)
            self.assertEqual(resp_e.status_code, 200, f"Failed /explain for {test_id}")
            res_explain = resp_e.json()

            self.assertIn(res_predict["prediction"], ["Successful", "Failed"])
            self.assertIn(res_explain["prediction"], ["Successful", "Failed"])
            self.assertEqual(
                res_predict["probability"],
                res_explain["probability"],
                f"Mismatch in probability between /predict and /explain for {test_id}"
            )


if __name__ == "__main__":
    unittest.main()

