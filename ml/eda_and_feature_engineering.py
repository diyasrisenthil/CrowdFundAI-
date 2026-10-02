"""
CrowdFundAI Exploratory Data Analysis (EDA) & Feature Engineering Module
Performs comprehensive data analysis, generates plots, engineers pre-launch features,
and exports the final training dataset to data/processed/model_features.csv.
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure root directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.data_loader import get_processed_dataset_path

PLOTS_DIR = os.path.join(os.path.dirname(__file__), "..", "notebooks", "eda_plots")
PROCESSED_FEATURES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "model_features.csv")


def run_eda_and_feature_engineering():
    os.makedirs(PLOTS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(PROCESSED_FEATURES_PATH), exist_ok=True)

    print("=" * 75)
    print("      CROWDFUNDAI EDA & FEATURE ENGINEERING PIPELINE      ")
    print("=" * 75)

    # 1. Dataset Summary
    print("\n--- STEP 1: DATASET SUMMARY ---")
    data_path = get_processed_dataset_path("kickstarter_cleaned.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Cleaned dataset not found at {data_path}. Run ml.prepare_dataset first.")

    df = pd.read_csv(data_path)
    print(f"Dataset Shape: {df.shape[0]:,} rows x {df.shape[1]} columns")
    print(f"Memory Usage: {df.memory_usage().sum() / 1024**2:.2f} MB")
    print("\nData Types:")
    print(df.dtypes)

    # 2. Missing Value Analysis
    print("\n--- STEP 2: MISSING VALUE ANALYSIS ---")
    missing = df.isnull().sum()
    print("Missing values per column:")
    print(missing)
    assert missing.sum() == 0, "Cleaned dataset contains unexpected missing values!"

    # 3. Target Distribution
    print("\n--- STEP 3: TARGET DISTRIBUTION ---")
    target_counts = df['is_successful'].value_counts()
    target_props = df['is_successful'].value_counts(normalize=True)
    print(f"Failed (0):     {target_counts.get(0, 0):,} ({target_props.get(0, 0):.2%})")
    print(f"Successful (1): {target_counts.get(1, 0):,} ({target_props.get(1, 0):.2%})")

    # Plot 1: Target Distribution
    plt.figure(figsize=(6, 4))
    sns.barplot(x=['Failed (0)', 'Successful (1)'], y=[target_counts.get(0, 0), target_counts.get(1, 0)], hue=['Failed (0)', 'Successful (1)'], palette=['#e74c3c', '#2ecc71'], legend=False)
    plt.title('Crowdfunding Campaign Outcome Distribution', fontsize=12, fontweight='bold')
    plt.ylabel('Number of Campaigns', fontsize=10)
    for p in plt.gca().patches:
        plt.gca().annotate(f'{int(p.get_height()):,}\n({p.get_height()/len(df):.1%})',
                    (p.get_x() + p.get_width() / 2., p.get_height() / 2),
                    ha='center', va='center', fontsize=10, color='white', fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'target_distribution.png'), dpi=200)
    plt.close()
    print(f"Saved plot: notebooks/eda_plots/target_distribution.png")

    # 4. Numerical Feature Analysis
    print("\n--- STEP 4: NUMERICAL FEATURE ANALYSIS ---")
    num_cols = ['usd_goal_real', 'duration_days', 'name_length', 'name_word_count']
    num_stats = df[num_cols].describe().T
    print(num_stats[['mean', 'std', 'min', '50%', 'max']])

    # 5. Categorical Feature Analysis
    print("\n--- STEP 5: CATEGORICAL FEATURE ANALYSIS ---")
    cat_summary = df.groupby('main_category')['is_successful'].agg(['count', 'mean']).sort_values(by='mean', ascending=False)
    print("Success rate by main category:")
    print(cat_summary)

    # Plot 2: Category Success Rate
    plt.figure(figsize=(10, 5))
    cat_sorted = df.groupby('main_category')['is_successful'].mean().sort_values(ascending=False).reset_index()
    sns.barplot(data=cat_sorted, x='main_category', y='is_successful', hue='main_category', palette='viridis', legend=False)
    plt.axhline(df['is_successful'].mean(), color='red', linestyle='--', label=f'Average Success Rate ({df["is_successful"].mean():.1%})')
    plt.title('Campaign Success Rate by Main Category', fontsize=12, fontweight='bold')
    plt.xlabel('Main Category', fontsize=10)
    plt.ylabel('Success Rate', fontsize=10)
    plt.xticks(rotation=45, ha='right')
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'category_success_rate.png'), dpi=200)
    plt.close()
    print(f"Saved plot: notebooks/eda_plots/category_success_rate.png")

    # Plot 3: Goal vs Success (Log Scale Distribution)
    plt.figure(figsize=(8, 4))
    sns.kdeplot(data=df, x='log_usd_goal', hue='is_successful', common_norm=False, palette=['#e74c3c', '#2ecc71'], fill=True, alpha=0.4)
    plt.title('Log Goal Amount Distribution by Outcome', fontsize=12, fontweight='bold')
    plt.xlabel('Log USD Goal (log1p)', fontsize=10)
    plt.ylabel('Density', fontsize=10)
    plt.legend(labels=['Successful (1)', 'Failed (0)'])
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'goal_vs_success.png'), dpi=200)
    plt.close()
    print(f"Saved plot: notebooks/eda_plots/goal_vs_success.png")

    # 6. Correlation Analysis
    print("\n--- STEP 6: CORRELATION ANALYSIS ---")
    corr_cols = ['is_successful', 'usd_goal_real', 'log_usd_goal', 'duration_days', 'name_length', 'name_word_count', 'launched_year', 'launched_month']
    corr_matrix = df[corr_cols].corr()
    print("Pearson Correlation with 'is_successful':")
    print(corr_matrix['is_successful'].sort_values(ascending=False))

    # Plot 4: Correlation Heatmap
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', vmin=-1, vmax=1, linewidths=0.5)
    plt.title('Numerical Features Correlation Matrix', fontsize=12, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, 'correlation_heatmap.png'), dpi=200)
    plt.close()
    print(f"Saved plot: notebooks/eda_plots/correlation_heatmap.png")

    # 7. Basic Outlier Analysis
    print("\n--- STEP 7: BASIC OUTLIER ANALYSIS ---")
    goal_q99 = df['usd_goal_real'].quantile(0.99)
    print(f"99th percentile of USD Goal: ${goal_q99:,.2f}")
    print(f"Extreme goals (> $1M): {(df['usd_goal_real'] > 1e6).sum():,} campaigns ({ (df['usd_goal_real'] > 1e6).mean():.2%})")

    # 8. Feature Engineering
    print("\n--- STEP 8: FEATURE ENGINEERING ---")
    df_feat = df.copy()

    # Feature A: Daily Goal Target (Money required per day of campaign)
    df_feat['goal_per_day'] = df_feat['usd_goal_real'] / (df_feat['duration_days'] + 1.0)
    df_feat['log_goal_per_day'] = np.log1p(df_feat['goal_per_day'])

    # Feature B: Historical Category Success Rate
    category_success_map = df_feat.groupby('main_category')['is_successful'].transform('mean')
    df_feat['category_success_rate'] = category_success_map

    # Feature C: Goal to Category Median Ratio
    category_median_goal_map = df_feat.groupby('main_category')['usd_goal_real'].transform('median')
    df_feat['goal_to_cat_median_ratio'] = df_feat['usd_goal_real'] / (category_median_goal_map + 1.0)
    df_feat['log_goal_to_cat_median_ratio'] = np.log1p(df_feat['goal_to_cat_median_ratio'])

    # Feature D: Currency & Country binary flags
    df_feat['is_usd_currency'] = (df_feat['currency'] == 'USD').astype(int)
    df_feat['is_top_country'] = (df_feat['country'].isin(['US', 'GB', 'CA'])).astype(int)

    # Feature E: Launch Time features
    df_feat['is_weekend_launch'] = (df_feat['launched_day_of_week'] >= 5).astype(int)
    df_feat['launched_quarter'] = ((df_feat['launched_month'] - 1) // 3 + 1).astype(int)

    print(f"Engineered features added. Updated shape: {df_feat.shape}")

    # 9. Final Feature Selection
    print("\n--- STEP 9: FINAL FEATURE SELECTION & EXPORT ---")
    selected_columns = [
        # Categorical columns
        'category',
        'main_category',
        'currency',
        'country',

        # Pre-launch Numerical & Engineered Features
        'usd_goal_real',
        'log_usd_goal',
        'duration_days',
        'name_length',
        'name_word_count',
        'goal_per_day',
        'log_goal_per_day',
        'category_success_rate',
        'goal_to_cat_median_ratio',
        'log_goal_to_cat_median_ratio',
        'is_usd_currency',
        'is_top_country',
        'is_weekend_launch',
        'launched_year',
        'launched_month',
        'launched_day_of_week',
        'launched_hour',
        'launched_quarter',

        # Target Label
        'is_successful'
    ]

    df_final = df_feat[selected_columns].copy()
    df_final.to_csv(PROCESSED_FEATURES_PATH, index=False)

    print(f"Final training feature dataset saved to: {os.path.abspath(PROCESSED_FEATURES_PATH)}")
    print(f"Final Dataset Dimensions: {df_final.shape[0]:,} rows x {df_final.shape[1]} columns")
    print("\nEngineered Feature Summary:")
    print(df_final.dtypes)

    print("=" * 75)
    print("  EDA & FEATURE ENGINEERING PIPELINE COMPLETED SUCCESSFULLY!")
    print("=" * 75)


if __name__ == "__main__":
    run_eda_and_feature_engineering()
