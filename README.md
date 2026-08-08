# Academix – AI-Powered Academic Knowledge Assistant

## 📌 Project Overview

**Academix** is a conversational AI platform designed for **IIIT Sri City** that enables students to access academic information through natural language queries.

The system uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded college documents such as regulations, lecture notes, previous question papers, timetables, and lab manuals, and then generates accurate, context-aware responses using a Large Language Model (LLM).

---

## 🎯 Problem Statement

Students often spend significant time searching through multiple academic documents to find relevant information. Academix aims to reduce this effort by providing a unified conversational interface for academic knowledge retrieval.

---

## 👥 User Roles

* **Student** – Ask academic questions, generate summaries, quizzes, and study notes.
* **Faculty** – Upload and manage academic resources.
* **Admin** – Manage users, documents, and system permissions.

---

## 🧠 Core Features

* Secure authentication and role-based access
* Manual document upload (PDF, DOCX, PPT)
* RAG-based document retrieval
* Conversational AI chat interface
* Source-aware responses
* Chat history management
* Academic quiz and summary generation

---

## 🏗️ Proposed Architecture

```text
User → Frontend → Backend API → RAG Pipeline → Vector Database → LLM → Response
```

---

## 🛠️ Planned Tech Stack

### Frontend

* React / Next.js
* TypeScript
* Tailwind CSS

### Backend

* NestJS
* Node.js
* JWT Authentication

### AI / RAG

* LangChain
* Gemini API
* Vector Database (Pinecone / Qdrant / ChromaDB)

### Database

* PostgreSQL
* Prisma ORM

---

## 📅 Development Approach

This project is being developed incrementally with a strong focus on:

* Conceptual understanding
* System architecture design
* Documentation and weekly progress tracking
* Industry-style Git workflow and code reviews

---

## 📈 Current Status

**Phase:** Project Planning & Architecture Design

* [x] Problem statement finalized
* [x] Project title finalized
* [x] User roles identified
* [x] RAG fundamentals studied
* [ ] System architecture design
* [ ] Authentication module
* [ ] Document upload module
* [ ] RAG pipeline implementation
* [ ] Conversational chat interface

---

## 📧 Project Guide Communication

Weekly progress reports and meeting notes will be maintained in the repository as part of the continuous evaluation process.

---

## 🚀 Vision

To build a scalable **AI-powered academic knowledge platform** that can eventually evolve into a comprehensive conversational assistant for higher-education institutions.
