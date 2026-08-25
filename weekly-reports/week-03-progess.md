---
institution: IIIT Sri City
project: Academix AI Academic Assistant
student: Sajja Venkata Naveen
subtitle: Week 03 Progress Report
title: Academix -- AI-Powered Academic Knowledge Assistant
week: Week 03
---

# Week 03 Progress Report

## 1. Week Overview

Week 03 focused on moving the Academix AI Academic Assistant from the
planned architecture into a working backend prototype. The main work
completed was backend integration of authentication, document
processing, retrieval-augmented generation (RAG), Gemini response
generation, conversation handling, and initial role-based access
control.

The backend uses NestJS and TypeScript, PostgreSQL with Prisma for
persistence, and Gemini for AI response generation. Document chunks are
embedded and ranked using cosine similarity before relevant context is
supplied to the AI model.

## 2. Major Work Completed

### Backend and Database

-   Continued development of the NestJS backend.
-   Structured modules for authentication, users, documents, chat, AI,
    and Prisma/database access.
-   Implemented database models for users, courses, enrollments,
    materials, assignments, documents, document chunks, conversations,
    and messages.
-   Defined three project actors: STUDENT, FACULTY, and ADMIN.

### Authentication

-   Implemented user registration.
-   Implemented bcrypt password hashing during registration.
-   Implemented email/password login.
-   Implemented JWT generation after successful authentication.
-   Implemented `JwtAuthGuard` for bearer-token validation.
-   Verified authentication and authorization through Swagger.

### Document Processing and RAG

The document-based AI workflow was tested successfully: 1. Upload PDF.
2. Extract text. 3. Split text into chunks. 4. Generate embeddings. 5.
Store chunks and embeddings. 6. Generate an embedding for the user's
question. 7. Rank document chunks using cosine similarity. 8. Keep
sufficiently relevant chunks. 9. Combine retrieved context with recent
conversation history. 10. Send the constructed prompt to Gemini. 11.
Save and return the AI response and source metadata.

The current retrieval logic uses a similarity threshold of `0.45` and
keeps up to the top `3` relevant chunks.

### Conversation and Context

-   Implemented conversation creation and retrieval.
-   Conversations can be associated with an uploaded document.
-   User and AI messages are persisted.
-   Recent conversation history is supplied to Gemini.
-   The prompt handles references such as "he", "she", "it", "the
    candidate", and similar follow-up references.
-   Source metadata is returned with the AI response.

### Gemini Integration

-   Integrated Gemini through `AiService`.
-   The prompt contains academic-assistant instructions, conversation
    history, retrieved document context, and the current question.
-   Gemini's answer is stored as an AI message.

### Role-Based Access Control

-   Implemented the `Roles` decorator.
-   Implemented `RolesGuard`.
-   Included the user's role in the JWT payload.
-   Protected the Admin-only user deletion operation.
-   Verified that an unauthorized role can receive `403 Forbidden`.
-   Verified that an Admin-authorized request can access `GET /users`.
-   Verified that an Admin-authorized request can execute
    `DELETE /users/{id}`.

Admin authorization is working. Student and Faculty role testing still
needs to be completed across the full endpoint set.

## 3. Testing Results

  Test                                Result
  ----------------------------------- --------
  User registration                   PASS
  User login                          PASS
  JWT authentication                  PASS
  Document upload and processing      PASS
  Document chunk retrieval            PASS
  Cosine-similarity ranking           PASS
  Gemini response generation          PASS
  Conversation history                PASS
  RAG answer from uploaded document   PASS
  Source metadata                     PASS
  Admin `GET /users`                  PASS
  Admin `DELETE /users/{id}`          PASS
  Unauthorized role check             PASS

The RAG system correctly answered document-grounded questions, including
follow-up questions referring to the same candidate. For questions
outside the available document context, the configured fallback response
was returned:

> "I could not find this information in the uploaded documents."

## 4. Problems Encountered and Resolutions

### 4.1 403 Forbidden

A protected users request initially returned `403 Forbidden` because the
JWT being used belonged to a STUDENT account while an Admin-authorized
operation was being tested.

**Resolution:** The test account was changed to ADMIN in Prisma Studio,
a fresh login token was generated, and Swagger was re-authorized.

### 4.2 Admin Login Failure

The manually created Admin test account initially had a plaintext
password, while the authentication service expects a bcrypt hash.

**Resolution:** A bcrypt hash was generated and stored for the Admin
account. Login then succeeded and produced an Admin JWT.

### 4.3 Out-of-Context Questions

Some questions did not have sufficiently relevant document chunks.

**Resolution:** The system intentionally returns the configured
document-grounding fallback instead of generating unsupported
information.

## 5. Current Architecture Status

``` text
User
  |
  v
JWT Authentication
  |
  v
NestJS Chat API
  |
  +--> PostgreSQL / Prisma
  |       |
  |       +--> Conversations
  |       +--> Messages
  |       +--> Documents
  |       +--> Document Chunks
  |
  +--> Question Embedding
  |
  +--> Cosine Similarity Retrieval
  |
  +--> Relevant Document Context
  |
  +--> Conversation History
  |
  v
Gemini API
  |
  v
Grounded AI Response + Sources
```

The project architecture defines Student, Faculty, and Admin actors,
with the broader system planned around a frontend, NestJS backend,
PostgreSQL/vector storage, and Gemini. The architecture deck also
identifies the RAG flow of upload, text extraction, chunking,
embeddings, retrieval, and Gemini generation.
fileciteturn14file0L24-L49

## 6. Current Status

### Completed

-   NestJS backend foundation
-   PostgreSQL + Prisma integration
-   Registration and login
-   bcrypt password hashing
-   JWT authentication
-   Document upload and processing
-   Text chunking
-   Embedding generation
-   Similarity-based retrieval
-   Gemini integration
-   Document-grounded chat
-   Conversation history
-   Source tracking
-   Initial Admin RBAC
-   Swagger API testing

### Remaining

-   Complete Faculty-specific permissions and testing.
-   Complete Student-specific permission testing.
-   Review protected endpoints and apply role restrictions consistently.
-   Prevent password hashes from appearing in user deletion responses.
-   Integrate backend APIs with the frontend.
-   Perform end-to-end testing for all three actors.

## 7. Learning Outcomes

This week connected the major technical layers of the project:
authentication, authorization, database persistence, embeddings,
similarity retrieval, conversational context, and LLM generation. The
most important validation was the successful path from a user question
to retrieved document chunks and a grounded Gemini response.

The week also established the first working part of the three-actor
authorization model: Admin access is now being enforced and tested.

## 8. Next Week Plan

1.  Complete Student permission testing.
2.  Implement and test Faculty-specific permissions.
3.  Apply RBAC consistently to protected endpoints.
4.  Remove sensitive password fields from user deletion responses.
5.  Connect the backend APIs to the frontend.
6.  Test the complete user journey from login to document-based chat.
7.  Display retrieved source information in the frontend.
8.  Prepare end-to-end evidence for Student, Faculty, and Admin.

## 9. Week 03 Conclusion

Week 03 achieved a functional backend prototype of Academix.
Authentication, database persistence, document processing, RAG
retrieval, Gemini generation, conversation context, and initial Admin
authorization are working and have been tested through Swagger. The next
development stage is to complete the three-actor permission model and
connect the working backend to the frontend.