# Academix AI — Academic Knowledge Assistant

Academix AI is a full-stack academic knowledge platform that lets students ask questions about approved institutional PDFs and receive document-grounded answers with source references. Faculty manage the document library, while administrators manage users and roles.

## Features

- Student self-registration and JWT-based sign-in
- Protected, role-aware React routes for `STUDENT`, `FACULTY`, and `ADMIN`
- Responsive dashboards backed by live API data
- PDF upload, text extraction, OCR fallback, chunking, and Gemini embeddings
- Document-linked conversations with persistent history
- Retrieval-Augmented Generation (RAG) with similarity-ranked sources
- Source title, filename, chunk index, and relevance shown with responses
- Faculty/admin document management
- Admin user creation, editing, role assignment, and deletion
- Swagger API documentation

## Architecture

```text
React + Vite frontend
        │ REST + Bearer JWT
        ▼
NestJS API ── Prisma ORM ── PostgreSQL
        │
        ├── PDF text extraction / Tesseract OCR
        ├── Gemini Embedding 001
        └── Gemini answer generation
```

The backend stores users, documents, document chunks, conversations, messages, and response source metadata in PostgreSQL. The browser stores the access token in `sessionStorage`; this limits persistence to the current browser tab but remains exposed to JavaScript, so an HTTP-only cookie flow is recommended for a future production deployment.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, React Router, Axios, Tailwind CSS, Lucide React |
| Backend | NestJS 11, TypeScript, JWT, bcrypt, Swagger |
| Data | PostgreSQL, Prisma ORM |
| AI | Google Gemini, Gemini Embedding 001, cosine-similarity retrieval |
| Documents | Poppler (`pdftotext`, `pdftoppm`), Tesseract.js OCR fallback |

## Prerequisites

- Node.js 20 or newer
- PostgreSQL
- A Google Gemini API key
- Poppler available on `PATH` for PDF extraction (`pdftotext` and `pdftoppm`)

## Backend setup

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set:

```dotenv
DATABASE_URL="postgresql://postgres:password@localhost:5432/academix?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
FRONTEND_URLS="http://localhost:5173,http://127.0.0.1:5173"
MAX_UPLOAD_SIZE_MB=50
```

Apply migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Start the backend with `npm run start:dev`.

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`
- Prisma Studio: run `npx prisma studio` from `backend`

## Frontend setup

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
VITE_MAX_UPLOAD_SIZE_MB=50
```

Start the frontend with `npm run dev`, then open `http://localhost:5173`.

## Main workflows

### Student

1. Register or sign in.
2. Browse available documents.
3. Open **AI Assistant** and select a document.
4. Ask a question.
5. Read the grounded response and expand its source references.
6. Return to any previous conversation from the conversation sidebar.

### Faculty

1. Sign in with a faculty account created by an administrator.
2. Open **Documents**.
3. Upload a PDF (50 MB by default; configurable through the backend and frontend environment variables).
4. Wait for extraction, chunking, and embedding generation to finish.
5. Manage the resulting document library or use the assistant.

### Administrator

1. Sign in with an admin account.
2. Open **User management** to create or edit users and roles.
3. Manage documents with the same permissions as faculty.

Public registration always creates a `STUDENT`. Only an authenticated administrator can assign `FACULTY` or `ADMIN` roles through the protected users API.

## API overview

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/auth/register` | Public; creates student |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | Authenticated |
| `GET` | `/documents` | Authenticated |
| `GET` | `/documents/:id` | Authenticated |
| `POST` | `/documents/upload` | Faculty, admin |
| `DELETE` | `/documents/:id` | Faculty, admin |
| `GET` | `/chat` | Authenticated; own conversations |
| `GET` | `/chat/:id` | Authenticated; owner only |
| `POST` | `/chat` | Authenticated |
| `POST` | `/chat/:id/messages` | Authenticated; owner only |
| `GET/POST` | `/users` | Admin |
| `GET/PATCH/DELETE` | `/users/:id` | Admin |

## Build and test

```bash
cd backend
npm run build
npm test

cd ../frontend
npm run build
```

Do not place database credentials, JWT secrets, or Gemini keys in `VITE_*` variables. Vite variables are included in the browser bundle.
