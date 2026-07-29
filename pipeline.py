# day11_chat_final.py

import fitz
import os
import uuid

from day3textprepro import process_paper
from day4textchunk import process_chunks, save_chunks
from day8embeddings import build_embeddings
from day9chroma import (
    get_client,
    get_or_create_collection,
    store_embeddings
)
from day10ragpipeline import start_rag


# ==================================================
# PDF -> TEXT
# ==================================================
# ==================================================
# PDF -> TEXT
# ==================================================
def pdf_to_text(
    pdf_path,
    output_file="paper_text.txt"
):
    pdf = fitz.open(pdf_path)

    text = ""

    for page in pdf:
        text += page.get_text()

    with open(
        output_file,
        "w",
        encoding="utf-8"
    ) as f:
        f.write(text)

    print(f"✅ Text extracted ({len(text)} chars)")

    return output_file


# ==================================================
# COMPLETE PIPELINE
# ==================================================
# ==================================================
# COMPLETE PIPELINE
# ==================================================
def prepare_paper(pdf_path, paper_id):

    os.makedirs("uploads", exist_ok=True)

    print("\n" + "=" * 60)
    print("STEP 1 : PDF READING")
    print("=" * 60)

    txt_file = pdf_to_text(pdf_path, output_file=f"uploads/{paper_id}.txt")

    print("\n" + "=" * 60)
    print("STEP 2 : PREPROCESSING")
    print("=" * 60)

    process_paper(txt_file)

    print("\n" + "=" * 60)
    print("STEP 3 : CHUNKING")
    print("=" * 60)

    chunks = process_chunks(txt_file)

    save_chunks(chunks)

    print("\n" + "=" * 60)
    print("STEP 4 : EMBEDDINGS")
    print("=" * 60)

    print("STEP 4 START", flush=True)
    embedded_data = build_embeddings(txt_file)
    print("STEP 4 FINISHED", flush=True)

    print("\n" + "=" * 60)
    print("STEP 5 : CHROMADB")
    print("=" * 60)

    print("STEP 5 START", flush=True)
    client = get_client()
    print("CLIENT READY", flush=True)

#    try:
#        client.delete_collection(
#            "research_papers"
#        )
#        print("Old collection deleted")
#    except:
#       pass


    collection = get_or_create_collection(
        client
    )
    print("COLLECTION READY", flush=True)

    store_embeddings(
        collection,
        embedded_data,
        paper_id
    )
    print("STORE COMPLETE", flush=True)

    print(
        f"\nStored {collection.count()} chunks"
    )

    return collection



# ==================================================
# BACKEND ENTRY
# ==================================================
def process_uploaded_pdf(pdf_path, paper_id):

    try:

        prepare_paper(pdf_path, paper_id)

        return {
            "status": "ready"
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ==================================================
# CHAT ENTRY
# ==================================================
#def run_chat(
#    pdf_path="SRN_new.pdf"
#):

#    prepare_paper(pdf_path, paper_id)

#    print("\n" + "=" * 60)
#    print("RAG CHAT READY")
 #   print("=" * 60)

  #  start_rag()



def run_chat(pdf_path="SRN_new.pdf"):

    paper_id = str(uuid.uuid4())

    prepare_paper(pdf_path, paper_id)

    print("\n" + "=" * 60)
    print("RAG CHAT READY")
    print("=" * 60)

    start_rag()


# ==================================================
# MAIN
# ==================================================
if __name__ == "__main__":
    run_chat("SRN_new.pdf")

