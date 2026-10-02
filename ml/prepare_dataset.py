"""
CrowdFundAI Dataset Preparation Pipeline
Executes data loading, validation, cleaning, target leakage prevention,
feature engineering, and saves the cleaned dataset to data/processed/.
"""

import sys
import os

# Ensure root directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.download_dataset import download_kickstarter_dataset
from ml.data_loader import load_raw_dataset, save_processed_dataset
from ml.preprocessing import clean_and_prepare_dataset


def run_pipeline():
    print("=" * 70)
    print("      CROWDFUNDAI DATA PREPARATION & PREPROCESSING PIPELINE      ")
    print("=" * 70)

    # Step 1: Validate / Download raw dataset
    raw_path = download_kickstarter_dataset()
    if not os.path.exists(raw_path):
        print(f"Error: Raw dataset not found at {raw_path}")
        sys.exit(1)

    # Step 2: Load dataset
    print("\n[1/5] Loading raw dataset...")
    df_raw = load_raw_dataset()
    if df_raw is None or df_raw.empty:
        print("Error: Failed to load raw dataset.")
        sys.exit(1)

    # Step 3: Inspect raw data
    print(f"\n[2/5] Initial Dataset Summary:")
    print(f"  - Total Rows: {len(df_raw):,}")
    print(f"  - Total Columns: {len(df_raw.columns)}")
    print(f"  - Columns: {list(df_raw.columns)}")
    print(f"  - Duplicates Count: {df_raw.duplicated(subset=['ID'] if 'ID' in df_raw.columns else None).sum():,}")
    print(f"  - Missing Values per Column:")
    for col, null_cnt in df_raw.isnull().sum().items():
        if null_cnt > 0:
            print(f"      * {col}: {null_cnt:,} ({null_cnt / len(df_raw):.2%})")

    # Step 4: Preprocessing & Target Leakage Prevention
    print("\n[3/5] Cleaning data, engineering features, and preventing target leakage...")
    df_cleaned = clean_and_prepare_dataset(df_raw)

    # Step 5: Save cleaned dataset
    print("\n[4/5] Saving cleaned dataset to data/processed/...")
    success = save_processed_dataset(df_cleaned, filename="kickstarter_cleaned.csv")
    if not success:
        print("Error: Failed to save processed dataset.")
        sys.exit(1)

    # Step 6: Print final pipeline verification summary
    print("\n[5/5] Pipeline Execution Summary:")
    print("  - Output File: data/processed/kickstarter_cleaned.csv")
    print(f"  - Final Cleaned Rows: {len(df_cleaned):,}")
    print(f"  - Final Feature Count: {len(df_cleaned.columns)}")
    print("  - Features Included:")
    for col in df_cleaned.columns:
        print(f"      * {col} ({df_cleaned[col].dtype})")
    
    target_cnts = df_cleaned['is_successful'].value_counts()
    print("  - Target Variable ('is_successful') Class Balance:")
    print(f"      * Failed (0): {target_cnts.get(0, 0):,} ({target_cnts.get(0, 0)/len(df_cleaned):.2%})")
    print(f"      * Successful (1): {target_cnts.get(1, 0):,} ({target_cnts.get(1, 0)/len(df_cleaned):.2%})")

    print("=" * 70)
    print("  DATA PREPROCESSING PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    run_pipeline()
