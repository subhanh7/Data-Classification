"""Tests for preprocessing.loader."""

from pathlib import Path

import pandas as pd
import pytest

from preprocessing.loader import load_dataset
from utils.exceptions import DatasetError


def test_load_dataset_falls_back_to_builtin_iris(tmp_path: Path) -> None:
    missing_path = tmp_path / "does_not_exist.csv"
    features, labels = load_dataset(missing_path, target_column="species")

    assert not features.empty
    assert len(features) == len(labels)
    assert "species" not in features.columns


def test_load_dataset_reads_valid_csv(tmp_path: Path) -> None:
    csv_path = tmp_path / "sample.csv"
    pd.DataFrame(
        {
            "feature_a": [1.0, 2.0, 3.0, 4.0],
            "feature_b": [4.0, 3.0, 2.0, 1.0],
            "label": ["a", "b", "a", "b"],
        }
    ).to_csv(csv_path, index=False)

    features, labels = load_dataset(csv_path, target_column="label")

    assert list(features.columns) == ["feature_a", "feature_b"]
    assert list(labels) == ["a", "b", "a", "b"]


def test_load_dataset_raises_on_empty_csv(tmp_path: Path) -> None:
    csv_path = tmp_path / "empty.csv"
    csv_path.write_text("", encoding="utf-8")

    with pytest.raises(DatasetError):
        load_dataset(csv_path, target_column="label")


def test_load_dataset_raises_on_missing_target_column(tmp_path: Path) -> None:
    csv_path = tmp_path / "sample.csv"
    pd.DataFrame({"feature_a": [1.0, 2.0], "feature_b": [3.0, 4.0]}).to_csv(
        csv_path, index=False
    )

    with pytest.raises(DatasetError):
        load_dataset(csv_path, target_column="label")
