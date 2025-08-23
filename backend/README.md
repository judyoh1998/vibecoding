# BetterFriend NLP Backend

This is the Python FastAPI backend for the BetterFriend communication coaching application.

## Setup

1. Create a virtual environment:
```bash
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