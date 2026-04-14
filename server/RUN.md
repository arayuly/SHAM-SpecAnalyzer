![Python](https://img.shields.io/badge/Python-3.12-3776ab)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135.3-009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791)

# 🚀 Quick Start Guide

## Prerequisites

- Python 3.12 or higher
- pip (Python package manager)

## Setup

### 1. Create Virtual Environment

```bash
python3.12 -m venv venv
```

### 2. Activate Virtual Environment

**Linux/macOS:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Development Server

### Option 1: Using FastAPI dev command (Recommended)

```bash
fastapi dev
```

### Option 2: Using Uvicorn directly

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Access the Application

Once the server is running, open your browser and navigate to:

🔗 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

The interactive API documentation (Swagger UI) will be available at this URL.

---

## Troubleshooting

- **Virtual environment not activating?** Make sure you're in the project directory
- **Port 8000 already in use?** Specify a different port: `uvicorn main:app --reload --port 8001`
- **Dependencies not installing?** Update pip: `pip install --upgrade pip`
