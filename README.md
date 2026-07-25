# 🚀 Data Classification — Enterprise Supervised Machine Learning Platform

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

A production-ready machine learning platform that demonstrates the complete supervised learning lifecycle using **K-Nearest Neighbors (KNN)**. The application combines a modular Python ML pipeline, a FastAPI backend, and a modern React + TypeScript frontend with an intuitive step-by-step workflow.

---

# 📸 Screenshots

> Replace these placeholders with your screenshots.

| Landing Page | Dataset Preview |
|---------------|-----------------|
| ![](screenshots/home.png) | ![](screenshots/upload.png) |

| Pipeline Execution | Results Dashboard |
|-------------------|-------------------|
| ![](screenshots/pipeline.png) | ![](screenshots/dashboard.png) |

| Confusion Matrix |
|------------------|
| ![](screenshots/confusion.png) |

---

# ✨ Features

- 📊 End-to-end supervised machine learning workflow
- 📁 Upload datasets in **CSV** or **UCI `.data`** format
- 🤖 K-Nearest Neighbors (KNN) classifier
- 📈 Accuracy, Precision, Recall & F1 Score evaluation
- 🔥 Confusion Matrix visualization
- ⚡ FastAPI REST API
- 🎨 Enterprise React + TypeScript frontend
- 📱 Responsive design
- 🚀 Progressive disclosure workflow
- 🧪 Comprehensive unit tests
- 🔒 Clean modular architecture

---

# 🧠 Machine Learning Workflow

```text
Dataset Upload
      │
      ▼
Dataset Validation
      │
      ▼
Train/Test Split
      │
      ▼
Feature Scaling
      │
      ▼
Model Training (KNN)
      │
      ▼
Prediction
      │
      ▼
Evaluation
      │
      ▼
Metrics + Confusion Matrix
      │
      ▼
Export Results
```

---

# 🏗️ Architecture

```
Frontend (React + TypeScript)
            │
            ▼
     FastAPI REST API
            │
            ▼
Machine Learning Pipeline
            │
 ┌──────────┼──────────┐
 │          │          │
 ▼          ▼          ▼
Loader   Scaler    Splitter
 │
 ▼
KNN Training
 │
 ▼
Prediction
 │
 ▼
Evaluation
 │
 ▼
Generated Outputs
```

---

# 🛠️ Tech Stack

## Backend

- Python 3.11+
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Matplotlib
- Joblib

## Frontend

- React 18
- TypeScript
- TailwindCSS
- Vite
- Framer Motion

## Testing

- Pytest

---

# 📁 Project Structure

```text
Data-Classification/
│
├── app.py
├── server.py
├── config.py
├── requirements.txt
│
├── data/
├── preprocessing/
├── models/
├── evaluation/
├── utils/
├── outputs/
├── tests/
│
└── frontend/
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/subhanh7/Data-Classification.git
cd Data-Classification
```

---

## Backend

```bash
python -m venv venv

source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn server:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Open

```
http://localhost:5173
```

---

# 📂 Supported Dataset Formats

### CSV

```text
iris.csv
```

### UCI Dataset

```text
bezdekIris.data
```

The application automatically:

- Detects `.data` files
- Assigns feature headers
- Converts to the internal dataset format
- Validates the schema
- Executes the ML pipeline

No manual preprocessing is required.

---

# 🌐 API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/status` | System status |
| POST | `/api/load-builtin` | Load built-in Iris dataset |
| POST | `/api/upload` | Upload CSV or `.data` dataset |
| POST | `/api/run` | Execute ML pipeline |
| GET | `/api/export/{file_type}` | Download results |
| POST | `/api/reset` | Reset application |

---

# 🧪 Running Tests

```bash
pytest tests/ -v
```

---

# 🎯 Design Principles

- Clean Architecture
- Modular Design
- Separation of Concerns
- Progressive Disclosure
- Responsive UI
- Type Safety
- Fail-Fast Validation
- Reproducible Machine Learning Pipeline

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Mohammed Subhan**

GitHub: https://github.com/subhanh7

