from day4textchunk import process_chunks
import numpy as np
from embeddings_api import get_embeddings



# LOADING CHUNKS

def load_chunks(file_path: str) -> list:
    return process_chunks(file_path)



# NORMALIZE EMBEDDINGS

def normalize(vec):
    vec = np.array(vec, dtype=np.float32)

    norm = np.linalg.norm(vec)

    if norm == 0:
        return vec.tolist()

    return (vec / norm).tolist()



# GENERATE EMBEDDINGS USING JINA API - USING EXTERNAL API FOR EMBEDDINGS GENERATION SO AS TO MEETS THE MEMORY CONTRAINTS OF RENDER FREE PLAN 

def generate_chunk_embeddings(section_chunks):

    all_texts = [item["text"] for item in section_chunks]
    sections = [item["section"] for item in section_chunks]

    print(f"\nTotal chunks to embed : {len(all_texts)}", flush=True)

    embeddings = get_embeddings(all_texts)

    results = []

    for text, emb, section in zip(
        all_texts,
        embeddings,
        sections
    ):

        results.append({

            "section": section,
            "chunk": text,
            "embedding": normalize(emb)

        })

    return results



# PIPELINE

def build_embeddings(file_path):

    print("Loading chunks...", flush=True)

    section_chunks = load_chunks(file_path)

    print("Generating embeddings using Jina API...", flush=True)

    embeddings = generate_chunk_embeddings(section_chunks)

    print(
        f"Embeddings ready : {len(embeddings)}",
        flush=True
    )

    return embeddings



# MAIN - FOR LOCAL TESTING
if __name__ == "__main__":

    data = build_embeddings("paper_text.txt")

    print(len(data))
