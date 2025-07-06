export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  audioUrl?: string;
  createdAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  serviceType: 'brief_builder' | 'project_advisor' | 'content_assistant';
  title?: string;
  createdAt: Date;
  updatedAt: Date;
} 