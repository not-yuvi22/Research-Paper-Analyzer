import re
from day3_text_preprocessing import process_paper


# ==================================================
# CLEAN TEXT
# Secondary cleaning pass specifically for OCR noise.
# OCR = Optical Character Recognition (text from scans).
# ==================================================
def clean_text(text: str) -> str:

    text = re.sub(r"\s+",   " ",  text)   # collapse whitespace
    text = re.sub(r"(\w)-\s+(\w)", r"\1\2", text)
    text = re.sub(r"\s{2,}", " ", text)   # final whitespace pass

    return text.strip()


# ==================================================
# SENTENCE SPLITTER
# Splits text into sentences, then filters out
# degenerate fragments — too short, broken citations,
# or orphaned clause stubs from PDF extraction.
# Degenerate = malformed / structurally incomplete.
# ==================================================
def split_sentences(text: str) -> list:

    text = clean_text(text)

    raw_sentences = re.split(r'(?<=[.!?])\s+', text)

    cleaned = []

    for s in raw_sentences:

        s = s.strip()

        if len(s) < 25:            continue  # too short to carry meaning
        if len(s.split()) < 5:    continue  # fewer than 5 words = fragment

        # drop empty citation artifacts like "( ) propose"
        if re.match(r"^\(\s*\)\s*",     s): continue
        if re.match(r"^\(\s*\d*\s*\)\s*", s): continue

        # CHANGED: remove tiny citation fragments
        if re.search(r"\[\d+\]", s) and len(s.split()) < 15:
            continue
        # Add this inside your split_sentences loop:
        # Drops lines that contain typical citation volume/year formatting
        if re.search(r"\b(19|20)\d{2}\b", s) and ("vol." in s or "pp." in s or "Conference on" in s):
            continue

        cleaned.append(s)

    # --------------------------------------------------
    # MERGE BROKEN FRAGMENTS
    # If a sentence starts lowercase and is very short,
    # it is likely a continuation of the previous one.
    # --------------------------------------------------
    fixed = []

    for i, s in enumerate(cleaned):

        is_continuation = (
            i > 0
            and len(s.split()) < 8
            and s[0].islower()
        )

        if is_continuation:
            fixed[-1] = fixed[-1] + " " + s
        else:
            fixed.append(s)

    return fixed


# ==================================================
# WORD COUNT — simple utility
# ==================================================
def word_count(text: str) -> int:
    return len(text.split())


# ==================================================
# ADAPTIVE CHUNKING
# Groups sentences into chunks bounded by max_words.
# overlap=N retains the last N sentences from a chunk
# into the next — preserving cross-boundary context.
# Adaptive = adjusts behaviour based on input size.
# ==================================================
def chunk_text(sentences: list, max_words: int = 170, overlap: int = 2) -> list:

    chunks  = []
    current = []
    count   = 0

    for sent in sentences:

        w = word_count(sent)

        if count + w > max_words and current:

            chunks.append(" ".join(current))

            # carry over the last `overlap` sentences for context continuity
            current = current[-overlap:]
            count   = word_count(" ".join(current))

        current.append(sent)
        count += w

    if current:
        chunks.append(" ".join(current))

    return chunks


# ==================================================
# UNIVERSAL PIPELINE
# Processes all sections and returns a flat list of
# annotated chunks (each tagged with its section name).
# Annotated = labelled with metadata.
# ==================================================
def process_chunks(file_path: str) -> list:

    data     = process_paper(file_path)
    sections = data["sections"]

    all_chunks = []

    for sec, text in sections.items():

        if not text or len(text.strip()) < 60:
            continue

        sentences = split_sentences(text)
        word_len  = len(text.split())

        # scale chunk size to section density
        if   word_len < 200: max_words = 140
        elif word_len < 600: max_words = 170
        else:                max_words = 200

        chunks = chunk_text(sentences, max_words=max_words, overlap=1)

        for ch in chunks:
            all_chunks.append({
                "section": sec,
                "text":    ch
            })

    return all_chunks


# ==================================================
# SAVE CHUNKS — writes chunks to disk for inspection
# ==================================================
def save_chunks(all_chunks: list, filename: str = "paper_chunks.txt") -> None:

    with open(filename, "w", encoding="utf-8") as f:

        for i, item in enumerate(all_chunks):

            f.write("\n" + "=" * 60 + "\n")
            f.write(f"CHUNK {i + 1:03d} | SECTION: {item['section'].upper()}\n")
            f.write("=" * 60 + "\n\n")
            f.write(item["text"] + "\n")

    print(f"\n✅ Saved {len(all_chunks)} chunks → {filename}")


# ==================================================
# QUALITY REPORT
# Diagnostic tool to flag undersized or oversized
# chunks before they pollute the embedding store.
# Diagnostic = used for analysis/debugging.
# ==================================================
def test_chunk_quality(all_chunks: list) -> None:

    print("\n" + "=" * 60)
    print("  CHUNK QUALITY REPORT")
    print("=" * 60)

    total   = len(all_chunks)
    avg_len = sum(len(c["text"].split()) for c in all_chunks) / total

    print(f"  Total chunks   : {total}")
    print(f"  Avg words/chunk: {avg_len:.2f}")
    print("=" * 60)

    print("\n  SAMPLE (first 5 chunks)\n")

    for i, c in enumerate(all_chunks[:5]):

        text  = c["text"]
        words = len(text.split())

        print(f"  CHUNK {i + 1:02d}")
        print(f"  Section : {c['section']}")
        print(f"  Words   : {words}  ", end="")

        if   words < 40:  print("⚠️  TOO SMALL — likely a fragment")
        elif words > 250: print("⚠️  TOO LARGE — may introduce noise")
        else:             print("✅  ACCEPTABLE SIZE")

        print(f"  Preview : {text[:300]}")
        print()


# ==================================================
# MAIN
# ==================================================
if __name__ == "__main__":

    all_chunks = process_chunks("paper_text.txt")

    save_chunks(all_chunks)
    test_chunk_quality(all_chunks)
