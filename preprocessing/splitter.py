"""
Train/test splitting.

Responsibility: divide features and labels into training and testing
subsets. No scaling or model logic belongs here.
"""

import pandas as pd
from sklearn.model_selection import train_test_split

from utils.logger import get_logger

logger = get_logger(__name__)


def split_dataset(
    features: pd.DataFrame,
    labels: pd.Series,
    test_size: float,
    random_seed: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Split features and labels into training and testing sets.

    Parameters
    ----------
    features : pandas.DataFrame
        Feature matrix.
    labels : pandas.Series
        Label vector aligned with ``features``.
    test_size : float
        Proportion of the dataset to allocate to the test split (0, 1).
    random_seed : int
        Seed controlling the shuffle for reproducibility.

    Returns
    -------
    tuple[pandas.DataFrame, pandas.DataFrame, pandas.Series, pandas.Series]
        ``X_train``, ``X_test``, ``y_train``, ``y_test``.
    """
    x_train, x_test, y_train, y_test = train_test_split(
        features,
        labels,
        test_size=test_size,
        random_state=random_seed,
        shuffle=True,
        stratify=labels,
    )

    logger.info(
        "Dataset split complete: %d training samples, %d testing samples.",
        len(x_train),
        len(x_test),
    )
    return x_train, x_test, y_train, y_test
