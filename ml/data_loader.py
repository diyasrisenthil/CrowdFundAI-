"""
Data Loader Module for CrowdFundAI
Handles loading raw and processed crowdfunding datasets.
"""

import os
from typing import Optional
import pandas as pd


def get_raw_dataset_path(filename: str = "ks-projects-201801.csv") -> str:
    """Returns absolute path to the raw dataset file."""
    return os.path.join(os.path.dirname(__file__), "..", "data", "raw", filename)


def get_processed_dataset_path(filename: str = "kickstarter_cleaned.csv") -> str:
    """Returns absolute path to the processed dataset file."""
    return os.path.join(os.path.dirname(__file__), "..", "data", "processed", filename)


def load_raw_dataset(filename: str = "ks-projects-201801.csv") -> Optional[pd.DataFrame]:
    """
    Load raw crowdfunding dataset from data/raw directory.
    Supports UTF-8 and Latin-1 fallbacks for robust CSV parsing.
    """
    filepath = get_raw_dataset_path(filename)

    if not os.path.exists(filepath):
        print(f"Raw dataset file not found at: {filepath}")
        return None

    try:
        df = pd.read_csv(filepath, encoding='utf-8')
        print(f"Loaded raw dataset ({len(df):,} rows, {len(df.columns)} columns) with UTF-8 encoding.")
        return df
    except UnicodeDecodeError:
        df = pd.read_csv(filepath, encoding='latin1')
        print(f"Loaded raw dataset ({len(df):,} rows, {len(df.columns)} columns) with Latin-1 encoding.")
        return df
    except Exception as e:
        print(f"Error loading raw dataset: {e}")
        return None


def load_processed_dataset(filename: str = "kickstarter_cleaned.csv") -> Optional[pd.DataFrame]:
    """
    Load cleaned and preprocessed dataset from data/processed directory.
    """
    filepath = get_processed_dataset_path(filename)

    if not os.path.exists(filepath):
        print(f"Processed dataset file not found at: {filepath}")
        return None

    try:
        df = pd.read_csv(filepath)
        print(f"Loaded processed dataset ({len(df):,} rows, {len(df.columns)} columns).")
        return df
    except Exception as e:
        print(f"Error loading processed dataset: {e}")
        return None


def save_processed_dataset(df: pd.DataFrame, filename: str = "kickstarter_cleaned.csv") -> bool:
    """
    Save processed dataset dataframe to data/processed directory.
    """
    processed_dir = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
    os.makedirs(processed_dir, exist_ok=True)
    filepath = os.path.join(processed_dir, filename)

    try:
        df.to_csv(filepath, index=False)
        print(f"Cleaned dataset successfully saved to: {os.path.abspath(filepath)}")
        return True
    except Exception as e:
        print(f"Error saving processed dataset: {e}")
        return False
