# THIS IS A TEST FILE 
from fastapi import FastAPI, UploadFile, File
import uvicorn
import os

from day6_json_format_summary import extract_json

app = FastAPI()


# ==========================================
# HEALTH CHECK
# ==========================================
@app.get("/")
def home():
    return {
        "status": "running",
        "message": "Research Paper Analyzer API is active"
    }


# ==========================================
# PAPER ANALYSIS ENDPOINT
# ==========================================
@app.post("/analyze-paper")
async def analyze_paper(file: UploadFile = File(...)):

    # save uploaded file temporarily
    file_path = "temp_paper.txt"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # read text
    with open(file_path, "r", encoding="utf-8") as f:
        paper_text = f.read()

    # optional safety truncation
    paper_text = paper_text[:12000]

    # run your pipeline
    result = extract_json(paper_text)

    # cleanup temp file
    os.remove(file_path)

    return result


# ==========================================
# RUN SERVER
# ==========================================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
