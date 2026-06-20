import json
import re


# ==================================================
# GROQ CONFIG
# ==================================================
from groq import Groq
from api import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


# ==================================================
# CLEAN LLM OUTPUT
# ==================================================
def clean_llm_output(text: str) -> str:

    text = re.sub(r"```json", "", text, flags=re.I)
    text = re.sub(r"```", "", text)
    text = text.strip()

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1:
        text = text[start:end + 1]

    return text


# ==================================================
# (OPTIONAL) TRUNCATE PROMPT SAFETY
# Kept to preserve your original architecture idea
# ==================================================
def truncate_prompt(prompt: str, max_tokens: int = 3000) -> str:
    max_chars = max_tokens * 4
    if len(prompt) > max_chars:
        return prompt[:max_chars] + "\n\n[Context truncated]"
    return prompt


# ==================================================
# GENERATE RESPONSE (GROQ VERSION)
# ==================================================
def generate_response(prompt: str) -> str:

    prompt = truncate_prompt(prompt)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",   # FAST + FREE Groq model
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict research paper assistant. "
                        "Follow instructions exactly and use only provided context."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=2000
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error in Groq API call: {str(e)}"


# ==================================================
# SAFE JSON PARSER
# ==================================================
def safe_json_parse(text: str, fallback: dict = None) -> dict:

    if fallback is None:
        fallback = {}

    try:
        cleaned = clean_llm_output(text)
        return json.loads(cleaned)
    except Exception:
        return fallback

