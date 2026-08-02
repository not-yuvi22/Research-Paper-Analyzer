import os
import requests
from dotenv import load_dotenv
load_dotenv()

JINA_API_KEY = os.getenv("JINA_API_KEY")

URL = "https://api.jina.ai/v1/embeddings"


def get_embeddings(texts):

    headers = {
        "Authorization": f"Bearer {JINA_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "jina-embeddings-v4",
        "task": "retrieval.passage",
        "dimensions": 384,
        "embedding_type": "float",
        "input": texts
    }

    response = requests.post(
        URL,
        headers=headers,
        json=payload,
        timeout=120
    )

    response.raise_for_status()

    result = response.json()

    embeddings = [
        item["embedding"]
        for item in result["data"]
    ]

    return embeddings