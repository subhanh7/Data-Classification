"""Tests for models.train and models.predict."""

from pathlib import Path

import numpy as np
import pytest

from models.predict import load_model, predict
from models.train import save_model, train_model
from utils.exceptions import ModelPersistenceError, PredictionError


@pytest.fixture
def trained_model():
    rng = np.random.default_rng(42)
    x_train = rng.normal(size=(40, 2))
    y_train = np.array([0, 1] * 20)
    return train_model(x_train, y_train, n_neighbors=3)


def test_train_model_returns_fitted_classifier(trained_model) -> None:
    assert hasattr(trained_model, "classes_")


def test_save_and_load_model_round_trip(tmp_path: Path, trained_model) -> None:
    model_path = tmp_path / "classifier.pkl"
    save_model(trained_model, model_path)

    loaded_model = load_model(model_path)

    assert list(loaded_model.classes_) == list(trained_model.classes_)


def test_load_model_raises_when_file_missing(tmp_path: Path) -> None:
    missing_path = tmp_path / "missing.pkl"

    with pytest.raises(ModelPersistenceError):
        load_model(missing_path)


def test_predict_raises_on_dimension_mismatch(trained_model) -> None:
    bad_features = np.array([[1.0, 2.0, 3.0]])

    with pytest.raises(PredictionError):
        predict(trained_model, bad_features)


def test_predict_returns_labels_and_probabilities(trained_model) -> None:
    features = np.array([[0.1, -0.2]])

    predictions, probabilities = predict(trained_model, features)

    assert predictions.shape == (1,)
    assert probabilities.shape[0] == 1
