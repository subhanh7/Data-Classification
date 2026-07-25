"""
Output artifact writing.

Responsibility: serialize metrics and reports to disk. Keeps file I/O
concerns out of the evaluation modules.
"""

import json
from pathlib import Path
from typing import Any

from utils.logger import get_logger

logger = get_logger(__name__)


def write_metrics_json(metrics: dict[str, Any], output_path: Path) -> None:
    """
    Write a metrics dictionary to disk as JSON.

    Parameters
    ----------
    metrics : dict[str, Any]
        Metrics to serialize.
    output_path : Path
        Destination file path.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as file_handle:
        json.dump(metrics, file_handle, indent=4)
    logger.info("Metrics written to %s", output_path)


def write_text_report(report: str, output_path: Path) -> None:
    """
    Write a plain-text report to disk.

    Parameters
    ----------
    report : str
        Report content to write.
    output_path : Path
        Destination file path.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(report, encoding="utf-8")
    logger.info("Classification report written to %s", output_path)
