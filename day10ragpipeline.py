#from sentence_transformers import SentenceTransformer
import chromadb
from model import generate_response
import numpy as np
import time
#from embedding_model import get_embedding_model
from embeddings_api import get_embeddings

# ==================================================
# EMBEDDING MODEL
# ==================================================
#embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# ==================================================
# LOAD COLLECTION
# ==================================================
def load_collection():
    client = chromadb.PersistentClient(path="chroma_db")
    return client.get_collection(name="research_papers")


# ==================================================
# QUERY ENHANCEMENT
# ==================================================
def enhance_query(query: str) -> str:
    return (
        f"{query}. "
        f"Focus on abstract, methodology, experiments, and key contributions."
    )


# ==================================================
# EMBED TEXT → VECTOR
# ==================================================
#def embed(text: str) -> np.ndarray:
#    model = get_embedding_model()
#    return model.encode(text)
def embed(text: str) -> np.ndarray:

    embedding = get_embeddings([text])[0]

    return np.array(embedding, dtype=np.float32)

# ==================================================
# RETRIEVE TOP-K CHUNKS
# ==================================================
def retrieve(collection, query_emb: np.ndarray, paper_id: str, k: int = 15) -> list:

    results = collection.query(
        query_embeddings=[query_emb.tolist()],
        n_results=k,
        where={
            "paper_id": paper_id
        },
        include=["documents", "metadatas"]
    )

    return list(zip(results["documents"][0], results["metadatas"][0]))



def classify_question(question: str) -> str:
    q = question.lower()

    if any(x in q for x in ["title", "author", "keyword", "keywords"]):
        return "metadata"

    if any(x in q for x in ["what is", "define", "explain"]):
        return "definition"

    if any(x in q for x in ["how", "method", "architecture", "pipeline"]):
        return "methodology"

    if any(x in q for x in ["result", "accuracy", "performance", "experiment"]):
        return "results"

    return "general"


SECTION_BOOST = {
    "definition": {
        "abstract": 0.12,
        "introduction": 0.10
    },

    "methodology": {
        "methodology": 0.15,
        "methods": 0.15
    },

    "results": {
        "results": 0.15,
        "experiment": 0.10,
        "conclusion": 0.05
    },

    "metadata": {
        "metadata": 1.0
    }
}

def rerank(question_emb: np.ndarray, chunks: list, question: str) -> list:

    q_type = classify_question(question)
    boosts = SECTION_BOOST.get(q_type, {})

    scored = []

    for doc, meta in chunks:

        doc_emb = np.array(
            get_embeddings([doc])[0],
            dtype=np.float32
        )

        cosine_sim = float(
            np.dot(question_emb, doc_emb)
            /
            (
                np.linalg.norm(question_emb)
                *
                np.linalg.norm(doc_emb)
                + 1e-8
            )
        )

        section = meta.get("section", "").lower()

        boost = 0.0

        for key, value in boosts.items():

            if key in section:
                boost = value
                break

        cosine_sim += boost

        scored.append(
            (
                cosine_sim,
                doc,
                meta
            )
        )

    scored.sort(
        reverse=True,
        key=lambda x: x[0]
    )

    return [
        (doc, meta)
        for _, doc, meta in scored
    ]


# ==================================================
# DIVERSIFY
# ==================================================
def diversify(chunks, k=5):

    selected = []
    seen_sections = set()

    priority = ["abstract", "introduction", "methodology", "results"]

    for sec in priority:
        for doc, meta in chunks:
            if meta.get("section","").lower() == sec:
                selected.append((doc, meta))
                seen_sections.add(sec)
                break

    for doc, meta in chunks:
        if len(selected) >= k:
            break
        if meta.get("section","") not in seen_sections:
            selected.append((doc, meta))

    return selected


# ==================================================
# INJECT ANCHOR CHUNKS
# ==================================================
def inject_anchor_chunks(collection, question: str, ranked: list, paper_id: str) -> list:

    q_lower = question.lower()

    is_definition_question = any(kw in q_lower for kw in [
        "what is", "what are", "define", "explain", "describe",
        "what does", "tell me about", "overview"
    ])

    if not is_definition_question:
        return ranked

    anchor_emb = embed(question)
    broad      = retrieve(collection, anchor_emb, paper_id, k=30)

    anchors = [
        (doc, meta) for doc, meta in broad
        if meta.get("section", "") in ("abstract", "methodology")
    ]

    seen_docs = set()
    merged    = []

    for doc, meta in anchors + ranked:
        key = doc[:80]
        if key not in seen_docs:
            merged.append((doc, meta))
            seen_docs.add(key)

    return merged


# ==================================================
# RETRIEVAL PIPELINE
# ==================================================
# ==================================================
# RETRIEVAL PIPELINE + TIMING
# ==================================================
def get_chunks(collection, question: str, paper_id: str) -> list:

    enhanced_query = enhance_query(question)
    query_emb = embed(enhanced_query)

    raw_chunks = retrieve(collection, query_emb, paper_id, k=15)
    ranked = rerank(query_emb, raw_chunks, question)
    anchored = inject_anchor_chunks(collection, question, ranked, paper_id)
    final = diversify(anchored, k=6)

    return final
  

# ==================================================
# PROMPT MODES (NEW)
# ==================================================
PROMPT_MODES = {

    "paper": """
You are a STRICT research paper extraction system.

RULES (VERY IMPORTANT):
1. Use ONLY the provided context sentences.
2. You MUST NOT infer, guess, or reconstruct missing details.
3. Do NOT combine steps into a conceptual pipeline unless explicitly written.
4. Do NOT explain beyond what is explicitly stated in the context.
5. Do NOT add background knowledge (no definitions, no expansions).
6. Do NOT paraphrase into new ideas — only rephrase minimally if needed.
7. If information is incomplete, say: "not fully specified in the provided context".
8. Prefer quoting or closely sticking to original phrasing.
9. Never introduce external concepts like "typical CNN", "standard loss", etc.

OUTPUT STYLE:
- Bullet points only if present in context
- Otherwise short factual sentences
- No storytelling, no explanation layers

CONTEXT:
{context_blocks}

QUESTION:
{question}

OUTPUT JSON ONLY

{{
    "response": ""
}}
""",

    "explain": """
You are a helpful AI tutor.

RULES:
1. Use the context as supporting reference, but NOT strictly limited to it.
2. You may use general ML knowledge ONLY to explain concepts already present in the context.
3. Do NOT change, redefine, or expand names, acronyms, or methods from the paper.
4. Explain in a simple and beginner-friendly way (like teaching a 10–15 year old).
5. Do NOT hallucinate paper-specific claims.
6. Use the context as supporting reference, but NOT strictly limited to it.
7. You may use general knowledge freely to explain concepts.
8. Make answers simple, intuitive, and beginner-friendly.
9. If context is incomplete, fill gaps using general understanding.
10. Do not mention limitations of the paper unless asked.

CONTEXT:
{context_blocks}

QUESTION:
{question}

OUTPUT JSON ONLY

{{
    "response": ""
}}
""",

    "hybrid": """
You are a research assistant.

RULES:
1. Prioritize the provided paper context.
2. Use general knowledge ONLY to simplify explanation.
3. Stick strictly to paper facts for methodology/results.
4. If uncertain, clearly say so instead of guessing.
5. Give a clear and simple explanation.
6. Use a clear, pedagogical, and easy-to-understand tone. Break down complex math or concepts using analogies where helpful.
7. Rely strictly on the retrieved document text for all specific parameters, constants, data points, and architectural details.
8. If a specific technical term or acronym is mentioned in the prompt but its definition is missing from the retrieved chunks, you may use external knowledge to define the concept conceptually, but you must add a disclaimer stating: "(Note: This specific background definition was supplemented using general domain knowledge, as it was not explicitly detailed in the text)."
9. If a specific experiment value, table metric, or equation parameter requested is entirely missing from the chunks, state exactly what is missing instead of guessing the numerical values.

CONTEXT:
{context_blocks}

QUESTION:
{question}

OUTPUT JSON ONLY

{{
    "response": ""
}}
"""
}
# ==================================================
# PROMPT BUILDER (UPDATED)
# ==================================================
#def build_prompt(question: str, chunks: list, mode: str = "hybrid") -> str:

 #   context_blocks = ""
 #   for doc, meta in chunks:
#        section_label = meta.get("section", "unknown").upper()
#        context_blocks += f"\n[{section_label}]\n{doc}\n"

#    template = PROMPT_MODES.get(mode, PROMPT_MODES["hybrid"])

#    return template.format(
#        context_blocks=context_blocks,
#        question=question
#    )


def build_prompt(question, chunks, mode):

    context = "\n".join([c[0] for c in chunks])

    if mode == "paper":
        instruction = "Give a concise exam-ready answer in bullet points."

    elif mode == "explain":
        instruction = "Explain in deep conceptual detail with examples."

    else:  # hybrid
        instruction = "Give balanced answer: short + explanation."

    return f"""
Mode: {mode}

Instruction: {instruction}

Context:
{context}

Question:
{question}
"""


# ==================================================
# ANSWER
# ==================================================
def answer(question: str, collection, paper_id: str, mode: str = "hybrid") -> str:

    start = time.time()

    chunks = get_chunks(collection, question, paper_id)
    prompt = build_prompt(question, chunks, mode)

    response = generate_response(prompt)

    response_json = response_to_json(response)

    end = time.time()

    print("\n" + "=" * 60)
    print("  ANSWER")
    print("=" * 60)

    print(
        json.dumps(
            response_json,
            indent=4,
            ensure_ascii=False
        )
    )

    print("\n" + "=" * 60)
    print(f"⚡ TOTAL RESPONSE TIME: {end - start:.2f} sec")
    print("=" * 60 + "\n")

    return response_json




# ==================================================
# DEBUG CHUNKS
# ==================================================
def show_chunks(collection, question: str, paper_id: str) -> None:

    chunks = get_chunks(collection, question, paper_id)

    print("\n" + "=" * 60)
    print("  RETRIEVED CONTEXT CHUNKS")
    print("=" * 60)

    for i, (doc, meta) in enumerate(chunks, 1):
        print(f"\n  [{i}] Section: {meta.get('section', 'unknown').upper()}")
        print("  " + "─" * 56)
        print(f"  {doc[:500]}")

    print()



import json
import re

def response_to_json(response):

    response = response.strip()

    try:
        return json.loads(response)

    except:

        return {
            "response": response
        }


# ==================================================
# INTERACTIVE LOOP (UPDATED)
# ==================================================
def start_rag():

    collection = load_collection()
    paper_id = input("Paper ID: ").strip()

    mode = "hybrid"

    print("\n" + "=" * 60)
    print("  RAG SYSTEM READY")
    print("  Current Mode: HYBRID")
    print("  Type /paper /explain /hybrid to change mode")
    print("  Type exit to quit")
    print("=" * 60 + "\n")

    while True:

        question = input(
            f"[{mode.upper()}] Question: "
        ).strip()

        if not question:
            continue

        if question.lower() == "exit":
            break

        if question.lower() == "/paper":
            mode = "paper"
            print("Switched to PAPER mode")
            continue

        if question.lower() == "/explain":
            mode = "explain"
            print("Switched to EXPLAIN mode")
            continue

        if question.lower() == "/hybrid":
            mode = "hybrid"
            print("Switched to HYBRID mode")
            continue

        show_chunks(collection, question, paper_id)

        answer(
            question,
            collection,
            paper_id,
            mode
        )

# ==================================================
# MAIN
# ==================================================
if __name__ == "__main__":
    start_rag()

