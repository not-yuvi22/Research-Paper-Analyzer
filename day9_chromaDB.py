import chromadb
from day8_embeddings import build_embeddings


# ==================================================
# CHROMA CLIENT
# PersistentClient stores vectors on disk so they
# survive between sessions — unlike an in-memory store.
# Persistent = data is retained after the program exits.
# ==================================================
def get_client(path: str = "chroma_db") -> chromadb.PersistentClient:
    return chromadb.PersistentClient(path=path)


# ==================================================
# GET OR CREATE COLLECTION
# A collection is ChromaDB's equivalent of a table —
# it groups related embeddings under a single namespace.
# ==================================================
def get_or_create_collection(client, name: str = "research_papers"):
    return client.get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"}   # use cosine distance for similarity
    )


# ==================================================
# STORE EMBEDDINGS
# Upserts chunk vectors into ChromaDB.
# Upsert = insert if new, update if already exists —
# prevents duplicate entries on repeated runs.
# ==================================================
def store_embeddings(collection, embedded_data: list) -> None:

    ids         = []
    embeddings  = []
    documents   = []
    metadatas   = []

    for i, item in enumerate(embedded_data):
        ids.append(f"chunk_{i:05d}")
        embeddings.append(item["embedding"])
        documents.append(item["chunk"])
        metadatas.append({"section": item["section"]})

    collection.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas
    )

    print(f"\n  ✅ Stored {len(ids)} chunks in collection '{collection.name}'")


# ==================================================
# PIPELINE
# End-to-end function: builds embeddings from a file
# and persists them into ChromaDB in one call.
# ==================================================
def build_and_store(file_path: str) -> None:

    print("=" * 55)
    print("  CHROMA INGESTION PIPELINE")
    print("=" * 55)

    client = get_client()

    # ==================================================
    # DELETE OLD COLLECTION (NEW)
    # ==================================================
    try:
        client.delete_collection("research_papers")
        print("\n  Old collection deleted")
    except:
        pass

    collection = get_or_create_collection(client)

    embedded_data = build_embeddings(file_path)
    store_embeddings(collection, embedded_data)

    count = collection.count()

    print(f"\n  Collection count : {count} vectors")
    print("  ChromaDB path    : ./chroma_db")
    print("=" * 55)

# ==================================================
# MAIN
# ==================================================
if __name__ == "__main__":
    build_and_store("paper_text.txt")  