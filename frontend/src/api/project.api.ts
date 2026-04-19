import api from "./axios";

export const getProjects = async (workspaceId: string) => {
  const response = await api.get(`/projects?workspaceId=${workspaceId}`);
  return response.data;
};

export const getProject = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (data: any) => {
  const response = await api.post("/projects", data);
  return response.data;
};
