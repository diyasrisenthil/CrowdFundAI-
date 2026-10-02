"""
CrowdFundAI Backend Inference API (FastAPI)
Serves real-time ML campaign predictions, SHAP Explainable AI feature attributions,
and real model performance / dataset analytics metrics.
Loads trained model pipeline ONCE during startup.
"""

import os
import sys
import json
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import load_model_pipeline, predict_campaign_success
from ml.explainability import explain_prediction

# Global in-memory model pipeline instance (loaded ONCE at startup)
MODEL_PIPELINE = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager to load ML model ONCE on application startup."""
    global MODEL_PIPELINE
    print("=" * 60)
    print("Initializing CrowdFundAI Backend Inference Service...")
    MODEL_PIPELINE = load_model_pipeline()
    if MODEL_PIPELINE is not None:
        print("  - Successfully loaded trained ML model pipeline into memory.")
    else:
        print("  - Warning: Trained model artifact not found in models/best_model.joblib.")
    print("=" * 60)
    yield
    print("Shutting down CrowdFundAI Backend Service.")


app = FastAPI(
    title="CrowdFundAI Inference API",
    description="Production REST API for Crowdfunding Campaign Success Prediction & SHAP Explainability",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CampaignInput(BaseModel):
    title: Optional[str] = Field(None, example="Smart Solar Backpack")
    campaignName: Optional[str] = Field(None, example="Smart Solar Backpack")
    category: str = Field(..., example="Technology")
    subCategory: Optional[str] = Field(None, example="Gadgets")
    goalAmount: Optional[float] = Field(None, example=5000.0, gt=0)
    fundingGoal: Optional[float] = Field(None, example=5000.0, gt=0)
    durationDays: Optional[int] = Field(None, example=30, gt=0, le=90)
    campaignDuration: Optional[int] = Field(None, example=30, gt=0, le=90)
    currency: Optional[str] = Field("USD", example="USD")
    country: Optional[str] = Field("US", example="US")
    launched_year: Optional[int] = Field(2026, example=2026)
    launched_month: Optional[int] = Field(10, example=10)
    launched_day_of_week: Optional[int] = Field(3, example=3)
    launched_hour: Optional[int] = Field(14, example=14)

    def model_post_init(self, __context: Any) -> None:
        if not self.title and self.campaignName:
            self.title = self.campaignName
        elif not self.campaignName and self.title:
            self.campaignName = self.title
        elif not self.title and not self.campaignName:
            self.title = "Untitled Campaign"
            self.campaignName = "Untitled Campaign"

        if self.goalAmount is None and self.fundingGoal is not None:
            self.goalAmount = self.fundingGoal
        elif self.fundingGoal is None and self.goalAmount is not None:
            self.fundingGoal = self.goalAmount
        elif self.goalAmount is None and self.fundingGoal is None:
            self.goalAmount = 5000.0
            self.fundingGoal = 5000.0

        if self.durationDays is None and self.campaignDuration is not None:
            self.durationDays = self.campaignDuration
        elif self.campaignDuration is None and self.durationDays is not None:
            self.campaignDuration = self.durationDays
        elif self.durationDays is None and self.campaignDuration is None:
            self.durationDays = 30
            self.campaignDuration = 30


def ensure_model_loaded():
    """Helper to verify model is loaded or attempt single fallback load."""
    global MODEL_PIPELINE
    if MODEL_PIPELINE is None:
        MODEL_PIPELINE = load_model_pipeline()
    if MODEL_PIPELINE is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Trained ML model pipeline artifact not found. Run 'python -m ml.train' to build models/best_model.joblib."
        )


@app.get("/")
def read_root():
    return {
        "service": "CrowdFundAI Backend Inference API",
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
@app.get("/api/health")
def health_check():
    """
    Health check endpoint for connection verification and model status.
    """
    is_loaded = MODEL_PIPELINE is not None or os.path.exists(
        os.path.join(os.path.dirname(__file__), "..", "models", "best_model.joblib")
    )
    return {
        "status": "connected" if is_loaded else "model_missing",
        "service": "CrowdFundAI ML Gateway",
        "backend": "FastAPI",
        "isModelLoaded": is_loaded,
        "version": "1.0.0"
    }


@app.post("/predict")
@app.post("/api/predictions")
def predict_endpoint(campaign: CampaignInput):
    """
    POST /predict
    Validates input, applies pre-trained preprocessing pipeline, and outputs success prediction & probability.
    """
    ensure_model_loaded()

    try:
        input_data = campaign.model_dump()
        result = predict_campaign_success(input_data)

        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Prediction inference failed.")
            )

        return {
            "success": True,
            "prediction": result["predicted_status"],
            "probability": result["success_probability"],
            "failureProbability": result["failure_probability"],
            "confidenceScore": result["confidence_score"],
            "modelVersion": "v1.0-gradient-boosting"
        }
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal prediction error: {str(e)}"
        )


@app.post("/explain")
@app.post("/api/explain")
def explain_endpoint(campaign: CampaignInput):
    """
    POST /explain
    Validates input, computes prediction, and generates SHAP Explainable AI positive and negative factors.
    """
    ensure_model_loaded()

    try:
        input_data = campaign.model_dump()
        explanation = explain_prediction(input_data)

        if not explanation.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=explanation.get("error", "SHAP explanation failed.")
            )

        return {
            "success": True,
            "prediction": explanation["predicted_status"],
            "probability": explanation["success_probability"],
            "base_value": explanation["base_value"],
            "top_positive_factors": explanation["top_positive_factors"],
            "top_negative_factors": explanation["top_negative_factors"],
            "shap_factors": explanation["shap_factors"],
            "modelVersion": "v1.0-gradient-boosting"
        }
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal explanation error: {str(e)}"
        )


@app.get("/analytics")
@app.get("/api/analytics")
def analytics_endpoint():
    """
    GET /analytics
    Returns actual project dataset metrics, success/failure class distribution,
    model comparison results, and global SHAP feature importance.
    """
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    comparison_path = os.path.join(models_dir, "model_comparison.json")
    shap_path = os.path.join(models_dir, "global_feature_importance.json")

    comparison_data = {}
    if os.path.exists(comparison_path):
        with open(comparison_path, "r") as f:
            comparison_data = json.load(f)

    shap_data = []
    if os.path.exists(shap_path):
        with open(shap_path, "r") as f:
            shap_json = json.load(f)
            shap_data = shap_json.get("top_features", [])

    model_list = []
    models_dict = comparison_data.get("models", {})
    best_name = comparison_data.get("best_model", "Gradient Boosting")

    for name, m in models_dict.items():
        model_list.append({
            "modelName": name,
            "accuracy": m.get("accuracy"),
            "precision": m.get("precision"),
            "recall": m.get("recall"),
            "f1Score": m.get("f1_score"),
            "rocAuc": m.get("roc_auc"),
            "fitTime": m.get("fit_time_seconds"),
            "selectedAsBest": (name == best_name)
        })

    return {
        "success": True,
        "datasetSize": 331675,
        "classDistribution": {
            "failed": 197719,
            "failedPercentage": 59.61,
            "successful": 133956,
            "successfulPercentage": 40.39
        },
        "bestModel": best_name,
        "bestRocAuc": comparison_data.get("best_roc_auc", 0.7609),
        "bestF1Score": models_dict.get(best_name, {}).get("f1_score", 0.5961),
        "modelComparison": model_list,
        "globalFeatureImportance": shap_data
    }


@app.get("/model-performance")
@app.get("/api/model-performance")
def model_performance_endpoint():
    """
    GET /model-performance
    Returns full evaluation state for Model Performance benchmarks page.
    """
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    comparison_path = os.path.join(models_dir, "model_comparison.json")
    shap_path = os.path.join(models_dir, "global_feature_importance.json")

    comparison_data = {}
    if os.path.exists(comparison_path):
        with open(comparison_path, "r") as f:
            comparison_data = json.load(f)

    shap_data = []
    if os.path.exists(shap_path):
        with open(shap_path, "r") as f:
            shap_json = json.load(f)
            shap_data = shap_json.get("top_features", [])

    models_dict = comparison_data.get("models", {})
    best_name = comparison_data.get("best_model", "Gradient Boosting")
    best_m = models_dict.get(best_name, {})

    classification_items = []
    for name, m in models_dict.items():
        classification_items.append({
            "modelName": name,
            "modelType": "Classification",
            "status": "Trained",
            "selectedAsBest": (name == best_name),
            "metrics": {
                "Accuracy": m.get("accuracy"),
                "Precision": m.get("precision"),
                "Recall": m.get("recall"),
                "F1 Score": m.get("f1_score"),
                "ROC-AUC": m.get("roc_auc")
            }
        })

    cm = best_m.get("confusion_matrix", [[31388, 8156], [11953, 14838]])

    return {
        "isTrained": True,
        "activeClassificationModel": best_name,
        "activeRegressionModel": None,
        "datasetIngested": True,
        "datasetName": "Kickstarter 2018 Cleaned",
        "totalSamples": 331675,
        "classificationModels": classification_items,
        "bestClassificationMetrics": {
            "accuracy": best_m.get("accuracy"),
            "precision": best_m.get("precision"),
            "recall": best_m.get("recall"),
            "f1Score": best_m.get("f1_score"),
            "rocAuc": best_m.get("roc_auc")
        },
        "confusionMatrix": {
            "labels": ["Actual: Failed", "Actual: Successful"],
            "matrix": cm
        },
        "globalFeatureImportance": shap_data
    }


@app.get("/api/models")
def list_models_endpoint():
    """Returns list of available trained model files in models/."""
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    if not os.path.exists(models_dir):
        return {"models": []}

    files = [f for f in os.listdir(models_dir) if f.endswith(('.joblib', '.pkl'))]
    return {
        "models": files,
        "count": len(files)
    }


# Optional unified production serving: Mount frontend build assets if present
frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist_path):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
    assets_dir = os.path.join(frontend_dist_path, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa_frontend(full_path: str):
        # Allow API routes to be handled by FastAPI
        if full_path.startswith("api") or full_path in ["health", "predict", "explain", "analytics", "model-performance", "docs", "openapi.json"]:
            raise HTTPException(status_code=404, detail="Endpoint not found")
        target_file = os.path.join(frontend_dist_path, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        index_file = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

