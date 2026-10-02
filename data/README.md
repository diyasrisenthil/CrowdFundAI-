# CrowdFundAI Data Pipeline

This directory manages raw and processed crowdfunding datasets for the CrowdFundAI project.

---

## Directory Architecture

```text
data/
├── raw/
│   ├── .gitkeep
│   └── ks-projects-201801.csv       # Raw public Kickstarter 2018 dataset (378,661 records)
├── processed/
│   ├── .gitkeep
│   └── kickstarter_cleaned.csv     # Cleaned, leakage-free dataset (331,675 records)
└── README.md                        # Dataset documentation & reproducibility guide
```

---

## Dataset Provenance

- **Source**: Public Kickstarter Dataset ([Kaggle `kemical/kickstarter-projects`](https://www.kaggle.com/datasets/kemical/kickstarter-projects))
- **Records**: 378,661 historical crowdfunding projects
- **License**: Open Public Domain / CC0

---

## Data Preprocessing Pipeline Steps

The reproducible data preparation script ([ml/prepare_dataset.py](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/ml/prepare_dataset.py)) performs the following transformations:

1. **Existence & Integrity Check**: Automatically verifies or downloads `ks-projects-201801.csv` into `data/raw/`.
2. **Duplicate Removal**: Removes duplicate records based on unique project ID.
3. **Target Variable Identification**:
   - Isolates non-ambiguous outcome states: `'successful'` (mapped to `1`) and `'failed'` (mapped to `0`).
   - Filters out non-final/incomplete states (`'canceled'`, `'live'`, `'suspended'`, `'undefined'`).
4. **Target Leakage Prevention**:
   - **Crucial ML Step**: Drops features known only *after* campaign launch to ensure realistic prediction capabilities prior to launch:
     - `pledged` (amount raised)
     - `backers` (number of backers)
     - `usd pledged` (converted pledged amount)
     - `usd_pledged_real` (converted pledged amount)
     - `state` (replaced by binary target `is_successful`)
5. **Irrelevant Column Removal**:
   - `ID` (arbitrary identifier)
   - `goal` (replaced by standardized `usd_goal_real`)
   - `name` (replaced by engineered text metadata features)
6. **Feature Engineering**:
   - `duration_days`: Calculated from `(deadline - launched)` in days.
   - `name_length`: Character length of the campaign title.
   - `name_word_count`: Number of words in campaign title.
   - `launched_year`, `launched_month`, `launched_day_of_week`, `launched_hour`: Extracted time features.
   - `log_usd_goal`: Log-transformed USD goal (`log1p`) to handle skewness.
7. **Clean Dataset Export**: Saves the resulting 331,675 rows and 14 clean features to `data/processed/kickstarter_cleaned.csv`.

---

## Cleaned Feature Schema (`kickstarter_cleaned.csv`)

| Column Name | Type | Description |
| :--- | :--- | :--- |
| `category` | String | Sub-category of campaign (e.g. Narrative Film, Apps) |
| `main_category` | String | Top-level category (e.g. Technology, Film & Video, Music) |
| `currency` | String | Campaign funding currency (USD, GBP, EUR, CAD, etc.) |
| `country` | String | Country of origin |
| `usd_goal_real` | Float | Target funding goal in USD |
| `log_usd_goal` | Float | Log-transformed USD goal (`log1p(usd_goal_real)`) |
| `name_length` | Integer | Character count of campaign title |
| `name_word_count` | Integer | Word count of campaign title |
| `duration_days` | Float | Campaign duration in days |
| `launched_year` | Integer | Year campaign was launched |
| `launched_month` | Integer | Month campaign was launched (1-12) |
| `launched_day_of_week` | Integer | Day of week campaign was launched (0=Monday, 6=Sunday) |
| `launched_hour` | Integer | Hour of day campaign was launched (0-23) |
| **`is_successful`** | **Integer** | **Target Variable**: `1` = Successful, `0` = Failed |

---

## How to Run / Reproduce Data Preparation

From the root project directory, execute:

```bash
python -m ml.prepare_dataset
```
