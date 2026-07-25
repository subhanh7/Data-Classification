"""Tests for evaluation.metrics and evaluation.confusion."""

from pathlib import Path

import numpy as np

from evaluation.confusion import generate_confusion_matrix, save_confusion_matrix_plot
from evaluation.metrics import compute_metrics, generate_classification_report


def test_compute_metrics_perfect_predictions() -> None:
    y_true = np.array(["a", "b", "a", "b"])
    y_pred = np.array(["a", "b", "a", "b"])

    metrics = compute_metrics(y_true, y_pred)

    assert metrics["accuracy"] == 1.0
    assert metrics["f1_macro"] == 1.0


def test_generate_classification_report_contains_labels() -> None:
    y_true = np.array(["a", "b", "a", "b"])
    y_pred = np.array(["a", "b", "b", "b"])

    report = generate_classification_report(y_true, y_pred)

    assert "a" in report
    assert "b" in report


def test_generate_confusion_matrix_shape() -> None:
    y_true = np.array(["a", "b", "a", "b"])
    y_pred = np.array(["a", "b", "b", "b"])

    matrix = generate_confusion_matrix(y_true, y_pred, labels=["a", "b"])

    assert matrix.shape == (2, 2)


def test_save_confusion_matrix_plot_creates_file(tmp_path: Path) -> None:
    matrix = np.array([[2, 0], [1, 3]])
    output_path = tmp_path / "confusion_matrix.png"

    save_confusion_matrix_plot(matrix, labels=["a", "b"], output_path=output_path)

    assert output_path.exists()
