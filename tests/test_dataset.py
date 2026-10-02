"""
Unit tests for Dataset & Preprocessing Pipeline
"""

import sys
import os
import unittest
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.data_loader import get_processed_dataset_path, load_processed_dataset
from ml.preprocessing import LEAKAGE_COLUMNS, IRRELEVANT_COLUMNS


class TestDatasetPipeline(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.processed_path = get_processed_dataset_path()
        cls.df = load_processed_dataset()

    def test_processed_dataset_exists(self):
        self.assertTrue(os.path.exists(self.processed_path), "Processed dataset file should exist.")
        self.assertIsNotNone(self.df, "Processed dataset dataframe should not be None.")

    def test_dataset_row_and_column_counts(self):
        self.assertGreater(len(self.df), 100000, "Cleaned dataset should have over 100k rows.")
        self.assertEqual(len(self.df.columns), 14, "Cleaned dataset should have exactly 14 columns.")

    def test_target_variable_integrity(self):
        self.assertIn('is_successful', self.df.columns, "Target variable 'is_successful' must be present.")
        unique_vals = set(self.df['is_successful'].unique())
        self.assertEqual(unique_vals, {0, 1}, "Target variable must be binary (0 and 1).")

    def test_target_leakage_prevention(self):
        # Verify no post-launch leakage columns exist in the processed dataset
        for col in ['pledged', 'backers', 'usd pledged', 'usd_pledged_real']:
            self.assertNotIn(col, self.df.columns, f"Target leakage column '{col}' must NOT be in processed dataset.")

    def test_engineered_features(self):
        expected_features = ['duration_days', 'name_length', 'name_word_count', 'log_usd_goal', 'launched_year']
        for feat in expected_features:
            self.assertIn(feat, self.df.columns, f"Engineered feature '{feat}' must be present.")

    def test_no_missing_values_in_key_features(self):
        null_counts = self.df[['is_successful', 'usd_goal_real', 'duration_days']].isnull().sum()
        self.assertEqual(null_counts.sum(), 0, "Key features must have 0 missing values.")


if __name__ == "__main__":
    unittest.main()
