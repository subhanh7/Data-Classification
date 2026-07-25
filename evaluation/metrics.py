"""
Performance metrics computation.

Responsibility: compute accuracy, precision, recall, F1 score and a
classification report. No visualization or file writing belongs here.
"""

from typing import Any

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)

from utils.logger import get_logger

logger = get_logger(__name__)


def compute_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, Any]:
    """
    Compute standard classification performance metrics.

    Parameters
    ----------
    y_true : numpy.ndarray
        Ground-truth labels.
    y_pred : numpy.ndarray
        Predicted labels aligned with ``y_true``.

    Returns
    -------
    dict[str, Any]
        Dictionary containing accuracy, macro-averaged precision,
        recall, F1 score, and the full textual classification report.
    """
    metrics = {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision_macro": precision_score(
            y_true, y_pred, average="macro", zero_division=0
        ),
        "recall_macro": recall_score(y_true, y_pred, average="macro", zero_division=0),
        "f1_macro": f1_score(y_true, y_pred, average="macro", zero_division=0),
    }

    logger.info(
        "Evaluation completed. Accuracy=%.4f, F1 (macro)=%.4f",
        metrics["accuracy"],
        metrics["f1_macro"],
    )
    return metrics


def generate_classification_report(y_true: np.ndarray, y_pred: np.ndarray) -> str:
    """
    Generate a full textual classification report.

    Parameters
    ----------
    y_true : numpy.ndarray
        Ground-truth labels.
    y_pred : numpy.ndarray
        Predicted labels aligned with ``y_true``.

    Returns
    -------
    str
        A per-class precision/recall/F1 breakdown as formatted text.
    """
    return classification_report(y_true, y_pred, zero_division=0)
