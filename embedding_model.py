from sentence_transformers import SentenceTransformer

_model = None


def get_embedding_model():
    global _model

    if _model is None:
        print("Loading embedding model...", flush=True)
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        print("after model load", flush=True)
    return _model