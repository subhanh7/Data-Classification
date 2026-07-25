"""
Model loading and prediction.

Responsibility: load a persisted model and serve predictions against
new feature data. Training never happens here.
"""

from pathlib import Path

import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

from utils.exceptions import ModelPersistenceError, PredictionError
from utils.logger import get_logger

logger = get_logger(__name__)


def load_model(model_path: Path) -> KNeighborsClassifier:
    """
    Load a trained model from disk.

    Parameters
    ----------
    model_path : Path
        Path to the serialized model file.

    Returns
    -------
    KNeighborsClassifier
        The deserialized, trained model.

    Raises
    ------
    ModelPersistenceError
        If the file does not exist or cannot be deserialized.
    """
    if not model_path.exists():
        raise ModelPersistenceError(f"Model file not found at {model_path}")

    try:
        model = joblib.load(model_path)
    except (OSError, EOFError, ValueError) as exc:
        raise ModelPersistenceError(
            f"Failed to load model from {model_path}: {exc}"
        ) from exc

    logger.info("Model loaded from %s", model_path)
    return model


def predict(
    model: KNeighborsClassifier, features: np.ndarray
) -> tuple[np.ndarray, np.ndarray]:
    """
    Generate predictions and class probabilities for input features.

    Parameters
    ----------
    model : KNeighborsClassifier
        A trained classifier.
    features : numpy.ndarray
        Scaled feature matrix to predict on.

    Returns
    -------
    tuple[numpy.ndarray, numpy.ndarray]
        Predicted labels and their associated class probabilities.

    Raises
    ------
    PredictionError
        If the feature dimensions do not match what the model expects.
    """
    expected_features = model.n_features_in_
    if features.ndim != 2 or features.shape[1] != expected_features:
        raise PredictionError(
            f"Expected input with {expected_features} features, got shape {features.shape}."
        )

    logger.info("Prediction started on %d samples.", features.shape[0])
    predictions = model.predict(features)
    probabilities = model.predict_proba(features)
    logger.info("Prediction completed.")

    return predictions, probabilities
