# CrowdFundAI: Explainable AI (XAI) Documentation & Viva Guide

## 1. Executive Summary

This module implements **Explainable AI (XAI)** for CrowdFundAI using **SHAP (SHapley Additive exPlanations)** on the trained Gradient Boosting model pipeline ([models/best_model.joblib](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/models/best_model.joblib)).

Every prediction returned by CrowdFundAI can now be explained at both the **Global Level** (overall dataset drivers) and **Local Level** (specific campaign factors), providing transparent positive and negative contributions without any fabricated or static rules.

---

## 2. Core Concepts (Student Viva Explanation Guide)

### What is SHAP?
- **SHAP** stands for **SHapley Additive exPlanations**.
- Based on **Game Theory** (developed by Nobel Laureate Lloyd Shapley), SHAP calculates the marginal contribution of each feature to the model's final prediction relative to the average baseline prediction.

### Mathematical Intuition
For any campaign prediction $\hat{y}$:
$$\hat{y} = \text{Base Value} + \sum_{i=1}^{M} \phi_i$$

Where:
- $\text{Base Value}$ is the average model output across all training campaigns.
- $\phi_i$ is the **SHAP value** for feature $i$.
- If $\phi_i > 0$, feature $i$ increases the campaign's success probability (**Positive Factor**).
- If $\phi_i < 0$, feature $i$ decreases the campaign's success probability (**Negative Factor**).

---

## 3. Implemented XAI Features

### A. Global Feature Importance
- **Artifact**: `models/global_feature_importance.json` & `notebooks/eda_plots/shap_feature_importance.png`
- **Methodology**: Computes the mean absolute SHAP value ($\text{Mean } |\phi_i|$) across a representative dataset sample.
- **Top 5 Global Drivers**:
  1. `Category Historical Success Rate`
  2. `Funding Goal (USD)`
  3. `Campaign Duration (Days)`
  4. `Title Word Count & Length`
  5. `Main Category (e.g. Technology vs Dance)`

### B. Local Prediction Explanation (`explain_prediction`)
- **Python Module**: [ml/explainability.py](file:///c:/Users/diyas/OneDrive/Desktop/CrowdFundAI-/ml/explainability.py)
- **Function**: `explain_prediction(campaign_dict)`
- **Output Structure**:
  - `success_probability`: Model confidence percentage.
  - `base_value`: Expected baseline output.
  - `top_positive_factors`: Features pushing the campaign towards success.
  - `top_negative_factors`: Features pushing the campaign towards failure.
  - `shap_factors`: Full dictionary of feature impacts.

---

## 4. Sample Real Prediction Explanation Output

```json
{
  "success": true,
  "predicted_status": "Failed",
  "success_probability": 0.2530,
  "base_value": -0.5131,
  "top_positive_factors": [
    {
      "feature": "Launch Hour of Day",
      "impact": 0.3123,
      "description": "Increases success chance by +0.31 (SHAP impact)"
    },
    {
      "feature": "Campaign Duration (Days)",
      "impact": 0.1958,
      "description": "Increases success chance by +0.20 (SHAP impact)"
    }
  ],
  "top_negative_factors": [
    {
      "feature": "Category Historical Success Rate",
      "impact": -0.4730,
      "description": "Reduces success chance by -0.47 (SHAP impact)"
    },
    {
      "feature": "Category: Technology",
      "impact": -0.1943,
      "description": "Reduces success chance by -0.19 (SHAP impact)"
    }
  ]
}
```

---

## 5. Typical Student Viva Questions & Answers

**Q1: Why did you use SHAP instead of default feature importances?**
*Answer*: Default feature importances (e.g., Gini importance in tree models) only provide global rankings, are biased towards high-cardinality features, and cannot explain individual predictions. SHAP provides local explanations for specific campaigns and guarantees consistency and local accuracy based on Shapley values.

**Q2: How do you prevent target leakage in explanations?**
*Answer*: All inputs passed to SHAP are strictly pre-launch features (goal, category, duration, launch timing, title metrics). Post-launch features like backer count or money raised were excluded during feature engineering.

**Q3: Is SHAP model-agnostic?**
*Answer*: SHAP provides TreeExplainer for tree ensembles (Fast, $O(TLD^2)$ complexity) and KernelExplainer for any black-box model. We utilized TreeExplainer/Explainer with our Gradient Boosting pipeline.
