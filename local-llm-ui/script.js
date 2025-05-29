// script.js

import { API_KEY } from './config.js'; // <-- Make sure you have this file with your key

const API_URL = 'http://127.0.0.1:8000/v1/chat/completions';

// DOM Elements
const input = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');
const chatSection = document.getElementById('chat');
const modelSelect = document.getElementById('model-select');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

let chatHistory = [];

// Disable send button if input is empty
input.addEventListener('input', () => {
  sendBtn.disabled = input.value.trim() === '';
});

// Allow sending message on Enter (without Shift)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) sendBtn.click();
  }
});

// Send message handler
sendBtn.addEventListener('click', async () => {
  const prompt = input.value.trim();
  if (!prompt) return;

  addUserMessage(prompt);
  resetInput();
  await fetchAIResponse(prompt);
});

// Clear chat history and UI
clearBtn.addEventListener('click', () => {
  chatHistory = [];
  chatSection.innerHTML = '';
});

// Copy chat history to clipboard
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(formatChatHistory());
    alert('Chat copied to clipboard');
  } catch {
    alert('Failed to copy chat');
  }
});

// Download chat history as text file
downloadBtn.addEventListener('click', () => {
  try {
    const blob = new Blob([formatChatHistory()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chat.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    alert('Failed to download chat');
  }
});

// Toggle light/dark mode
themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked;
  document.body.classList.toggle('dark', isDark);
  themeLabel.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  themeToggle.setAttribute('aria-checked', isDark);
});

// Clear and disable input
function resetInput() {
  input.value = '';
  sendBtn.disabled = true;
}

// Format chat history for copy/download
function formatChatHistory() {
  return chatHistory.map(e => `User: ${e.prompt}\nAI: ${e.response}`).join('\n\n');
}

// Append user message to chat
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'user-message';
  div.textContent = text;
  chatSection.appendChild(div);
  scrollToBottom();
}

// Append AI response with regenerate button
function addAIResponse(id, text) {
  const container = document.createElement('div');
  container.className = 'ai-message';
  container.dataset.id = id;

  const content = document.createElement('p');
  content.textContent = text;

  const regenBtn = document.createElement('button');
  regenBtn.className = 'regenerate-btn';
  regenBtn.textContent = 'Regenerate Response';
  regenBtn.addEventListener('click', () => regenerateResponse(id));

  container.append(content, regenBtn);
  chatSection.appendChild(container);
  scrollToBottom();
}

// Update existing AI response text
function updateAIResponse(id, text) {
  const container = chatSection.querySelector(`.ai-message[data-id="${id}"]`);
  if (container) {
    const p = container.querySelector('p');
    if (p) p.textContent = text;
  }
  scrollToBottom();
}

// Regenerate AI response for a given chat entry
async function regenerateResponse(id) {
  const entry = chatHistory.find(e => e.id === id);
  if (entry) await fetchAIResponse(entry.prompt, id);
}

// Fetch AI response from backend API
async function fetchAIResponse(prompt, regenerateId = null) {
  if (!API_KEY) {
    alert('API key is missing. Please add it to config.js');
    return;
  }

  const id = regenerateId || `resp-${Date.now()}`;

  if (!regenerateId) {
    addAIResponse(id, '...');
  } else {
    updateAIResponse(id, '...');
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        model: modelSelect.value,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const data = await res.json();
    const aiText = data.choices?.[0]?.message?.content || 'No response';

    if (!regenerateId) {
      chatHistory.push({ id, prompt, response: aiText });
    } else {
      const index = chatHistory.findIndex(e => e.id === id);
      if (index !== -1) chatHistory[index].response = aiText;
    }

    updateAIResponse(id, aiText);

  } catch (err) {
    console.error(err);
    updateAIResponse(id, 'Error getting response.');
  }
}

// Scroll chat to bottom
function scrollToBottom() {
  chatSection.scrollTop = chatSection.scrollHeight;
}
