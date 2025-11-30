import { apiClient } from './api';
import type { Document, DocumentGroup } from '../types';

export interface UploadDocumentParams {
  file: File;
  title?: string;
  group_id?: string;
}

export const documentService = {
  async list(): Promise<Document[]> {
    return apiClient.request<Document[]>('/api/v1/documents/');
  },

  async upload({ file, title, group_id }: UploadDocumentParams): Promise<Document> {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    if (group_id) form.append('group_id', group_id);

    return apiClient.request<Document>('/api/v1/documents/upload', {
      method: 'POST',
      body: form,
    });
  },

  async delete(documentId: string): Promise<void> {
    return apiClient.request<void>(`/api/v1/documents/${documentId}`, { method: 'DELETE' });
  },

  async triggerIndex(documentId: string): Promise<Document> {
    return apiClient.request<Document>(`/api/v1/documents/${documentId}/index`, {
      method: 'POST',
    });
  },

  async listGroups(): Promise<DocumentGroup[]> {
    return apiClient.request<DocumentGroup[]>('/api/v1/document-groups/');
  },

  async createGroup(name: string, description?: string): Promise<DocumentGroup> {
    return apiClient.request<DocumentGroup>('/api/v1/document-groups/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
  },

  async renameGroup(id: string, name: string): Promise<DocumentGroup> {
    return apiClient.request<DocumentGroup>(`/api/v1/document-groups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  },

  async deleteGroup(id: string): Promise<void> {
    return apiClient.request<void>(`/api/v1/document-groups/${id}`, {
      method: 'DELETE',
    });
  },

  async moveDocumentToGroup(documentId: string, groupId: string | null): Promise<Document> {
    return apiClient.request<Document>(`/api/v1/documents/${documentId}/group`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: groupId }),
    });
  },

  async updateGroupPersona(id: string, persona: string | null): Promise<DocumentGroup> {
    return apiClient.request<DocumentGroup>(`/api/v1/document-groups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona_prompt: persona }),
    });
  },
};
