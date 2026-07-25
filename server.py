"""
FastAPI REST Server for Machine Learning Data Classification Pipeline.
Provides typed REST endpoints connecting the modular ML engine with the web client.
"""

import os
import json
import base64
import time
from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import config
from utils.logger import get_logger
from utils.exceptions import DatasetError, ModelPersistenceError, PredictionError
from preprocessing.loader import load_dataset
from preprocessing.splitter import split_dataset
from preprocessing.scaler import scale_features
from models.train import train_model, save_model
from models.predict import load_model, predict
from evaluation.metrics import compute_metrics, generate_classification_report
from evaluation.confusion import generate_confusion_matrix, save_confusion_matrix_plot
from utils.output_writer import write_metrics_json, write_text_report

logger = get_logger("api_server")

app = FastAPI(
    title="Data Classification API",
    description="REST backend service for Supervised ML Data Classification using KNN",
    version="1.0.0"
)

# Enable CORS for development & local client origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(config.OUTPUTS_DIR, exist_ok=True)
os.makedirs(config.MODELS_DIR, exist_ok=True)
os.makedirs(config.DATA_DIR, exist_ok=True)

# Mount outputs directory for serving generated matrix image
app.mount("/outputs", StaticFiles(directory=config.OUTPUTS_DIR), name="outputs")

HEADER_COLUMNS = ["sepal_length", "sepal_width", "petal_length", "petal_width", "species"]
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB limit


class PipelineConfigParams(BaseModel):
    n_neighbors: Optional[int] = config.N_NEIGHBORS
    test_size: Optional[float] = config.TEST_SIZE
    random_seed: Optional[int] = config.RANDOM_SEED


def process_dataset_bytes(content: bytes, filename: str) -> str:
    """
    Process raw uploaded bytes for .csv and .data formats.
    If headers are missing (like original UCI .data format), automatically add
    ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species'].
    """
    text = content.decode("utf-8", errors="ignore").strip()
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    if not lines:
        raise DatasetError("Uploaded dataset file is empty.")

    first_line_parts = [p.strip() for p in lines[0].split(",")]

    is_numeric_first_col = False
    try:
        float(first_line_parts[0])
        is_numeric_first_col = True
    except ValueError:
        is_numeric_first_col = False

    if is_numeric_first_col or filename.endswith(".data"):
        csv_text = ",".join(HEADER_COLUMNS) + "\n" + "\n".join(lines)
    else:
        csv_text = "\n".join(lines)

    return csv_text


def parse_classification_report_txt(filepath) -> List[Dict[str, Any]]:
    """Parse text classification report into structured JSON rows."""
    if not os.path.exists(filepath):
        return []

    rows = []
    with open(filepath, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    for line in lines:
        parts = line.split()
        if len(parts) >= 5 and parts[0] not in ["precision", "accuracy", "macro", "weighted"]:
            try:
                class_name = parts[0]
                precision = float(parts[1])
                recall = float(parts[2])
                f1 = float(parts[3])
                support = int(parts[4])
                rows.append({
                    "class_name": class_name,
                    "precision": precision,
                    "recall": recall,
                    "f1_score": f1,
                    "support": support
                })
            except ValueError:
                continue
    return rows


def generate_dataset_preview(file_name: str, source_label: str) -> Dict[str, Any]:
    """Generate preview metadata for an uploaded or selected dataset."""
    features_df, labels_series = load_dataset(config.DATASET_PATH, config.TARGET_COLUMN)
    classes = [str(c) for c in sorted(labels_series.unique())]

    return {
        "filename": os.path.basename(file_name),
        "format": os.path.splitext(file_name)[1].lower() or ".csv",
        "rows": len(labels_series),
        "features_count": len(features_df.columns),
        "feature_names": list(features_df.columns),
        "classes_count": len(classes),
        "class_names": classes,
        "target_column": config.TARGET_COLUMN,
        "validation_status": "Valid Schema",
        "source": source_label,
        "upload_time": datetime.now().strftime("%I:%M %p"),
    }


def get_pipeline_results_payload(execution_time_ms: float = 42.5) -> Dict[str, Any]:
    """Gather all output metrics, report data, dataset info, and confusion matrix into unified response."""
    metrics_path = config.METRICS_PATH
    report_path = config.CLASSIFICATION_REPORT_PATH
    matrix_path = config.CONFUSION_MATRIX_PATH

    metrics = {}
    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            metrics = json.load(f)

    report_table = parse_classification_report_txt(report_path)

    matrix_b64 = None
    if os.path.exists(matrix_path):
        with open(matrix_path, "rb") as img_file:
            matrix_b64 = "data:image/png;base64," + base64.b64encode(img_file.read()).decode("utf-8")

    features_df, labels_series = load_dataset(config.DATASET_PATH, config.TARGET_COLUMN)
    classes = [str(c) for c in sorted(labels_series.unique())]

    total_samples = len(labels_series)
    total_test = int(round(total_samples * config.TEST_SIZE))
    accuracy = metrics.get("accuracy", 0.0)
    correct_count = int(round(accuracy * total_test))
    incorrect_count = total_test - correct_count

    return {
        "status": "success",
        "metrics": {
            "accuracy": metrics.get("accuracy", 0.0),
            "precision_macro": metrics.get("precision_macro", 0.0),
            "recall_macro": metrics.get("recall_macro", 0.0),
            "f1_macro": metrics.get("f1_macro", 0.0),
        },
        "model_info": {
            "algorithm": "K-Nearest Neighbors (KNN)",
            "n_neighbors": config.N_NEIGHBORS,
            "training_samples": total_samples - total_test,
            "testing_samples": total_test,
            "scaler": "StandardScaler",
            "model_path": str(config.MODEL_PATH),
            "random_seed": config.RANDOM_SEED,
            "execution_time_ms": round(execution_time_ms, 1),
        },
        "dataset_info": {
            "name": os.path.basename(config.DATASET_PATH) if os.path.exists(config.DATASET_PATH) else "iris.csv",
            "samples": total_samples,
            "features_count": len(features_df.columns),
            "feature_names": list(features_df.columns),
            "classes_count": len(classes),
            "class_names": classes,
            "target_column": config.TARGET_COLUMN,
            "source": "Custom Dataset File" if os.path.exists(config.DATASET_PATH) else "Built-in Iris Dataset",
        },
        "confusion_matrix": {
            "image_url": "/outputs/confusion_matrix.png",
            "image_b64": matrix_b64,
            "correct_predictions": correct_count,
            "incorrect_predictions": incorrect_count,
            "total_test_samples": total_test,
            "accuracy_percent": round(accuracy * 100, 1),
        },
        "classification_report": report_table,
    }


@app.get("/api/status")
def status():
    """Health check endpoint returning system status."""
    return {
        "status": "online",
        "model_trained": os.path.exists(config.MODEL_PATH),
        "metrics_available": os.path.exists(config.METRICS_PATH),
        "dataset_exists": os.path.exists(config.DATASET_PATH)
    }


@app.post("/api/load-builtin")
def load_builtin():
    """Select built-in Iris dataset and return preview without running classification."""
    try:
        if os.path.exists(config.DATASET_PATH):
            os.remove(config.DATASET_PATH)
        preview = generate_dataset_preview("builtin_iris.csv", "scikit-learn built-in Iris dataset")
        return {
            "status": "success",
            "preview": preview
        }
    except Exception as e:
        logger.error(f"Error loading built-in dataset: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load built-in dataset.")


@app.post("/api/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload custom CSV or .data dataset file. Processes file safely and returns preview metadata."""
    raw_filename = os.path.basename(file.filename)
    allowed_exts = [".csv", ".data", ".txt"]
    ext = os.path.splitext(raw_filename)[1].lower()

    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Only .csv and .data files are supported.")

    csv_path = config.DATASET_PATH
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded dataset file is empty.")

        if len(content) > MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=413, detail="File size exceeds maximum limit of 10MB.")

        processed_csv_text = process_dataset_bytes(content, raw_filename)

        with open(csv_path, "w", encoding="utf-8") as f:
            f.write(processed_csv_text)

        preview = generate_dataset_preview(raw_filename, f"Uploaded File ({raw_filename})")

        return {
            "status": "success",
            "message": f"Successfully processed '{raw_filename}'.",
            "preview": preview
        }
    except DatasetError as e:
        if os.path.exists(csv_path):
            os.remove(csv_path)
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Dataset upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Dataset processing failed.")


@app.post("/api/run")
def trigger_run(params: Optional[PipelineConfigParams] = None):
    """Trigger ML pipeline execution and metric recalculation."""
    try:
        start_time = time.time()
        n_k = params.n_neighbors if params and params.n_neighbors else config.N_NEIGHBORS
        t_size = params.test_size if params and params.test_size else config.TEST_SIZE
        seed = params.random_seed if params and params.random_seed else config.RANDOM_SEED

        features_df, labels_series = load_dataset(config.DATASET_PATH, config.TARGET_COLUMN)

        x_train, x_test, y_train, y_test = split_dataset(
            features_df,
            labels_series,
            test_size=t_size,
            random_seed=seed,
        )

        x_train_scaled, x_test_scaled, _scaler = scale_features(x_train, x_test)

        model = train_model(
            x_train_scaled, y_train.to_numpy(), n_neighbors=n_k
        )
        save_model(model, config.MODEL_PATH)

        predictions, _probabilities = predict(model, x_test_scaled)

        metrics = compute_metrics(y_test.to_numpy(), predictions)
        report = generate_classification_report(y_test.to_numpy(), predictions)

        class_labels = sorted(labels_series.unique())
        matrix = generate_confusion_matrix(
            y_test.to_numpy(), predictions, labels=class_labels
        )
        save_confusion_matrix_plot(
            matrix, labels=class_labels, output_path=config.CONFUSION_MATRIX_PATH
        )

        write_metrics_json(metrics, config.METRICS_PATH)
        write_text_report(report, config.CLASSIFICATION_REPORT_PATH)

        exec_time = (time.time() - start_time) * 1000
        logger.info(f"Pipeline execution completed in {exec_time:.1f}ms")

        return get_pipeline_results_payload(execution_time_ms=exec_time)
    except DatasetError as e:
        raise HTTPException(status_code=400, detail=f"Dataset error: {str(e)}")
    except Exception as e:
        logger.error(f"Failed to execute pipeline: {str(e)}")
        raise HTTPException(status_code=500, detail="Pipeline execution failed.")


@app.post("/api/reset")
def reset_dataset():
    """Reset dataset state."""
    try:
        if os.path.exists(config.DATASET_PATH):
            os.remove(config.DATASET_PATH)
        return {"status": "success", "message": "Pipeline state reset."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to reset pipeline state.")


@app.get("/api/export/{file_type}")
def export_file(file_type: str):
    """Download export files (metrics, report, matrix)."""
    if file_type == "json":
        if os.path.exists(config.METRICS_PATH):
            return FileResponse(config.METRICS_PATH, filename="metrics.json", media_type="application/json")
    elif file_type == "report":
        if os.path.exists(config.CLASSIFICATION_REPORT_PATH):
            return FileResponse(config.CLASSIFICATION_REPORT_PATH, filename="classification_report.txt", media_type="text/plain")
    elif file_type == "matrix":
        if os.path.exists(config.CONFUSION_MATRIX_PATH):
            return FileResponse(config.CONFUSION_MATRIX_PATH, filename="confusion_matrix.png", media_type="image/png")

    raise HTTPException(status_code=404, detail=f"Export file '{file_type}' not found.")
