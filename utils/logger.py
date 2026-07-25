"""
Shared logging configuration.

Provides a single factory function so every module logs with a
consistent format instead of configuring logging independently.
"""

import logging

from config import LOG_FORMAT, LOG_LEVEL

_CONFIGURED = False


def get_logger(name: str) -> logging.Logger:
    """
    Create (or retrieve) a configured logger.

    Parameters
    ----------
    name : str
        Name of the logger, typically ``__name__`` of the calling module.

    Returns
    -------
    logging.Logger
        A logger instance with a consistent formatter and level applied
        exactly once at the root of the application.
    """
    global _CONFIGURED
    if not _CONFIGURED:
        logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
        _CONFIGURED = True
    return logging.getLogger(name)
