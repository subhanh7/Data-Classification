"""
Centralized configuration for the Data Classification project.

This module holds every tunable value used across the pipeline
(dataset paths, split ratios, model hyperparameters, output locations).
No business logic belongs here — configuration only.
"""

from pathlib import Path

# ---------------------------------------------------------------------------
# Filesystem paths
# ---------------------------------------------------------------------------
BASE_DIR: Path = Path(__file__).resolve().parent

DATA_DIR: Path = BASE_DIR / "data"
MODELS_DIR: Path = BASE_DIR / "models"
OUTPUTS_DIR: Path = BASE_DIR / "outputs"

# Optional external CSV dataset. If this file does not exist, the loader
# falls back to the built-in scikit-learn Iris dataset.
DATASET_PATH: Path = DATA_DIR / "iris.csv"
TARGET_COLUMN: str = "species"

# ---------------------------------------------------------------------------
# Model persistence
# ---------------------------------------------------------------------------
MODEL_FILENAME: str = "classifier.pkl"
MODEL_PATH: Path = MODELS_DIR / MODEL_FILENAME

# ---------------------------------------------------------------------------
# Output artifacts
# ---------------------------------------------------------------------------
METRICS_FILENAME: str = "metrics.json"
CLASSIFICATION_REPORT_FILENAME: str = "classification_report.txt"
CONFUSION_MATRIX_FILENAME: str = "confusion_matrix.png"

METRICS_PATH: Path = OUTPUTS_DIR / METRICS_FILENAME
CLASSIFICATION_REPORT_PATH: Path = OUTPUTS_DIR / CLASSIFICATION_REPORT_FILENAME
CONFUSION_MATRIX_PATH: Path = OUTPUTS_DIR / CONFUSION_MATRIX_FILENAME

# ---------------------------------------------------------------------------
# Reproducibility
# ---------------------------------------------------------------------------
RANDOM_SEED: int = 42

# ---------------------------------------------------------------------------
# Train / test split
# ---------------------------------------------------------------------------
TEST_SIZE: float = 0.2

# ---------------------------------------------------------------------------
# Model hyperparameters (K-Nearest Neighbors)
# ---------------------------------------------------------------------------
N_NEIGHBORS: int = 5

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOG_LEVEL: str = "INFO"
LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
