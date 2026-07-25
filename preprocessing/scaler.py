"""
Feature scaling.

Responsibility: fit a scaler on training data only and apply it to
both training and testing data, preventing data leakage.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

from utils.logger import get_logger

logger = get_logger(__name__)


def scale_features(
    x_train: pd.DataFrame,
    x_test: pd.DataFrame,
) -> tuple[np.ndarray, np.ndarray, StandardScaler]:
    """
    Standardize features using a scaler fitted on training data only.

    Parameters
    ----------
    x_train : pandas.DataFrame
        Training feature matrix used to fit the scaler.
    x_test : pandas.DataFrame
        Testing feature matrix, transformed using the fitted scaler.

    Returns
    -------
    tuple[numpy.ndarray, numpy.ndarray, StandardScaler]
        Scaled training features, scaled testing features, and the
        fitted scaler instance for reuse during inference.
    """
    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)

    logger.info(
        "Feature scaling completed using StandardScaler (fit on training data only)."
    )
    return x_train_scaled, x_test_scaled, scaler
