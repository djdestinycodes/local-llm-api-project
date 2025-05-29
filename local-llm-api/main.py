from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import httpx
import logging
import traceback
import hashlib
import diskcache
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS setup - adjust in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
OLLAMA_URL = "http://localhost:11434"
CACHE_DIR = ".llm_cache"

# Initialize persistent cache
cache = diskcache.Cache(CACHE_DIR)

# Request schema
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[Message]

# Utility function to hash payloads for caching
def hash_payload(payload: dict) -> str:
    return hashlib.sha256(str(payload).encode()).hexdigest()

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_URL}/api/tags")
            response.raise_for_status()
        return {"message": "Ollama server is reachable and models are available."}
    except Exception as e:
        logger.error(f"Health check failed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=502, detail=f"Failed to reach Ollama server: {str(e)}")

# Chat completions endpoint with API key check and caching
@app.post("/v1/chat/completions")
async def chat_completions(
    chat_request: ChatRequest,
    x_api_key: str = Header(None)  # API key from request header
):
    # Validate API key
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    payload = {
        "model": chat_request.model,
        "messages": [msg.dict() for msg in chat_request.messages],
    }

    cache_key = hash_payload(payload)
    logger.info(f"Request payload hash: {cache_key}")

    # Return cached response if available
    if cache_key in cache:
        logger.info("Serving response from cache")
        return JSONResponse(content=cache[cache_key])

    # Forward request to Ollama server if no cache
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(f"{OLLAMA_URL}/v1/chat/completions", json=payload)
            response.raise_for_status()
            json_response = response.json()
            logger.info("Response received from Ollama, caching it.")
            cache[cache_key] = json_response
            return JSONResponse(content=json_response)

    except httpx.HTTPStatusError as http_err:
        logger.error(f"Ollama HTTP error: {http_err.response.status_code} - {http_err.response.text}")
        raise HTTPException(status_code=http_err.response.status_code, detail=f"Ollama error: {http_err.response.text}")
    except Exception as e:
        logger.error(f"Error contacting Ollama: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=502, detail=f"Failed to reach Ollama server: {str(e)}")
