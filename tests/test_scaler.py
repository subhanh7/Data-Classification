"""Tests for preprocessing.scaler."""

import numpy as np
import pandas as pd

from preprocessing.scaler import scale_features


def test_scale_features_zero_centers_training_data() -> None:
    x_train = pd.DataFrame({"a": [1.0, 2.0, 3.0, 4.0], "b": [10.0, 20.0, 30.0, 40.0]})
    x_test = pd.DataFrame({"a": [2.5], "b": [25.0]})

    x_train_scaled, x_test_scaled, scaler = scale_features(x_train, x_test)

    assert np.allclose(x_train_scaled.mean(axis=0), 0.0, atol=1e-8)
    assert x_test_scaled.shape == (1, 2)
    assert scaler.mean_ is not None


def test_scale_features_does_not_fit_on_test_data() -> None:
    x_train = pd.DataFrame({"a": [1.0, 1.0, 1.0, 1.0]})
    x_test = pd.DataFrame({"a": [100.0]})

    _, x_test_scaled, scaler = scale_features(x_train, x_test)

    assert scaler.mean_[0] == 1.0
    assert x_test_scaled[0][0] != 0.0
