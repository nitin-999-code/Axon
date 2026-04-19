import api from "./axios";

export const getActivityFeed = async (projectId: string) => {
  const response = await api.get(`/activity/project/${projectId}`);
  return response.data;
};
