#  Research Paper Analyzer & Simplifier

An AI-powered web application that enables users to analyze research papers through intelligent summarization, Retrieval-Augmented Generation (RAG) based conversations, and interactive mind map visualization. The platform combines modern Large Language Models (LLMs), semantic search, and vector databases to provide a faster and more intuitive way of understanding academic literature.

---

#  Features

*  PDF Upload & Processing
*  Automatic Text Extraction
*  Intelligent Text Chunking
*  Semantic Embedding Generation using **Jina AI Embeddings**
*  ChromaDB Vector Database Integration
*  Retrieval-Augmented Generation (RAG) Chat
*  AI-Powered Structured Research Paper Summarization
*  Interactive Mind Map Generation
*  Multiple Chat Modes

  * Paper Mode
  * Hybrid Mode
  * Explain Mode
*  Multi-user Support using Unique Paper IDs
*  REST API built with FastAPI
*  Deployed Backend on Render

---

#  Tech Stack

## Backend

* Python
* FastAPI
* ChromaDB
* Jina AI Embeddings API
* Groq LLM API
* PyMuPDF (fitz)
* NumPy

## Frontend

* React
* React Flow
* Axios

## Deployment

* Render

---

#  Project Workflow

```text
PDF Upload
      │
      ▼
Text Extraction
      │
      ▼
Text Preprocessing
      │
      ▼
Chunk Generation
      │
      ▼
Jina AI Embeddings
      │
      ▼
ChromaDB Vector Storage
      │
      ▼
Retrieval-Augmented Generation (RAG)
      │
      ▼
AI Features
 ├── Summary
 ├── Chat
 └── Mind Map
```

---

#  API Endpoints

### Upload Research Paper

```http
POST /upload-paper
```

Returns:

* `paper_id`

---

### Generate Summary

```http
GET /paper/{paper_id}/summary
```

Returns a structured AI-generated summary of the uploaded research paper.

---

### AI Chat

```http
POST /chat
```

Supported Modes:

* `paper`
* `hybrid`
* `explain`

Returns context-aware answers using Retrieval-Augmented Generation.

---

### Mind Map

```http
POST /mindmap
```

Returns a hierarchical JSON structure compatible with React Flow for visualizing the paper.

---

### Health Check

```http
GET /health
```

Returns the backend service status.

---

#  Project Structure

```text
project/
│
├── main.py
├── model.py
├── mindmaps_final.py
├── day3textprepro.py
├── day4textchunk.py
├── day8embeddings.py
├── day9chroma.py
├── day10ragpipeline.py
├── day11_chat_final.py
├── requirements.txt
├── README.md
├── .env.example
└── ...
```

---

#  Future Improvements

* User Authentication
* Persistent Chat History
* Session Management
* User Dashboard
* Paper Comparison
* Citation Generator
* Research Paper Annotation
* Cloud Storage Integration
* Performance Optimization for Large Papers

---

#  Authors

### Satyam Kumar Yadav

**Frontend Developer & UI/UX**

* Developed frontend components
* Improved application responsiveness and user experience
* Assisted with feature integration, testing, and UI refinement

### Yuvaraj Mishra

**Backend Developer**

* Designed and developed the FastAPI backend
* Implemented the complete RAG pipeline
* Integrated Jina AI Embeddings, ChromaDB, and Groq APIs
* Developed AI Summary, Chat, and Mind Map generation modules
* Managed backend deployment and API integration

### Pushkar Kumar Pandey

**Frontend Developer**

* Designed and developed the React user interface
* Integrated backend APIs
* Built the chat interface and summary pages
* Implemented interactive mind map visualization using React Flow

---

#  License

This project is licensed under the MIT License.
