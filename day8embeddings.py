#from sentence_transformers import SentenceTransformer
from day4textchunk import process_chunks
import numpy as np
from embedding_model import get_embedding_model


# ==================================================
# EMBEDDING MODEL
# SentenceTransformer encodes text into dense vectors
# (numerical representations that capture semantic
# meaning). "all-MiniLM-L6-v2" is compact yet accurate.
# Dense vector = fixed-length array of floats.
# ==================================================
#model = SentenceTransformer("all-MiniLM-L6-v2")


# ==================================================
# LOAD CHUNKS
# ==================================================
def load_chunks(file_path: str) -> list:
    return process_chunks(file_path)


# ==================================================
# NORMALIZE EMBEDDINGS
# Scales a vector to unit length (magnitude = 1).
# This makes cosine similarity equivalent to dot product,
# which is faster and numerically more stable.
# Unit length = the vector's magnitude equals exactly 1.
# ==================================================
def normalize(vec: np.ndarray) -> list:
    vec = np.array(vec, dtype=np.float32)
    norm = np.linalg.norm(vec)
    if norm == 0:
        return vec.tolist()
    return (vec / norm).tolist()


# ==================================================
# BATCH EMBEDDING
# Encodes all chunk texts in one batched call —
# significantly faster than encoding one-by-one.
# Batched = processed in grouped blocks, not serially.
# ==================================================
def generate_chunk_embeddings(section_chunks: list) -> list:

    all_texts = [item["text"]    for item in section_chunks]
    sections  = [item["section"] for item in section_chunks]

    print(f"\n  Total chunks to embed: {len(all_texts)}")

    model = get_embedding_model()

    embeddings = model.encode(
        all_texts,
        batch_size=32,
        show_progress_bar=True,
        convert_to_numpy=True
    )

    results = []

    for text, emb, section in zip(all_texts, embeddings, sections):
        results.append({
            "section":   section,
            "chunk":     text,
            "embedding": normalize(emb)
        })

    return results


# ==================================================
# PIPELINE
# Orchestrates chunk loading → embedding generation.
# Returns a list of dicts ready for ChromaDB ingestion.
# Ingestion = the process of loading data into a store.
# ==================================================
def build_embeddings(file_path: str) -> list:

    print("  Loading chunks...")
    section_chunks = load_chunks(file_path)

    print("\n  Generating embeddings...")
    embeddings = generate_chunk_embeddings(section_chunks)

    print(f"\n  ✅ Embeddings ready — {len(embeddings)} vectors generated")
    return embeddings


# ==================================================
# MAIN/
# ==================================================
if __name__ == "__main__":

    data = build_embeddings("paper_text.txt")

    print(f"\n  Total embedded chunks : {len(data)}")
    print(f"  Embedding dimension   : {len(data[0]['embedding'])}")
    print(f"  Sample section        : {data[0]['section']}")