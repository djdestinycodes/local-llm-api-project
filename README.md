# DJD LLM Chat

AI-powered chat interface connecting to a local language model server (e.g., Ollama) via a FastAPI backend.  
Features caching, API key authentication, and a clean user-friendly frontend.

---

## Features

- FastAPI backend proxy for local LLM API calls  
- Caching repeated requests for faster responses  
- API key validation for secure access  
- Frontend with chat UI, model selection, and dark mode toggle  
- Copy and download chat history  
- Regenerate AI responses  
- Backend health check endpoint

---

## Tech Stack

Backend:  
Python 3.10+, FastAPI, Uvicorn, httpx, diskcache, Pydantic, dotenv

Frontend:  
HTML5, CSS3, JavaScript (ES6+), Fetch API

---

## Prerequisites

- Python 3.10 or higher  
- Ollama CLI installed and running locally  
- Ollama model: `llama3-latest` downloaded and available in Ollama  
- Node.js 14+ and npm/yarn (if using React)  
- Git  
- Optional: Docker (for containerized deployment)  

---

## Installation

1. Clone the repo:  
```

git clone [https://github.com/djdestinycodes/local-llm-api-project.git](https://github.com/djdestinycodes/local-llm-api-project.git)
cd local-llm-api-project

```

2. Set up Python environment and install dependencies:  
```

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

```

3. Create a `.env` file with:  
```

API_KEY=your_api_key_here
OLLAMA_URL=[http://localhost:11434](http://localhost:11434)

```

> **Note:** Replace `http://localhost:11434` with your own local Ollama API endpoint if different.

4. Make sure Ollama daemon is running and model is ready:  
```

ollama run llama3-latest

```

5. Start backend server:  
```

uvicorn main\:app --reload --host 127.0.0.1 --port 8000

```

6. Open `index.html` in your browser or serve it with a local HTTP server.

---

## Configuration

- Adjust available models in frontend dropdown (`index.html`)  
- Cache settings configurable in `main.py`  
- CORS policy modifiable in `main.py` for production  
- Add authentication or rate limiting as needed

---

## Usage

- Enter API key in `config.js`  
- Select model and enter message  
- Click Send or press Enter  
- Use Clear, Copy, Download buttons to manage chat  
- Toggle Dark Mode as preferred

---

## Contributing

Feel free to open issues or pull requests.

---

## Contact

Questions? Email: girishjesudas@gmail.com

