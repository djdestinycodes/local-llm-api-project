
# 🤖 DJD LLM Chat

[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-blue?logo=code&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg?logo=python)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**DJD LLM Chat** is a lightweight AI-powered chat interface that communicates with your **local language models** (like [Ollama](https://ollama.com)) via a FastAPI backend. It includes API authentication, response caching, and a sleek, dark-mode-enabled frontend.

> Think ChatGPT, but 100% local and private. Run it on your machine, keep your data secure.

---

## ✨ Features

- ⚡ FastAPI backend proxy for local LLM calls
- 💾 Disk caching for faster repeat responses
- 🔐 API key authentication
- 🌗 Toggle dark/light mode
- 🔄 Regenerate previous responses
- 📤 Export/download chat history
- 📋 One-click copy responses
- 📡 Backend health check

---

## 🧠 Tech Stack

**Backend**  
`Python 3.10+`, `FastAPI`, `Uvicorn`, `httpx`, `diskcache`, `Pydantic`, `python-dotenv`

**Frontend**  
`HTML5`, `CSS3`, `Vanilla JavaScript`, `Fetch API`

> Optionally, the frontend can be rebuilt in React/Next.js or bundled via Electron.

---

## ⚙️ Prerequisites

- ✅ Python 3.10 or later  
- ✅ [Ollama CLI](https://ollama.com) installed and running  
- ✅ `llama3-latest` or other model downloaded in Ollama  
- ✅ Git  
- ✅ Optional: Node.js 14+ (for React UI)  
- ✅ Optional: Docker (for containerized deployment)  

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/djdestinycodes/local-llm-api-project.git
cd local-llm-api-project
```

### 2. Setup Python Environment

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Add Your Environment Variables

Create a `.env` file in the root directory:

```env
API_KEY=your_api_key_here
OLLAMA_URL=http://localhost:11434
```

> 🔁 Replace `OLLAMA_URL` with your Ollama endpoint if different.

### 4. Launch Ollama with Model

```bash
ollama run llama3
```

### 5. Start the Backend Server

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 6. Open Frontend in Browser

Open `index.html` in your browser or serve with a local HTTP server:

```bash
python3 -m http.server 8080
```

Visit: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Configuration

- Change model list in `index.html`
- Modify caching & logging in `main.py`
- Add additional routes or custom prompts
- Customize UI via `style.css`
- Replace default API key logic in `main.py`

---

## 📋 Usage

1. Open your browser to the frontend.
2. Enter your API key.
3. Select your model.
4. Start chatting!
5. Use:
   - `Regenerate` to redo previous output
   - `Copy` or `Download` to save chat
   - `Clear` to reset conversation
   - `Toggle` to switch between themes

---

## 🐳 Docker (Optional)

Build and run in Docker:

```bash
docker build -t djd-llm-chat .
docker run -p 8000:8000 djd-llm-chat
```

---

## 🧩 Project Structure

```
📁 local-llm-api-project/
├── backend/
│   ├── main.py
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── config.js
├── assets/
│   └── demo.png
└── README.md
```

---

## 🤝 Contributing

Pull requests are welcome!  
Please open an issue first for major changes.  

---

## 📬 Contact

**Girish Vilvankadu Jesudas**  
📧 girishjesudas@gmail.com  
🌐 [GitHub: djdestinycodes](https://github.com/djdestinycodes)

---

> _Built for privacy, speed, and total local control._ 🧠
