# CrowdFundAI: Model Comparison & Selection Report

## 1. Executive Summary

Four Machine Learning classification models were trained and evaluated on **66,335 test campaigns** (20% holdout test set from 331,675 total clean Kickstarter records).

The winning model selected for deployment is **Gradient Boosting** with an **ROC-AUC of 0.7609** and an **F1-Score of 0.5961**.

---

## 2. Automatic Model Comparison Table

| Model Name | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Fit Time (s) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Logistic Regression | 0.6749 | 0.6193 | 0.5063 | 0.5571 | **0.7279** | 14.2s |
| Decision Tree | 0.6722 | 0.6098 | 0.5233 | 0.5633 | **0.7207** | 12.2s |
| Random Forest | 0.6802 | 0.6469 | 0.4583 | 0.5365 | **0.7380** | 14.22s |
| **Gradient Boosting** | 0.6969 | 0.6453 | 0.5538 | 0.5961 | **0.7609** | 13.9s |

---

## 3. Confusion Matrix Breakdown

### Logistic Regression
- **True Negatives (Correct Failed)**: 31,208
- **False Positives (Incorrectly Predicted Success)**: 8,336
- **False Negatives (Incorrectly Predicted Failure)**: 13,228
- **True Positives (Correct Success)**: 13,563

### Decision Tree
- **True Negatives (Correct Failed)**: 30,573
- **False Positives (Incorrectly Predicted Success)**: 8,971
- **False Negatives (Incorrectly Predicted Failure)**: 12,771
- **True Positives (Correct Success)**: 14,020

### Random Forest
- **True Negatives (Correct Failed)**: 32,842
- **False Positives (Incorrectly Predicted Success)**: 6,702
- **False Negatives (Incorrectly Predicted Failure)**: 14,512
- **True Positives (Correct Success)**: 12,279

### Gradient Boosting
- **True Negatives (Correct Failed)**: 31,388
- **False Positives (Incorrectly Predicted Success)**: 8,156
- **False Negatives (Incorrectly Predicted Failure)**: 11,953
- **True Positives (Correct Success)**: 14,838

## 4. Model Selection Rationale

Model selection was based on **ROC-AUC** and **F1-Score** rather than simple accuracy alone:
1. **Accuracy Limitations**: Since the dataset has a ~60:40 class distribution (59.6% Failed vs 40.4% Successful), a dummy classifier predicting 'Failed' for every campaign would achieve ~59.6% accuracy while being completely useless.
2. **ROC-AUC Objective**: ROC-AUC measures the model's ability to discriminate between successful and failed campaigns across all classification thresholds.
3. **Winning Model Details**: **Gradient Boosting** achieved the highest discrimination power (ROC-AUC 0.7609) and the highest F1-Score (0.5961), effectively balancing Precision and Recall.

Artifact Saved: `models/best_model.joblib`
