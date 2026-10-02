# CrowdFundAI: Intelligent Crowdfunding Success Prediction with Explainable AI

---

## 1. Project Title
**CrowdFundAI**: Intelligent FinTech Crowdfunding Success Prediction Using Machine Learning and Explainable AI (SHAP).

---

## 2. Problem Statement
Crowdfunding platforms like Kickstarter witness thousands of campaign launches monthly, but over 59% of campaigns fail to reach their target funding goals. Creators often set unrealistic financial targets, pick suboptimal campaign durations, or launch at unfavorable times without data-driven insights. Existing platforms provide retrospective statistics rather than predictive, pre-launch guidance.

---

## 3. Objective
To build a reproducible, end-to-end Machine Learning web platform that predicts crowdfunding campaign success prior to launch and provides transparent, explainable feature attributions (SHAP) to help creators optimize campaign parameters (funding goal, duration, title metrics, launch timing).

---

## 4. How the System Works

```text
[User Campaign Input] (Title, Category, Goal $, Duration, Country, Launch Time)
        │
        ▼
[FastAPI REST API Gateway] (Port 8000)
        │
        ▼
[Pre-trained Scikit-Learn Pipeline] (ColumnTransformer + HistGradientBoosting)
        │
        ├──> [Probability & Success Prediction] (0/1 Classification)
        │
        └──> [SHAP Explainable AI Explainer] (TreeExplainer)
                │
                ▼
[Structured Response] (Prediction %, Top Positive Factors, Top Negative Factors)
        │
        ▼
[React Frontend Dashboard] (Port 3000: Recharts, Metric Cards, SHAP Visualization)
```

---

## 5. Dataset Source
- **Origin**: Authentic Kickstarter Public Dataset ([Kaggle `kemical/kickstarter-projects`](https://www.kaggle.com/datasets/kemical/kickstarter-projects))
- **Total Initial Records**: 378,661 historical campaigns
- **Cleaned Training Records**: 331,675 campaigns (after filtering out non-final states like `live`, `canceled`, `suspended`)
- **Class Ratio**: 197,719 Failed (59.61%) vs 133,956 Successful (40.39%)

---

## 6. Dataset Features

### Raw Input Features
- `name`: Project title string
- `category` & `main_category`: Sub-category and main category
- `currency` & `country`: Currency code and country of origin
- `goal` & `usd_goal_real`: Target goal in original currency and converted USD
- `launched` & `deadline`: Datetime launch and deadline timestamps

### Purged Target Leakage Features
To ensure true pre-launch prediction capability, all post-launch outcome features were strictly excluded:
- `pledged`, `backers`, `usd pledged`, `usd_pledged_real`, `state`

---

## 7. Data Preprocessing
Executed by [ml/prepare_dataset.py](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/ml/prepare_dataset.py):
1. **Validation & Automated Download**: Checks existence of `data/raw/ks-projects-201801.csv` or downloads directly.
2. **Duplicate Removal**: Removes duplicate records based on project IDs.
3. **Missing Value Imputation**: Imputes missing titles with `'Untitled'`, unknown categories/countries with `'UNKNOWN'`, and numeric NaNs with medians.
4. **Target Encoding**: Filters `state` to `'successful'` (1) and `'failed'` (0).
5. **Leakage Purging**: Drops post-launch fields.

---

## 8. Feature Engineering
Pre-launch features engineered in [ml/preprocessing.py](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/ml/preprocessing.py):
- `log_usd_goal`: Log-transformed USD goal $\ln(1 + \text{usd\_goal\_real})$ to compress extreme funding goals ($10 to $100M+).
- `duration_days`: Campaign duration in days derived from `(deadline - launched)`.
- `goal_per_day` & `log_goal_per_day`: Daily required funding target ($\text{usd\_goal\_real} / (\text{duration\_days} + 1)$).
- `category_success_rate`: Mean historical success rate of the main category.
- `goal_to_cat_median_ratio`: Ratio comparing the campaign's goal to the median goal of its main category.
- `name_length` & `name_word_count`: Character and word count of the title.
- `launched_year`, `launched_month`, `launched_day_of_week`, `launched_hour`, `launched_quarter`: Time and seasonality features.
- `is_usd_currency`, `is_top_country`, `is_weekend_launch`: Binary flags.

---

## 9. ML Models Used
Four classification algorithms were trained on **265,340 training samples** using an 80/20 Stratified Split:
1. **Logistic Regression** (`LogisticRegression(max_iter=1000)`)
2. **Decision Tree** (`DecisionTreeClassifier(max_depth=12)`)
3. **Random Forest** (`RandomForestClassifier(n_estimators=100, max_depth=15)`)
4. **Gradient Boosting** (`HistGradientBoostingClassifier(max_iter=100)`)

---

## 10. Model Evaluation & Benchmark Results
Evaluated on **66,335 holdout test set campaigns**:

| Model Candidate | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Fit Time | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 0.6749 | 0.6193 | 0.5063 | 0.5571 | 0.7279 | 14.20s | Evaluated |
| **Decision Tree** | 0.6722 | 0.6098 | 0.5233 | 0.5633 | 0.7207 | 14.96s | Evaluated |
| **Random Forest** | 0.6802 | 0.6469 | 0.4583 | 0.5365 | 0.7380 | 15.11s | Evaluated |
| **Gradient Boosting** | **0.6969** | **0.6453** | **0.5538** | **0.5961** | **0.7609** | 14.50s | **Selected Best** |

---

## 11. Final Model Selection
- **Selected Model**: **Gradient Boosting** (`HistGradientBoostingClassifier`).
- **Selection Rationale**: Chosen based on highest discrimination capability (**ROC-AUC: 0.7609**) and balanced F1-Score (**0.5961**), avoiding simple accuracy bias.
- **Saved Pipeline Artifact**: [models/best_model.joblib](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/models/best_model.joblib) containing the complete fitted `ColumnTransformer` + `HistGradientBoostingClassifier`.

---

## 12. Explainable AI (XAI)
- **Framework**: SHAP (SHapley Additive exPlanations) using `shap.TreeExplainer` / `shap.Explainer`.
- **Global Importance**: Identifies top overall dataset drivers (`Category Historical Success Rate`, `USD Goal Amount`, `Duration (Days)`, `Title Length`).
- **Local Predictions**: `explain_prediction(campaign)` computes exact SHAP feature attributions for any campaign input, outputting:
  - `top_positive_factors`: Features increasing success probability (e.g. realistic goal amount, optimal launch hour).
  - `top_negative_factors`: Features decreasing success probability (e.g. over-long campaign duration, difficult category).

---

## 13. Backend / API Architecture
- **Framework**: Python FastAPI
- **Model Lifetime**: Model pipeline loaded **ONCE** into memory during startup via lifespan context manager.
- **Endpoints**:
  - `GET /health` & `GET /api/health`: Health status & model loading check.
  - `POST /predict` & `POST /api/predictions`: Validates input, applies pipeline, returns success probability.
  - `POST /explain` & `POST /api/explain`: Returns prediction + top positive & negative SHAP factors.
  - `GET /analytics` & `GET /api/analytics`: Returns dataset size, class distribution, model comparisons, and global SHAP importances.
  - `GET /model-performance`: Returns full benchmark metrics and confusion matrix.

---

## 14. Frontend Architecture
- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Components**:
  - `NewPredictionPage.tsx`: Pre-launch campaign parameter input form with validation.
  - `PredictionResultPage.tsx`: Evaluated status badge, probability percentage card, confidence interval, and SHAP explanation chart.
  - `AnalyticsPage.tsx`: Dataset distribution bar chart, model comparison benchmark table, and SHAP importance chart.
  - `ShapExplanationChart.tsx`: SHAP attribution bar chart and positive/negative factors breakdown.

---

## 15. Installation Steps

### Prerequisites
- Node.js v18+ (tested on Node v24)
- Python 3.10+

### Step 1: Install Python Dependencies
```bash
pip install -r backend/requirements.txt
pip install shap seaborn
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 16. How to Run the Project

### 1. Run Data Preparation & Model Training Pipeline
```bash
python -m ml.prepare_dataset
python -m ml.eda_and_feature_engineering
python -m ml.train
```

### 2. Start Backend API Server
```bash
python -m uvicorn backend.main:app --port 8000 --host 127.0.0.1
```
The API docs will be live at `http://localhost:8000/docs`.

### 3. Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Test Suite
```bash
python -m unittest discover tests
```

---

## 17. Directory & Folder Structure

```text
CrowdFundAI/
├── frontend/                 # React 19 + TypeScript + Vite Web Application
│   ├── src/
│   │   ├── components/       # Reusable UI Components (ShapExplanationChart, MetricCard, etc.)
│   │   ├── pages/            # Application Pages (NewPrediction, PredictionResult, Analytics)
│   │   ├── services/         # API Integration (apiClient.ts, predictionService.ts, analyticsService.ts)
│   │   └── types.ts          # Core TypeScript Interface Definitions
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # FastAPI REST API Gateway & Model Serving
│   ├── main.py               # API Endpoints (/health, /predict, /explain, /analytics)
│   └── requirements.txt
├── ml/                       # Machine Learning & Explainable AI Pipeline Modules
│   ├── download_dataset.py   # Raw Kickstarter Dataset Downloader
│   ├── data_loader.py        # Robust Dataset Loader (UTF-8 / Latin-1)
│   ├── preprocessing.py     # Data Cleaning & Target Leakage Prevention
│   ├── prepare_dataset.py    # Complete Data Pipeline Script
│   ├── eda_and_feature_engineering.py # EDA & Feature Extraction
│   ├── train.py              # Model Benchmark Training & Selection
│   ├── predict.py            # Model Inference Module
│   └── explainability.py     # SHAP Explainable AI Module
├── data/
│   ├── raw/                  # Raw Dataset Storage (ks-projects-201801.csv)
│   ├── processed/            # Processed Dataset Storage (kickstarter_cleaned.csv, model_features.csv)
│   └── README.md             # Dataset Pipeline Documentation
├── models/                   # Model Artifacts (best_model.joblib, model_comparison.json)
├── notebooks/                # Jupyter Notebooks & EDA Visualizations
│   ├── 01_eda_and_feature_engineering.ipynb
│   ├── EDA_SUMMARY.md
│   ├── XAI_SUMMARY.md
│   └── eda_plots/            # Generated Chart PNGs
├── tests/                    # Unit & Integration Test Suite (24 Test Cases)
│   ├── test_backend.py
│   ├── test_dataset.py
│   ├── test_feature_engineering.py
│   ├── test_model_training.py
│   └── test_explainability.py
└── README.md                 # Project Master Documentation
```

---

## 18. Limitations
- Dataset is focused on historical Kickstarter projects; performance may vary for non-reward or equity crowdfunding platforms (e.g. GoFundMe, Seedrs).
- NLP features currently focus on title length and word count rather than full semantic embeddings (e.g. BERT/Transformers).

---

## 19. Future Improvements
- Integrate Deep Learning (TabNet / MLP) for tabular classification benchmarks.
- Incorporate text sentiment analysis on campaign pitch descriptions.
- Add goal optimization recommendations ("What-If" counterfactual analysis: e.g., *“Reducing goal from $10k to $6k increases success probability by +18%”*).
