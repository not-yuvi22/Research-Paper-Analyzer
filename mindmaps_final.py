import json

from model import generate_response
from day10ragpipeline import load_collection
from model import safe_json_parse


def get_all_chunks(collection, paper_id):
    """
    Retrieve all chunks belonging to a specific paper
    and return them in their original order.
    """

    results = collection.get(
        where={"paper_id": paper_id},
        include=["documents", "metadatas"]
    )

    documents = results.get("documents", [])
    metadatas = results.get("metadatas", [])

    chunks = list(zip(documents, metadatas))

    chunks.sort(
        key=lambda x: x[1].get("chunk_index", 0)
    )

    return chunks



def build_context(chunks):
    """
    Convert ordered paper chunks into one large
    context string for the LLM.
    """

    context = ""

    for doc, meta in chunks:

        section = meta.get("section", "unknown").upper()

        context += (
            f"\n{'=' * 50}\n"
            f"SECTION: {section}\n"
            f"{'=' * 50}\n\n"
            f"{doc.strip()}\n"
        )

    return context.strip()



def build_mindmap_prompt(context):
    """
    Build the prompt for generating a hierarchical
    mind map from the research paper.
    """

    return f"""
You are an expert research paper analyst and knowledge organizer.

Your task is to read the following research paper and create a hierarchical
mind map representing the paper's important ideas.

==================================================
RULES
==================================================

1. The root node MUST be the paper title.

2. Organize the paper into meaningful high-level categories such as:
   - Introduction
   - Problem Statement
   - Methodology
   - Architecture
   - Dataset
   - Experiments
   - Results
   - Discussion
   - Conclusion
   - Future Work

3. Create additional category names whenever appropriate.

4. Under each category, include the important concepts,
   algorithms, datasets, models, equations, techniques,
   evaluation metrics and findings.

5. Every node name should be SHORT.
   Prefer noun phrases instead of sentences.

6. Maximum hierarchy depth = 4.

7. Do NOT invent information that is not present
   in the paper.

8. Output MUST be VALID JSON ONLY.

9. Do NOT use markdown.

10. Use EXACTLY this structure:

{{
  "name": "Paper Title",
  "type": "root",
  "children": [
    {{
      "name": "Introduction",
      "type": "section",
      "children": [
        {{
          "name": "Transformer",
          "type": "concept"
        }}
      ]
    }}
  ]
}}

11. Every node must contain:
    name
    type

==================================================
RESEARCH PAPER
==================================================

{context}

"""



def generate_mindmap(collection, paper_id):
    """
    Generate a React Flow compatible mind map
    for the given paper.
    """

    print("=" * 60)
    print("GENERATING MIND MAP")
    print("=" * 60)

    # 1: Retrieving all chunks
    chunks = get_all_chunks(collection, paper_id)

    if not chunks:
        raise ValueError(f"No chunks found for paper_id: {paper_id}")

    print(f"Retrieved {len(chunks)} chunks.")

    # 2: Building paper context
    context = build_context(chunks)

    # 3: Building prompt
    prompt = build_mindmap_prompt(context)

    print("Generating hierarchy using LLM...")

    # 4: Calling the LLM
    response = generate_response(prompt)

 #   print("\n========== RAW LLM RESPONSE ==========\n")
  #  print(response)
 #   print("\n======================================\n")

    # Step 5: Parse JSON
    
    hierarchy = safe_json_parse(response)

#    print("\n========== PARSED JSON ==========\n")
 #   print(hierarchy)
#   print("\n=================================\n")

#    print("\nValidation Result:", validate_tree(hierarchy))

    if not validate_tree(hierarchy):
#        raise ValueError("Invalid hierarchy returned by LLM.")
        raise ValueError(
            f"Invalid hierarchy returned.\n\nParsed object:\n{hierarchy}"
        )


    print("Hierarchy generated successfully.")


    print("React Flow JSON generated.")

    print("=" * 60)

    response = format_mindmap_response(
        paper_id,
        hierarchy
    )

    return response



def format_mindmap_response(paper_id, tree):

    return {
        "paperId": paper_id,
        "title": tree["name"],
        "mindMap": tree
    }


def validate_tree(node):

    if not isinstance(node, dict):
        return False

    if "name" not in node:
        return False

    if "type" not in node:
        return False

    if "children" in node:

        if not isinstance(node["children"], list):
            return False

        for child in node["children"]:
            if not validate_tree(child):
                return False

    return True
