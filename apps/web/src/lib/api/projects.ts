import { apiClient } from './client';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  stack?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  workspace?: any;
  creator?: any;
}

export interface CreateProjectDto {
  name: string;
  slug: string;
  description?: string;
  workspaceId: string;
  creatorId: string;
  stack?: string;
  config?: Record<string, any>;
}

export const projectsAPI = {
  getAll: (workspaceId?: string) => {
    const query = workspaceId ? `?workspaceId=${workspaceId}` : '';
    return apiClient.get<Project[]>(`/projects${query}`);
  },

  getById: (id: string) => {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  create: (data: CreateProjectDto) => {
    return apiClient.post<Project>('/projects', data);
  },

  update: (id: string, data: Partial<CreateProjectDto>) => {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  delete: (id: string) => {
    return apiClient.delete(`/projects/${id}`);
  },

  getGraph: (id: string) => {
    return apiClient.get(`/projects/${id}/graph`);
  },
};
