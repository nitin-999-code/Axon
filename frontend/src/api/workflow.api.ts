import api from "./axios";

export const getWorkflow = async (projectId: string) => {
  const response = await api.get(`/workflows/project/${projectId}`);
  return response.data;
};
