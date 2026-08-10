# Week 01 Progress Report

## Project Details

| Field              | Details                                                  |
| ------------------ | -------------------------------------------------------- |
| **Project Title**  | **Academix – AI-Powered Academic Knowledge Assistant**   |
| **Student**        | Sajja Venkata Naveen                                     |
| **Semester**       | 5th Semester                                             |
| **Institute**      | IIIT Sri City                                            |
| **Faculty Mentor** | Prasenjit B                                              |
| **Project Domain** | Conversational AI / Retrieval-Augmented Generation (RAG) |
| **Repository**     | Private GitHub Repository                                |

---

## Objective

The objective of Academix is to develop an AI-powered academic knowledge assistant that helps students retrieve accurate academic information from official college documents such as regulations, lecture notes, previous question papers, timetables, and lab manuals using **Retrieval-Augmented Generation (RAG)**.

---

## Work Completed in Week 01

### 1. Project Finalization

* Discussed project ideas with the faculty mentor.
* Finalized the project title: **Academix – AI-Powered Academic Knowledge Assistant**.
* Identified the target users: **Students, Faculty, and Admin**.
* Defined the core problem: reducing the time spent searching through multiple academic documents.

---

### 2. RAG Fundamentals Studied

Studied the following concepts:

* Retrieval-Augmented Generation (RAG)
* Difference between a normal chatbot and a RAG-based assistant
* Document chunking
* Embeddings and semantic search
* Retriever and LLM interaction
* Importance of grounding responses in official documents

### Key Understanding

* **Retriever** is responsible for fetching relevant document chunks.
* **LLM** is responsible for generating a natural language answer using the retrieved context.
* RAG improves **accuracy and relevance** compared to a generic conversational chatbot.

---

### 3. System Architecture Designed

Designed the high-level architecture containing:

* Frontend (Next.js)
* Backend (NestJS)
* PostgreSQL database
* Vector database for embeddings
* Gemini API for answer generation

Prepared the complete request lifecycle for:

* Faculty document upload flow
* Student question-answer workflow

---

### 4. Backend Modular Architecture Created

Created the backend project structure:

```
backend/
├── src/
│   ├── auth/
│   ├── users/
│   ├── documents/
│   ├── chat/
│   ├── rag/
│   ├── prisma/
│   └── common/
├── uploads/
├── package.json
└── tsconfig.json
```

### Purpose of Modules

| Module      | Responsibility                   |
| ----------- | -------------------------------- |
| `auth`      | Authentication and JWT           |
| `users`     | User and role management         |
| `documents` | PDF upload and metadata handling |
| `chat`      | Student conversations            |
| `rag`       | Chunking and embedding pipeline  |
| `prisma`    | Database access layer            |
| `common`    | Shared utilities and guards      |

---

### 5. Frontend Workflow Planned

Designed role-based user workflows:

#### Student

* Login
* Dashboard
* Ask academic questions
* View chat history
* Access academic resources

#### Faculty

* Login
* Upload documents
* View uploaded files
* Monitor processing status

#### Admin

* Manage users
* Manage documents
* View analytics and system status

---

### 6. GitHub Repository Setup

Completed the following tasks:

* Created a **private GitHub repository**.
* Added `README.md` with project overview, problem statement, user roles, and planned architecture.
* Added `docs/project-charter.md`.
* Practiced Git workflow:

```bash
git add .
git commit -m "Add backend modular architecture structure"
git push origin main
```

Repository synchronization was verified successfully.

---

## Documents Created

| Document                       | Status    |
| ------------------------------ | --------- |
| `README.md`                    | Completed |
| `docs/project-charter.md`      | Completed |
| Backend architecture structure | Completed |
| Frontend workflow design       | Completed |
| System architecture blueprint  | Completed |
| Week 01 progress report        | Completed |

---

## Technologies Planned

| Layer           | Technology             |
| --------------- | ---------------------- |
| Frontend        | Next.js + Tailwind CSS |
| Backend         | NestJS                 |
| Database        | PostgreSQL             |
| ORM             | Prisma                 |
| Vector Store    | ChromaDB / Qdrant      |
| LLM             | Gemini API             |
| Version Control | Git + GitHub           |

---

## Skills and Concepts Learned

During this week, the following concepts were learned and understood:

* RAG architecture
* Semantic retrieval
* Embedding-based search
* Modular backend design
* Role-based access workflow
* REST API planning
* Git and GitHub collaboration workflow
* Project documentation practices
* System architecture visualization

---

## Current Status

| Task                         | Status    |
| ---------------------------- | --------- |
| Project idea finalized       | Completed |
| RAG study completed          | Completed |
| Architecture designed        | Completed |
| GitHub repository created    | Completed |
| Backend structure prepared   | Completed |
| Frontend workflow designed   | Completed |
| Documentation prepared       | Completed |
| Actual API implementation    | Pending   |
| Database setup               | Pending   |
| RAG prototype implementation | Pending   |

---

## Plan for Week 02

The next week will focus on:

1. Initializing the **NestJS backend project** properly.
2. Setting up **PostgreSQL and Prisma**.
3. Implementing **authentication APIs**.
4. Creating the **frontend login page**.
5. Building the **first document upload API**.
6. Developing a **basic RAG prototype** for uploaded PDF documents.

---

## Summary

Week 01 focused on **project planning, RAG understanding, architecture design, repository setup, and documentation preparation**. A clear technical blueprint for Academix has been established, providing a strong foundation for implementation in the upcoming weeks.

---

**Submitted by:**

**Sajja Venkata Naveen**
B.Tech – 5th Semester
IIIT Sri City
