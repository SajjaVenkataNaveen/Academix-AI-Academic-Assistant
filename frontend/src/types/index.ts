export type Role = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  _count?: { chunks: number; conversations: number };
}

export interface SourceReference {
  documentId: string;
  documentTitle: string;
  filename: string;
  chunkIndex: number;
  similarity: number;
}

export interface Message {
  id: string;
  content: string;
  sender: 'USER' | 'AI';
  conversationId: string;
  createdAt: string;
  sources?: SourceReference[] | null;
}

export interface Conversation {
  id: string;
  title?: string | null;
  userId: string;
  documentId?: string | null;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatReply {
  userMessage: Message;
  aiMessage: Message;
  sources: SourceReference[];
}
