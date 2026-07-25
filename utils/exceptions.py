"""Custom exception hierarchy used throughout the pipeline.

Using dedicated exception types (instead of raising generic
``Exception``/``ValueError`` everywhere) lets callers catch failures
at the appropriate level of granularity.
"""


class DataClassificationError(Exception):
    """Base exception for all project-specific errors."""


class DatasetError(DataClassificationError):
    """Raised when a dataset cannot be loaded or fails validation."""


class ModelPersistenceError(DataClassificationError):
    """Raised when a model cannot be saved to or loaded from disk."""


class PredictionError(DataClassificationError):
    """Raised when a prediction request is invalid or fails."""
