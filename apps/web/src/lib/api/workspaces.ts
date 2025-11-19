import { apiClient } from './client';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
}

export const workspacesAPI = {
  getAll: () => {
    return apiClient.get<Workspace[]>('/workspaces');
  },

  getById: (id: string) => {
    return apiClient.get<Workspace>(`/workspaces/${id}`);
  },

  create: (data: CreateWorkspaceDto) => {
    return apiClient.post<Workspace>('/workspaces', data);
  },

  update: (id: string, data: Partial<CreateWorkspaceDto>) => {
    return apiClient.put<Workspace>(`/workspaces/${id}`, data);
  },

  delete: (id: string) => {
    return apiClient.delete(`/workspaces/${id}`);
  },
};
