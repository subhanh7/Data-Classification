"""
Confusion matrix generation and visualization.

Responsibility: compute the confusion matrix and render it as a saved
image. No metric computation belongs here.
"""

from collections.abc import Sequence
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import confusion_matrix

from utils.logger import get_logger

logger = get_logger(__name__)


def generate_confusion_matrix(
    y_true: np.ndarray, y_pred: np.ndarray, labels: Sequence[str]
) -> np.ndarray:
    """
    Compute a confusion matrix.

    Parameters
    ----------
    y_true : numpy.ndarray
        Ground-truth labels.
    y_pred : numpy.ndarray
        Predicted labels aligned with ``y_true``.
    labels : Sequence[str]
        Ordered list of class labels defining matrix row/column order.

    Returns
    -------
    numpy.ndarray
        The computed confusion matrix.
    """
    return confusion_matrix(y_true, y_pred, labels=labels)


def save_confusion_matrix_plot(
    matrix: np.ndarray, labels: Sequence[str], output_path: Path
) -> None:
    """
    Render and save a confusion matrix as a heatmap image.

    Parameters
    ----------
    matrix : numpy.ndarray
        Confusion matrix values, ordered to match ``labels``.
    labels : Sequence[str]
        Class labels used to annotate the plot axes.
    output_path : Path
        Destination file path for the saved image.

    Raises
    ------
    OSError
        If the image cannot be written to disk.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    figure, axes = plt.subplots(figsize=(6, 5))
    sns.heatmap(
        matrix,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=labels,
        yticklabels=labels,
        ax=axes,
    )
    axes.set_xlabel("Predicted Label")
    axes.set_ylabel("True Label")
    axes.set_title("Confusion Matrix")
    figure.tight_layout()

    figure.savefig(output_path)
    plt.close(figure)

    logger.info("Confusion matrix saved to %s", output_path)
