"""
Unit tests for Feature Engineering & Training Feature Dataset
"""

import sys
import os
import unittest
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


class TestFeatureEngineering(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.features_path = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "model_features.csv")
        cls.df = pd.read_csv(cls.features_path) if os.path.exists(cls.features_path) else None

    def test_model_features_file_exists(self):
        self.assertTrue(os.path.exists(self.features_path), "model_features.csv should exist in data/processed/")
        self.assertIsNotNone(self.df, "model_features dataframe should load successfully.")

    def test_engineered_feature_columns(self):
        expected_cols = [
            'usd_goal_real', 'log_usd_goal', 'duration_days', 'name_length', 'name_word_count',
            'goal_per_day', 'log_goal_per_day', 'category_success_rate', 'goal_to_cat_median_ratio',
            'log_goal_to_cat_median_ratio', 'is_usd_currency', 'is_top_country', 'is_weekend_launch',
            'launched_year', 'launched_month', 'launched_day_of_week', 'launched_hour', 'launched_quarter',
            'is_successful'
        ]
        for col in expected_cols:
            self.assertIn(col, self.df.columns, f"Engineered column '{col}' missing from model_features.csv")

    def test_target_variable_in_features(self):
        self.assertIn('is_successful', self.df.columns)
        self.assertEqual(set(self.df['is_successful'].unique()), {0, 1})

    def test_no_missing_values(self):
        self.assertEqual(self.df.isnull().sum().sum(), 0, "model_features.csv must contain 0 missing values.")

    def test_no_target_leakage_columns(self):
        leakage_cols = ['pledged', 'backers', 'usd pledged', 'usd_pledged_real']
        for col in leakage_cols:
            self.assertNotIn(col, self.df.columns, f"Target leakage column '{col}' must not be present.")


if __name__ == "__main__":
    unittest.main()
