import json
from model import generate_response

import json
import re


def safe_json_parse(text):

    if not text:
        return {}

    text = text.strip()

    # remove markdown fences
    text = re.sub(r"^```json", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)

    text = text.strip()

    try:
        return json.loads(text)

    except Exception as e:

        print("\nJSON PARSE ERROR:")
        print(e)

        # try extracting first JSON object
        try:

            start = text.find("{")
            end = text.rfind("}")

            if start != -1 and end != -1:
                candidate = text[start:end + 1]
                return json.loads(candidate)

        except Exception:
            pass

        return {}


# ==================================================
# PROMPT
# ==================================================
def build_prompt(paper_text):

    return f"""
You are an expert research paper analysis system.

Analyze the paper and extract information ONLY from the provided text.

==================================================
STRICT RULES
==================================================

- Use ONLY information present in the paper
- Do NOT hallucinate
- If information is missing, return "" or []

- Output MUST be VALID JSON ONLY
- No markdown
- No explanation

==================================================
SECTION SUMMARY RULES
==================================================

- Each section summary MUST be 80–150 words
- Write one coherent paragraph (no bullets)
- Must include: objective, method, key idea, results, conclusion
- Preserve technical details from paper

==================================================
CRITICAL EXTRACTION RULES
==================================================

- "limitations":
  Extract weaknesses, constraints, assumptions, scalability issues, evaluation gaps
  If not explicitly written, infer ONLY from results/discussion

- "future_work":
  Extract next steps, improvements, extensions mentioned in conclusion or discussion
  If not explicitly present, infer reasonable research extensions

- DO NOT leave both fields empty if paper contains conclusion or results

==================================================
OUTPUT FORMAT (MUST FOLLOW EXACTLY)
==================================================

{{
    "title": "",
    "authors": [],
    "keywords": [],
    "objective": "",

    "section_summaries": {{
        "abstract": "",
        "introduction": "",
        "methodology": "",
        "results": "",
        "conclusion": ""
    }},

    "datasets": [],
    "models": [],
    "metrics": [],

    "key_results": [],
    "key_contributions": [],

    "limitations": [],
    "future_work": []
}}

==================================================
PAPER
==================================================

{paper_text}
"""

# ==================================================
# EXTRACT JSON
# ==================================================
def extract_json(paper_text):
    print(f"Paper Length = {len(paper_text)} characters")      #change 3

    prompt = build_prompt(paper_text)

    response = generate_response(prompt)

    response = response.strip()

    print("\n================ RAW LLM RESPONSE ================\n")
    print(response)
    print("\n==================================================\n")

    # ------------------------------------------
    # REMOVE MARKDOWN
    # ------------------------------------------
    response = re.sub(r"```json", "", response, flags=re.I)
    response = re.sub(r"```", "", response)
    response = response.strip()

    # ------------------------------------------
    # TRY NORMAL JSON PARSE
    # ------------------------------------------
    try:
        parsed = json.loads(response)

        print("\n✅ Full JSON Parsed Successfully\n")

    except Exception as e:

        print("\nJSON PARSE ERROR:")
        print(e)

        # ------------------------------------------
        # RECOVER TRUNCATED JSON
        # ------------------------------------------
        start = response.find("{")

        if start != -1:

            candidate = response[start:]

            # close unfinished braces
            open_curly = candidate.count("{")
            close_curly = candidate.count("}")

            missing = open_curly - close_curly

            if missing > 0:
                candidate += "}" * missing

            try:
                parsed = json.loads(candidate)

                print("\n✅ Recovered Partial JSON\n")

            except Exception:

                print("\n❌ Recovery Failed\n")
                parsed = {}

        else:
            parsed = {}

    print("\n================ PARSED OBJECT ================\n")
    print(parsed)
    print("\n================================================\n")

    default_json = {
        "title": "",
        "authors": [],
        "keywords": [],
        "objective": "",
        "section_summaries": {
            "abstract": "",
            "introduction": "",
            "methodology": "",
            "results": "",
            "conclusion": ""
        },
        "datasets": [],
        "models": [],
        "metrics": [],
        "key_results": [],
        "key_contributions": [],
        "limitations": [],
        "future_work": []
    }

    if isinstance(parsed, dict):

        for key, value in parsed.items():

            if key == "section_summaries" and isinstance(value, dict):
                default_json["section_summaries"].update(value)

            else:
                default_json[key] = value

    return default_json

 


# ==================================================
# SAVE JSON
# ==================================================
def save_json(data, filename="summary.json"):

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"\nSaved -> {filename}")


# ==================================================
# LOAD PAPER
# ==================================================
def load_paper(file_path="paper_text.txt"):

    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


# ==================================================
# MAIN
# ==================================================
#if __name__ == "__main__":

 #   print("Loading paper...")

 #   paper_text = load_paper("paper_chunks.txt")

    # reduce context size to avoid truncated JSON

 #   print("Paper Length:", len(paper_text))

  #  print("Generating structured JSON summary...")

  #  result = extract_json(paper_text)

   # save_json(result)

   # print("\n===== JSON OUTPUT =====\n")

  #  print(json.dumps(result, indent=4, ensure_ascii=False))