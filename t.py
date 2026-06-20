import chromadb

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_collection(
    name="research_papers"
)

print(
    "Total Chunks:",
    collection.count()
)