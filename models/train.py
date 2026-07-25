"""
Model training and persistence.

Responsibility: instantiate and train the classifier, then persist it
to disk. No prediction or evaluation logic belongs here.
"""

from pathlib import Path

import joblib
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

from utils.exceptions import ModelPersistenceError
from utils.logger import get_logger

logger = get_logger(__name__)


def train_model(
    x_train: np.ndarray,
    y_train: np.ndarray,
    n_neighbors: int,
) -> KNeighborsClassifier:
    """
    Train a K-Nearest Neighbors classifier.

    Parameters
    ----------
    x_train : numpy.ndarray
        Scaled training feature matrix.
    y_train : numpy.ndarray
        Training labels aligned with ``x_train``.
    n_neighbors : int
        Number of neighbors to use for classification.

    Returns
    -------
    KNeighborsClassifier
        The trained classifier instance.

    Raises
    ------
    RuntimeError
        If the model fails to fit on the provided data.
    """
    logger.info(
        "Training started using KNeighborsClassifier (n_neighbors=%d).", n_neighbors
    )

    model = KNeighborsClassifier(n_neighbors=n_neighbors)
    try:
        model.fit(x_train, y_train)
    except ValueError as exc:
        raise RuntimeError(f"Model training failed: {exc}") from exc

    logger.info("Training completed successfully.")
    return model


def save_model(model: KNeighborsClassifier, model_path: Path) -> None:
    """
    Persist a trained model to disk using Joblib.

    Parameters
    ----------
    model : KNeighborsClassifier
        The trained model to persist.
    model_path : Path
        Destination file path for the serialized model.

    Raises
    ------
    ModelPersistenceError
        If the model cannot be written to disk.
    """
    try:
        model_path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(model, model_path)
    except OSError as exc:
        raise ModelPersistenceError(
            f"Failed to save model to {model_path}: {exc}"
        ) from exc

    logger.info("Model saved to %s", model_path)
