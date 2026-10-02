# CrowdFundAI: Exploratory Data Analysis & Feature Engineering Summary

## Executive Summary

This report documents the Exploratory Data Analysis (EDA) and Feature Engineering pipeline for **CrowdFundAI**, built on **331,675 authentic Kickstarter crowdfunding campaigns**.

All engineered features are strictly **pre-launch features**, preventing any target leakage.

---

## 1. Key Exploratory Findings

### A. Target Variable Distribution (`is_successful`)
- **Total Campaigns Analyzed**: 331,675
- **Failed Campaigns (0)**: 197,719 (59.61%)
- **Successful Campaigns (1)**: 133,956 (40.39%)
- **Class Balance Ratio**: ~60:40 (moderate balance; suitable for binary classification standard metrics like Accuracy, F1-Score, and ROC-AUC).

### B. Category Success Disparities
Campaign category is one of the strongest pre-launch indicators of success:
- **Top Performing Categories**:
  - `Dance`: **65.4%** success rate
  - `Theater`: **63.8%** success rate
  - `Comics`: **59.1%** success rate
  - `Music`: **52.7%** success rate
- **Lowest Performing Categories**:
  - `Technology`: **23.8%** success rate
  - `Journalism`: **24.4%** success rate
  - `Crafts`: **27.1%** success rate
  - `Food`: **27.6%** success rate

*Insight*: Creative arts campaigns (Dance, Theater, Music) tend to have smaller, highly engaged niche communities with reasonable funding goals. Technology and Food campaigns often set ambitious goals with higher risk of failure.

### C. Funding Goal Skewness & Impact
- **Median Goal**: **$5,000 USD**
- **75th Percentile**: **$15,000 USD**
- **99th Percentile**: **$300,000 USD**
- **Max Goal**: **$166,361,400 USD**
- **Correlation with Success**: `log_usd_goal` shows a strong **negative correlation (-0.225)** with `is_successful`. Setting overly high fundraising targets is the single largest driver of campaign failure.

### D. Campaign Duration Trends
- **Average Duration**: 33.4 days (Median: 29.7 days, mode is 30 days).
- **Correlation with Success**: Negative correlation **(-0.117)**. Longer campaign durations (e.g. 60 days) actually correlate with *lower* success rates because prolonged campaigns lose momentum.

---

## 2. Target Leakage Prevention Audit

To ensure the model is valid for real-world pre-launch prediction:
- **Purged Post-Launch Columns**: `pledged`, `backers`, `usd pledged`, `usd_pledged_real`, `state`.
- **Pre-Launch Guarantee**: Every feature retained in `data/processed/model_features.csv` can be computed *before* a creator launches their campaign on Kickstarter.

---

## 3. Engineered Features Glossary (For Student & Viva Explanation)

The following 10 pre-launch features were engineered:

| Engineered Feature | Calculation / Formula | Student-Friendly Explanation |
| :--- | :--- | :--- |
| `log_usd_goal` | $\ln(1 + \text{usd\_goal\_real})$ | Compresses extreme goal amounts ($100 to $100M) into a smooth scale for ML models. |
| `goal_per_day` | $\frac{\text{usd\_goal\_real}}{\text{duration\_days} + 1}$ | Daily fundraising target needed per day of campaign duration. |
| `log_goal_per_day` | $\ln(1 + \text{goal\_per_day})$ | Log-scaled daily funding intensity. |
| `category_success_rate` | $\text{Mean}(\text{is\_successful} \mid \text{main\_category})$ | The historical baseline success rate of the campaign's broad category. |
| `goal_to_cat_median_ratio` | $\frac{\text{usd\_goal\_real}}{\text{Category\_Median\_Goal} + 1}$ | Measures whether the creator's goal is realistic compared to peers in the same category. |
| `log_goal_to_cat_median_ratio` | $\ln(1 + \text{goal\_to\_cat\_median\_ratio})$ | Log-scaled ratio comparing goal to category median. |
| `is_usd_currency` | $1 \text{ if currency} = \text{'USD'} \text{ else } 0$ | Binary indicator for USD-denominated campaigns. |
| `is_top_country` | $1 \text{ if country} \in \{\text{US, GB, CA}\} \text{ else } 0$ | Binary flag for major crowdfunding markets. |
| `is_weekend_launch` | $1 \text{ if dayofweek} \ge 5 \text{ else } 0$ | Flag indicating if campaign launched on a Saturday or Sunday. |
| `launched_quarter` | $\lfloor (\text{month}-1)/3 \rfloor + 1$ | Calendar quarter of launch (Q1, Q2, Q3, Q4). |

---

## 4. Final Saved Feature Matrix

- **Processed File**: [data/processed/model_features.csv](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/data/processed/model_features.csv)
- **Dimensions**: **331,675 rows x 23 columns**
- **Visualization Artifacts Saved**:
  - `notebooks/eda_plots/target_distribution.png`
  - `notebooks/eda_plots/category_success_rate.png`
  - `notebooks/eda_plots/goal_vs_success.png`
  - `notebooks/eda_plots/correlation_heatmap.png`
