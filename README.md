# 📄 Research Paper Analyzer & Simplifier

An AI-powered research paper analysis platform that enables users to upload research papers, generate structured summaries, ask questions using Retrieval-Augmented Generation (RAG), and visualize the paper as an interactive mind map.

---

## Features

- PDF Upload and Processing
- Automatic Text Extraction
- Intelligent Text Chunking
- Semantic Embedding Generation
- ChromaDB Vector Database
- Retrieval-Augmented Generation (RAG)
- AI Chat with Research Papers
- Multiple Chat Modes
  - Paper Mode
  - Hybrid Mode
  - Explain Mode
- Section-wise Summarization
- Interactive Mind Map Generation
- Multi-user Support using Unique Paper IDs

---

## Tech Stack

### Backend

- FastAPI
- Python
- ChromaDB
- Sentence Transformers
- Groq LLM API
- NumPy

### Frontend

- React
- React Flow

---

## Project Workflow

PDF Upload

↓

Text Extraction

↓

Chunking

↓

Embedding Generation

↓

ChromaDB Storage

↓

AI Features

- Summary
- Chat
- Mind Map

---

## API Endpoints

### Upload Paper

POST

```
/upload-paper
```

Returns

- paper_id

---

### Summary

GET

```
/paper/{paper_id}/summary
```

---

### Chat

POST

```
/chat
```

Modes

- paper
- hybrid
- explain

---

### Mind Map

POST

```
/mindmap
```

Returns a hierarchical JSON structure compatible with React Flow.

---

## Folder Structure

```
project/
│
├── main.py
├── model.py
├── mindmaps_final.py
├── day9chroma.py
├── day10ragpipeline.py
├── requirements.txt
├── .gitignore
├── README.md
└── ...
```

---

## Future Improvements

- User Authentication
- Chat History
- Session Management
- Paper Dashboard
- Persistent Cloud Storage
- Citation Generator
- Review & Annotation System

---

## Authors

Backend Developer

- Yuvaraj

Frontend

- Team Project

---

## License

This project is developed for educational and research purposes.