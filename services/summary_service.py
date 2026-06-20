from summary_generator import extract_json
def generate_summary(paper_text: str):
    if not paper_text:
        return {
            "error": "No text available for summarization."
        }
    return extract_json(paper_text)