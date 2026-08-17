# Academix – Week 02 Progress Report

## Project Title

**Academix – AI-Powered Academic Knowledge Assistant**

## Week

**Week 02**

## Objective

The objective of Week 02 was to move from the initial project planning and architecture phase toward the implementation phase of Academix. The focus was on understanding the backend components required for authentication, database integration, document management, and the future RAG pipeline.

---

## Work Completed

### 1. Backend Architecture Review

Reviewed the modular backend structure planned using **NestJS**.

The backend is divided into modules such as:

* Authentication
* Users
* Documents
* Chat
* RAG
* Prisma
* Common utilities

This modular structure will allow different functionalities of Academix to be developed and maintained independently.

### 2. Authentication Workflow Planning

Studied and planned the authentication flow required for Academix.

The system will eventually support different roles:

* Student
* Faculty
* Admin

The authentication module will be responsible for verifying users and controlling access to features according to their roles.

### 3. Database Planning

Reviewed the purpose of using **PostgreSQL** as the primary relational database and **Prisma ORM** for communication between the NestJS backend and the database.

Initial entities identified include:

* User
* Document
* Chat / Query
* User Role

### 4. Document Ingestion Workflow Planning

Designed the basic workflow for adding academic documents to the knowledge base.

Planned workflow:

**Faculty/Admin Upload → Document Storage → Text Extraction → Chunking → Embedding Generation → Vector Storage**

These processed documents will later become the knowledge source for the RAG system.

### 5. RAG Integration Planning

Reviewed how the previously studied RAG concepts will connect with the Academix backend.

Planned query workflow:

**Student Question → Query Embedding → Retriever → Relevant Document Chunks → LLM → Final Academic Answer**

This ensures that responses are generated using relevant academic resources rather than relying only on the LLM's general knowledge.

---

## Learning Outcomes

During Week 02, I improved my understanding of:

* Modular backend architecture using NestJS
* Role-based authentication requirements
* PostgreSQL and Prisma ORM
* Document ingestion pipelines
* Integration of a backend application with a RAG pipeline
* Separation between application data and vector-based knowledge storage

---

## Current Project Status

| Component                   | Status    |
| --------------------------- | --------- |
| Project Definition          | Completed |
| RAG Fundamentals            | Completed |
| System Architecture         | Completed |
| GitHub Repository Setup     | Completed |
| Backend Structure           | Designed  |
| Authentication Workflow     | Planned   |
| Database Integration        | Planned   |
| Document Ingestion Pipeline | Planned   |
| RAG Prototype               | Pending   |
| Frontend Implementation     | Pending   |

---

## Pending Implementation

The implementation tasks planned during this phase will be continued in the following development cycle:

1. Initialize and run the NestJS backend.
2. Configure PostgreSQL and Prisma.
3. Create the initial database schema.
4. Implement authentication APIs.
5. Implement the document upload endpoint.
6. Begin the first functional RAG prototype.

---

## Plan for Week 03

Week 03 will focus on converting the planned architecture into a working implementation.

The major targets are:

1. Complete pending Week 02 implementation tasks.
2. Set up the NestJS development environment.
3. Integrate PostgreSQL with Prisma.
4. Begin authentication implementation.
5. Develop the initial document upload functionality.
6. Start building the first end-to-end RAG pipeline.

---

## Summary

Week 02 primarily focused on strengthening the implementation plan for Academix. The backend modules, authentication workflow, database requirements, document ingestion pipeline, and RAG integration flow were studied and planned. These preparations establish the technical direction required to begin the core implementation of the system in Week 03.
