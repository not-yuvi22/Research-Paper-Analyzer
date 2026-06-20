from model import generate_response
from day4_text_chunking import process_chunks


# ==============================
# LOAD CHUNKS
# ==============================
def load_chunks(file_path):

    raw_chunks = process_chunks(file_path)

    grouped = {}

    for item in raw_chunks:

        section = item["section"]
        text = item["text"]

        grouped.setdefault(section, []).append(text)

    return grouped


# ==============================
# SELECT BEST 1 CHUNK PER SECTION
# ==============================
def select_best_chunk(chunks):

    if not chunks:
        return ""

    # remove very small noise chunks
    valid = [c for c in chunks if len(c.split()) > 20]

    if not valid:
        return chunks[0]

    # strategy 1: middle chunk (usually most informative)
    return valid[len(valid) // 2]


# ==============================
# PROMPT BUILDER
# ==============================
def build_prompt(section_name, chunk_text):

    return f"""
You are an expert research paper assistant.

You are analyzing ONLY the "{section_name}" section.

[CRITICAL SELECTION CONSTRAINT]
When extracting "Method/Concept", distinguish between "Traditional/Prior Work" referenced by the authors and the "Proposed Method" designed by the authors. 
- DO NOT list background algorithms (e.g., SVM, PCA, HMM, traditional GAN math) if the text introduces them as baseline comparisons or historical context.
- DO focus exclusively on what the authors explicitly declare as "proposed", "our framework", "in this paper", or "our module".

IMPORTANT RULES:
- Do NOT use outside knowledge
- Do NOT hallucinate
- Stay strictly within the text

TASK:
Generate a structured technical summary.

FOCUS:
- Key idea
- Method / concept
- Important findings
- Contribution

SECTION TEXT:
\"\"\"{chunk_text}\"\"\"

OUTPUT:
- Bullet points only
"""


# ==============================
# LLM CALL
# ==============================
def summarize_section(section, chunk):

    prompt = build_prompt(section, chunk)
    return generate_response(prompt)


# ==============================
# MAIN PROCESSOR
# ==============================
def process_all_sections(section_chunks):

    final_output = {}

    for section, chunks in section_chunks.items():

        print(f"\nProcessing: {section}")

        best_chunk = select_best_chunk(chunks)

        print("  → Selected best chunk")

        summary = summarize_section(section, best_chunk)

        final_output[section] = summary

    return final_output


# ==============================
# SAVE RESULT
# ==============================
def save_summary(result, filename="summary.txt"):

    with open(filename, "w", encoding="utf-8") as f:

        for sec, text in result.items():

            f.write("\n" + "=" * 60 + "\n")
            f.write(sec.upper() + "\n")
            f.write("=" * 60 + "\n\n")
            f.write(text + "\n")


# ==============================
# PIPELINE
# ==============================
def summarize_paper(file_path):

    print("Loading chunks...")

    section_chunks = load_chunks(file_path)

    print("\nSelecting best chunks + summarizing...")

    result = process_all_sections(section_chunks)

    print("\nSaving output...")

    save_summary(result)

    return result


# ==============================
# RUN
# ==============================
if __name__ == "__main__":

    final_summary = summarize_paper("paper_text.txt")

    print("\n===== FINAL SUMMARY =====\n")

    for k, v in final_summary.items():
        print(f"\n{k.upper()}\n{v}\n")