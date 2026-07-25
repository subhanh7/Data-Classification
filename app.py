"""
Application entry point.

Responsibility: orchestrate the end-to-end supervised learning
pipeline. No business logic lives here — every step delegates to a
dedicated module.

Pipeline
--------
Load configuration -> Load dataset -> Validate -> Split -> Scale ->
Train -> Save model -> Predict on test data -> Evaluate -> Generate
outputs -> Finish
"""

import sys

import config
from evaluation.confusion import generate_confusion_matrix, save_confusion_matrix_plot
from evaluation.metrics import compute_metrics, generate_classification_report
from models.predict import predict
from models.train import save_model, train_model
from preprocessing.loader import load_dataset
from preprocessing.scaler import scale_features
from preprocessing.splitter import split_dataset
from utils.exceptions import DataClassificationError
from utils.logger import get_logger
from utils.output_writer import write_metrics_json, write_text_report

logger = get_logger(__name__)


def run() -> None:
    """
    Execute the full supervised learning pipeline end to end.

    Raises
    ------
    DataClassificationError
        If any stage of the pipeline fails due to a project-specific
        error (dataset, persistence, or prediction issues).
    """
    logger.info("Application started.")

    features, labels = load_dataset(config.DATASET_PATH, config.TARGET_COLUMN)

    x_train, x_test, y_train, y_test = split_dataset(
        features,
        labels,
        test_size=config.TEST_SIZE,
        random_seed=config.RANDOM_SEED,
    )

    x_train_scaled, x_test_scaled, _scaler = scale_features(x_train, x_test)

    model = train_model(
        x_train_scaled, y_train.to_numpy(), n_neighbors=config.N_NEIGHBORS
    )
    save_model(model, config.MODEL_PATH)

    predictions, _probabilities = predict(model, x_test_scaled)

    metrics = compute_metrics(y_test.to_numpy(), predictions)
    report = generate_classification_report(y_test.to_numpy(), predictions)

    class_labels = sorted(labels.unique())
    matrix = generate_confusion_matrix(
        y_test.to_numpy(), predictions, labels=class_labels
    )
    save_confusion_matrix_plot(
        matrix, labels=class_labels, output_path=config.CONFUSION_MATRIX_PATH
    )

    write_metrics_json(metrics, config.METRICS_PATH)
    write_text_report(report, config.CLASSIFICATION_REPORT_PATH)

    logger.info("Application finished successfully.")


def main() -> None:
    """Run the pipeline and translate failures into a clean process exit."""
    try:
        run()
    except DataClassificationError as exc:
        logger.error("Pipeline failed: %s", exc)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001 - top-level safety net
        logger.error("Unexpected failure: %s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
