import api from "./axios";

export const getTasks = async (projectId: string) => {
  const response = await api.get(`/tasks?projectId=${projectId}`);
  return response.data;
};

export const createTask = async (data: any) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const moveTask = async (taskId: string, targetStateName: string) => {
  const response = await api.post(`/workflows/tasks/${taskId}/transition`, { targetStateName });
  return response.data;
};
