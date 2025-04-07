const API_BASE_URL = "https://localhost:7156/api"; // URL DE LA API

export async function createSession() {
  const response = await fetch(`${API_BASE_URL}/Session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

export async function addPlayerToSession(sessionId, playerName) {
  const response = await fetch(`${API_BASE_URL}/Session/${sessionId}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: playerName })
  });
  return response.json();
}
