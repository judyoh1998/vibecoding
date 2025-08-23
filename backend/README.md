# BetterFriend NLP Backend

This is the Python FastAPI backend for the BetterFriend communication coaching application.

## Setup

**Important**: If you encounter a `ModuleNotFoundError: No module named '_signal'` error, follow these steps to recreate the virtual environment:

1. Navigate to the backend directory:
```bash
cd backend
```

2. Deactivate any currently active virtual environment:
```bash
deactivate
```

3. Remove the existing virtual environment (if it exists):
```bash
rm -rf venv  # On Windows: rmdir /s venv
```

4. Create a fresh virtual environment:
```bash
python3 -m venv venv
```

5. Activate the new virtual environment:
```bash
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

6. Install dependencies:
```bash
pip install -r requirements.txt
```

**Standard Setup** (if no errors occur):

1. Create a virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API documentation.

## Endpoints

- `GET /` - Health check
- `POST /analyze` - Analyze conversation text

## Development

The server runs with auto-reload enabled during development. Any changes to the code will automatically restart the server.