# Data Classification — Supervised Machine Learning Platform

A production-ready supervised machine learning application that classifies tabular datasets using K-Nearest Neighbors (KNN). Features a modular Python execution pipeline, a FastAPI REST API backend, and an enterprise React TypeScript web interface with progressive disclosure workflow.

---

## Overview

The application demonstrates an end-to-end supervised machine learning workflow:
`Dataset Loading` $\to$ `Structural Validation` $\to$ `Train/Test Split` $\to$ `Feature Scaling` $\to$ `Model Training` $\to$ `Prediction` $\to$ `Evaluation` $\to$ `Artifact Generation`.

### Key Features
- **Modular Pipeline**: Clean separation of dataset loading, scaling, splitting, model training, prediction, and metric evaluation.
- **Format Auto-Detection**: Supports standard `.csv` files as well as raw UCI `.data` files (e.g. `bezdekIris.data`) with automatic header assignment (`sepal_length`, `sepal_width`, `petal_length`, `petal_width`, `species`).
- **REST API Backend**: Built with FastAPI to expose type-safe endpoints for status, dataset upload, pipeline execution, metrics retrieval, and file export.
- **Enterprise Web Client**: Designed with React 18, TypeScript, TailwindCSS, and Framer Motion following Apple HIG, Linear, Vercel, and Stripe design standards.
- **Progressive Disclosure Workflow**: Step-by-step workflow (`Dataset Upload` $\to$ `Preview & Validation` $\to$ `Animated Pipeline Execution` $\to$ `Staggered Results Reveal`).

---

## Repository Structure

```
Data-Classification/
├── app.py                     # CLI pipeline orchestration
├── server.py                  # FastAPI REST API server
├── config.py                  # Centralized configuration & hyperparameter defaults
├── requirements.txt           # Python dependencies
├── README.md
├── LICENSE
├── .gitignore
│
├── data/                      # Dataset storage (.csv / .data)
├── models/                    # Model serialization directory (classifier.pkl)
├── outputs/                   # Generated evaluation artifacts
│
├── preprocessing/
│   ├── loader.py              # Dataset loading & schema validation
│   ├── scaler.py              # StandardScaler (fit exclusively on train split)
│   └── splitter.py            # Reproducible train/test split
│
├── models/
│   ├── train.py               # Model training & joblib persistence
│   └── predict.py             # Inference on test set
│
├── evaluation/
│   ├── metrics.py             # Accuracy, precision, recall, F1 computation
│   └── confusion.py           # Confusion matrix calculation & heatmap plot
│
├── utils/
│   ├── logger.py              # Structured logging configuration
│   ├── exceptions.py         # Custom typed exceptions
│   └── output_writer.py       # Metrics JSON & report text file writers
│
├── tests/                     # Isolated pytest test suite
│
└── frontend/                  # React TypeScript web application
    ├── src/
    │   ├── components/        # Enterprise UI components
    │   ├── services/          # API client fetch wrapper
    │   ├── types/             # TypeScript data interfaces
    │   ├── App.tsx            # Main workflow state machine
    │   ├── main.tsx           # Entry point
    │   └── index.css          # Styling & Tailwind setup
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & npm 9+

### 2. Backend Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Python CLI pipeline
python app.py

# Start FastAPI server
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The web application will be available at `http://localhost:5173`.

---

## Running Unit Tests

```bash
# Run backend pytest suite
./venv/bin/python -m pytest tests/ -v
```

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Health check & system status |
| `/api/load-builtin` | POST | Select built-in Iris dataset and return preview metadata |
| `/api/upload` | POST | Upload custom `.csv` or `.data` dataset file |
| `/api/run` | POST | Execute full ML pipeline and return evaluation metrics |
| `/api/export/{file_type}` | GET | Export `json` metrics, `report` (.txt), or `matrix` (.png) |
| `/api/reset` | POST | Reset active dataset state |

---

## Design & Architecture Principles

- **Single Responsibility**: Each Python module performs exactly one stage of the pipeline.
- **No Data Leakage**: Feature scaling is fit exclusively on training data (`X_train`).
- **Fail-Fast Error Handling**: Typed exceptions (`DatasetError`, `ModelPersistenceError`, `PredictionError`) prevent silent data corruption.
- **Predictable Performance**: Tabular numbers, zero bouncing animations, and responsive layout structure across desktop, tablet, and mobile.

---

## License

Released under the [MIT License](LICENSE).
