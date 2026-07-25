"""Tests for preprocessing.splitter."""

import pandas as pd

from preprocessing.splitter import split_dataset


def test_split_dataset_produces_expected_sizes() -> None:
    features = pd.DataFrame({"a": range(100), "b": range(100, 200)})
    labels = pd.Series([0, 1] * 50)

    x_train, x_test, y_train, y_test = split_dataset(
        features, labels, test_size=0.2, random_seed=42
    )

    assert len(x_train) == 80
    assert len(x_test) == 20
    assert len(y_train) == 80
    assert len(y_test) == 20


def test_split_dataset_is_reproducible_with_same_seed() -> None:
    features = pd.DataFrame({"a": range(50), "b": range(50, 100)})
    labels = pd.Series([0, 1] * 25)

    x_train_1, _, _, _ = split_dataset(features, labels, test_size=0.2, random_seed=7)
    x_train_2, _, _, _ = split_dataset(features, labels, test_size=0.2, random_seed=7)

    pd.testing.assert_frame_equal(x_train_1, x_train_2)
