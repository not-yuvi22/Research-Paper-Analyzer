import re


# ==================================================
# LOAD TEXT
# Reads raw file content from disk into memory.
# ==================================================
def load_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


# ==================================================
# BASIC CLEANING
# Strips noise artifacts common in PDF-extracted text:
# URLs, DOIs, broken hyphenations, redundant whitespace.
# ==================================================
def clean_text(text: str) -> str:

    text = re.sub(r"https?://\S+|www\.\S+", " ", text)           # remove URLs
    text = re.sub(r"doi:\s*\S+", " ", text, flags=re.I)           # remove DOI references
    text = re.sub(r"\d+\s+of\s+\d+", " ", text)                   # remove "page X of Y" noise
    text = re.sub(r"(\w)-\s+(\w)", r"\1\2", text)                 # fix broken hyphenated words
    

    # ===== CHANGED: preserve important research-paper symbols =====
    text = text.replace("×", "x")                                # CHANGED
    text = text.replace("–", "-")                                # CHANGED
    text = text.replace("—", "-")                                # CHANGED

    text = re.sub(r"\s+", " ", text)                             # collapse multiple spaces

    return text.strip()


# ==================================================
# SECTION DETECTION
# Uses regex heuristics to locate logical sections
# (abstract, introduction, etc.) by keyword position.
# Heuristic = rule of thumb, not exact science.
#
# KEY DESIGN DECISIONS:
# 1. We search on text_lower for case-insensitive matching,
#    but slice from the ORIGINAL text to preserve casing.
# 2. We strip ONLY the first occurrence of the heading word
#    (the heading line itself), NOT every occurrence —
#    words like "method" appear throughout the body and
#    must NOT be removed. This was the original bug.
# ==================================================
def extract_sections(text: str) -> dict:

    text_lower = text.lower()

    # --------------------------------------------------
    # HEADING PATTERNS
    # Each pattern is anchored to look like a real section
    # heading — optionally preceded by a section number
    # (e.g. "3.", "4.1") and followed by little/no text
    # before a newline or end of "line".
    #
    # WHY: words like "experiments" or "evaluation" appear
    # constantly in body text. We must match them only when
    # they appear as a standalone heading, not mid-sentence.
    # Anchored = constrained to a specific position/context.
    # --------------------------------------------------
    heading_patterns = {
        "abstract":     r"(?:^|\s)(?:\d+[\.\d]*\s+)?abstract(?:\s|$)",
        "introduction": r"(?:^|\s)(?:\d+[\.\d]*\s+)?introduction(?:\s|$)",
        "methodology": r"(?:^|\s)(?:\d+[\.\d]*\s+)?(?:methodology|methods|materials and methods|experimental setup|proposed method|approach)(?:\s|$)",
        "results":      r"(?:^|\s)(?:\d+[\.\d]*\s+)?(?:results|experiments|experimental results|evaluation)(?:\s|$)",
        "conclusion":   r"(?:^|\s)(?:\d+[\.\d]*\s+)?(?:conclusion|conclusions|concluding remarks)(?:\s|$)"
    }

    # find the BEST (most heading-like) match for each section
    positions = []

    for sec, pattern in heading_patterns.items():

        # finditer gives ALL matches — we pick the one most
        # likely to be a heading (shortest surrounding context)
        matches = list(re.finditer(pattern, text_lower, re.I | re.MULTILINE))

        if not matches:
            continue

        # prefer later matches — headings appear after the abstract/intro
        # mentions of those words, except for abstract itself
        best = matches[0] if sec == "abstract" else matches[-1]

        # for results/methodology, skip if the match is in the first 15%
        # of the document (likely an inline mention in intro/abstract)
        doc_len   = len(text_lower)
        match_pos = best.start()

        if sec in ("results", "methodology") and match_pos < doc_len * 0.15:
            # try to find a later match past the 15% threshold
            later = [m for m in matches if m.start() > doc_len * 0.15]
            if later:
                best = later[0]
            else:
                continue  # no valid heading found — skip this section

        positions.append((sec, best.start(), best.end()))

    positions.sort(key=lambda x: x[1])

    sections = {k: "" for k in heading_patterns}

    for i, (sec, start, heading_end) in enumerate(positions):

        body_start = heading_end
        body_end   = positions[i + 1][1] if i + 1 < len(positions) else len(text)

        chunk = text[body_start:body_end].strip()

        if len(chunk.split()) > 30:
            sections[sec] = chunk

    # fallback: if abstract not detected, use the opening 200 words
    if not sections["abstract"]:
        sections["abstract"] = " ".join(text.split()[:200])

    return sections


# ==================================================
# PIPELINE
# Orchestrates loading → cleaning → sectioning.
# Orchestrate = coordinate multiple steps in sequence.
# ==================================================
def process_paper(file_path: str) -> dict:

    raw      = load_text(file_path)
    cleaned  = clean_text(raw)
    sections = extract_sections(cleaned)

    return {
        "cleaned":  cleaned,
        "sections": sections
    }


# ==================================================
# MAIN — FOR LOCAL TESTING
# ==================================================
if __name__ == "__main__":

    data = process_paper("paper_text.txt")

    for section_name, content in data["sections"].items():
        print(f"\n{'─' * 50}")
        print(f"  SECTION: {section_name.upper()}")
        print(f"{'─' * 50}")
        print(content[:400])
