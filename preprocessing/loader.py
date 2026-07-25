"""
Dataset loading and structural validation.

Responsibility: load the raw dataset and guarantee it is structurally
sound before it is handed off to the rest of the pipeline. No scaling,
splitting, or training happens here.
"""

from pathlib import Path

import pandas as pd
from sklearn.datasets import load_iris

from utils.exceptions import DatasetError
from utils.logger import get_logger

logger = get_logger(__name__)


def load_dataset(
    dataset_path: Path, target_column: str
) -> tuple[pd.DataFrame, pd.Series]:
    """
    Load the dataset and split it into features and labels.

    If ``dataset_path`` exists, it is loaded as a CSV. Otherwise the
    built-in scikit-learn Iris dataset is used as a safe fallback so the
    pipeline remains runnable out of the box.

    Parameters
    ----------
    dataset_path : Path
        Path to a CSV file containing the dataset.
    target_column : str
        Name of the column containing class labels.

    Returns
    -------
    tuple[pandas.DataFrame, pandas.Series]
        Feature matrix ``X`` and label vector ``y``.

    Raises
    ------
    DatasetError
        If the dataset is missing, empty, malformed, or the target
        column cannot be found.
    """
    if dataset_path.exists():
        dataframe = _load_from_csv(dataset_path)
    else:
        logger.warning(
            "Dataset file not found at %s. Falling back to built-in Iris dataset.",
            dataset_path,
        )
        dataframe = _load_builtin_iris(target_column)

    _validate_dataframe(dataframe, target_column)

    features = dataframe.drop(columns=[target_column])
    labels = dataframe[target_column]

    logger.info(
        "Dataset loaded successfully: %d rows, %d features.",
        len(dataframe),
        features.shape[1],
    )
    return features, labels


def _load_from_csv(dataset_path: Path) -> pd.DataFrame:
    """
    Read a CSV file into a DataFrame.

    Parameters
    ----------
    dataset_path : Path
        Path to the CSV file.

    Returns
    -------
    pandas.DataFrame
        The raw, unvalidated dataset.

    Raises
    ------
    DatasetError
        If the file cannot be parsed as CSV.
    """
    try:
        return pd.read_csv(dataset_path)
    except (pd.errors.EmptyDataError, pd.errors.ParserError) as exc:
        raise DatasetError(f"Failed to parse dataset at {dataset_path}: {exc}") from exc
    except OSError as exc:
        raise DatasetError(
            f"Failed to read dataset file at {dataset_path}: {exc}"
        ) from exc


def _load_builtin_iris(target_column: str) -> pd.DataFrame:
    """
    Build a DataFrame from scikit-learn's built-in Iris dataset.

    Parameters
    ----------
    target_column : str
        Name to assign to the label column.

    Returns
    -------
    pandas.DataFrame
        The Iris dataset as a single DataFrame with a named target column.
    """
    iris = load_iris(as_frame=True)
    dataframe = iris.frame.rename(columns={"target": target_column})
    dataframe[target_column] = dataframe[target_column].map(
        dict(enumerate(iris.target_names))
    )
    return dataframe


def _validate_dataframe(dataframe: pd.DataFrame, target_column: str) -> None:
    """
    Validate structural integrity of a loaded dataset.

    Parameters
    ----------
    dataframe : pandas.DataFrame
        The dataset to validate.
    target_column : str
        Name of the expected label column.

    Raises
    ------
    DatasetError
        If the dataset is empty, has duplicate columns, is missing the
        target column, or contains no usable feature columns.
    """
    if dataframe.empty:
        raise DatasetError("Dataset is empty.")

    if dataframe.columns.duplicated().any():
        duplicates = dataframe.columns[dataframe.columns.duplicated()].tolist()
        raise DatasetError(f"Dataset contains duplicate columns: {duplicates}")

    if target_column not in dataframe.columns:
        raise DatasetError(f"Target column '{target_column}' not found in dataset.")

    if dataframe.drop(columns=[target_column]).shape[1] == 0:
        raise DatasetError("Dataset contains no feature columns.")

    if dataframe[target_column].isnull().any():
        raise DatasetError("Target column contains missing values.")

    if dataframe.drop(columns=[target_column]).isnull().any().any():
        raise DatasetError("Feature columns contain missing values.")

    logger.info("Dataset validation passed.")
