"""
Data Preprocessing Module for CrowdFundAI
Cleans raw Kickstarter campaign data, engineers pre-launch features,
handles missing values, removes duplicates, and prevents target leakage.
"""

from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd


LEAKAGE_COLUMNS = [
    'pledged',
    'backers',
    'usd pledged',
    'usd_pledged_real',
    'state'  # Replaced by target column 'is_successful'
]

IRRELEVANT_COLUMNS = [
    'ID',
    'goal',  # Replaced by standardized 'usd_goal_real'
    'name'   # Engineered into name_length & name_word_count
]


def clean_and_prepare_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Full data-preparation pipeline:
    1. Removes duplicates.
    2. Filters target state to 'successful' and 'failed'.
    3. Handles missing values.
    4. Converts dates and engineers pre-launch features.
    5. Strips target leakage columns.
    6. Returns clean, structured dataset ready for ML modeling.
    """
    initial_rows = len(df)
    initial_cols = len(df.columns)
    print(f"Starting data preprocessing on {initial_rows:,} rows and {initial_cols} columns...")

    data = df.copy()

    # 1. Remove duplicates
    if 'ID' in data.columns:
        data = data.drop_duplicates(subset=['ID'])
    else:
        data = data.drop_duplicates()
    print(f"Rows after removing duplicates: {len(data):,} (dropped {initial_rows - len(data):,})")

    # 2. Filter target variable ('state' -> 'successful' or 'failed')
    data = data[data['state'].isin(['successful', 'failed'])].copy()
    data['is_successful'] = (data['state'] == 'successful').astype(int)
    print(f"Rows after filtering to valid target states ('successful'/'failed'): {len(data):,}")

    # 3. Handle missing values
    data['name'] = data['name'].fillna('Untitled').astype(str)
    data['category'] = data['category'].fillna('Unknown').astype(str).str.strip()
    data['main_category'] = data['main_category'].fillna('Unknown').astype(str).str.strip()
    data['currency'] = data['currency'].fillna('USD').astype(str).str.strip()
    data['country'] = data['country'].replace('N,0"', 'UNKNOWN').fillna('UNKNOWN').astype(str).str.strip()
    data['usd_goal_real'] = pd.to_numeric(data['usd_goal_real'], errors='coerce').fillna(data['usd_goal_real'].median())

    # 4. Feature Engineering (Pre-launch features only)
    # Name features
    data['name_length'] = data['name'].apply(len)
    data['name_word_count'] = data['name'].apply(lambda s: len(s.split()))

    # Datetime features & campaign duration
    data['launched'] = pd.to_datetime(data['launched'], errors='coerce')
    data['deadline'] = pd.to_datetime(data['deadline'], errors='coerce')

    # Drop rows with unparseable dates if any
    data = data.dropna(subset=['launched', 'deadline']).copy()

    # Duration in days
    data['duration_days'] = ((data['deadline'] - data['launched']).dt.total_seconds() / 86400.0).round(2)

    # Filter out anomalous duration values (e.g. invalid negative or corrupted dates)
    data = data[(data['duration_days'] > 0) & (data['duration_days'] <= 100)].copy()

    data['launched_year'] = data['launched'].dt.year
    data['launched_month'] = data['launched'].dt.month
    data['launched_day_of_week'] = data['launched'].dt.dayofweek
    data['launched_hour'] = data['launched'].dt.hour

    # Log goal feature (helps ML algorithms handle skewed money distributions)
    data['log_usd_goal'] = np.log1p(data['usd_goal_real'])

    # Drop datetime objects after feature extraction
    data = data.drop(columns=['launched', 'deadline'])

    # 5. Prevent Target Leakage & Remove Irrelevant Columns
    cols_to_drop = [col for col in (LEAKAGE_COLUMNS + IRRELEVANT_COLUMNS) if col in data.columns]
    data = data.drop(columns=cols_to_drop)

    print(f"Final clean dataset shape: {data.shape[0]:,} rows x {data.shape[1]} columns")
    print(f"Target distribution ('is_successful'):\n{data['is_successful'].value_counts(normalize=True).to_dict()}")

    return data
