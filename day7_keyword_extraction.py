import json

from model import generate_response


# ==========================================
# LOAD METADATA JSON
# ==========================================
def load_metadata(file_path):

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


# ==========================================
# COLLECT IMPORTANT TEXT
# ==========================================
# Uses already extracted metadata.
#
# No need to process paper again.
# ==========================================
def build_keyword_context(metadata):

    text_parts = []

    for section in [
        "abstract",
        "introduction",
        "methodology",
        "results",
        "conclusion"
    ]:

        section_data = metadata.get(
            section,
            {}
        )

        text_parts.append(
            section_data.get(
                "main_topic",
                ""
            )
        )

        text_parts.extend(
            section_data.get(
                "key_points",
                []
            )
        )

        text_parts.extend(
            section_data.get(
                "methods",
                []
            )
        )

        text_parts.extend(
            section_data.get(
                "models",
                []
            )
        )

        text_parts.extend(
            section_data.get(
                "datasets",
                []
            )
        )

    return "\n".join(
        [str(x) for x in text_parts]
    )


# ==========================================
# BUILD PROMPT
# ==========================================
# Extract only important technical terms.
# ==========================================
def build_prompt(context):

    return f"""
You are an expert research paper analyst.

Extract the 15 most important technical keywords.

Rules:
- Return only JSON
- No explanation
- No markdown
- No extra text

Text:
{context}

Return:

{{
    "keywords":[]
}}
"""


# ==========================================
# EXTRACT KEYWORDS
# ==========================================
def extract_keywords(context):

    prompt = build_prompt(
        context
    )

    response = generate_response(
        prompt
    )

    try:
        return json.loads(
            response
        )

    except Exception:

        return {
            "keywords":[]
        }


# ==========================================
# SAVE KEYWORDS
# ==========================================
def save_keywords(data):

    with open(
        "paper_keywords.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=4,
            ensure_ascii=False
        )

    print(
        "\nSaved -> paper_keywords.json"
    )


# ==========================================
# COMPLETE PIPELINE
# ==========================================
def run_keyword_extraction():

    print(
        "Loading metadata..."
    )

    metadata = load_metadata(
        "paper_metadata.json"
    )

    print(
        "Building context..."
    )

    context = build_keyword_context(
        metadata
    )

    print(
        "Extracting keywords..."
    )

    keywords = extract_keywords(
        context
    )

    save_keywords(
        keywords
    )

    return keywords


# ==========================================
# RUN
# ==========================================
if __name__ == "__main__":

    result = run_keyword_extraction()

    print(
        json.dumps(
            result,
            indent=4
        )
    )