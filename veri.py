from groq import Groq
from api import GROQ_API_KEY

client = Groq(api_key = GROQ_API_KEY)

response = client.chat.completions.create(
    model ="llama-3.1-8b-instant",
    messages = [
        {
            "role":"user",
            "content":"Say hello"
        }
    ]
)

print(response.choices[0].message.content)