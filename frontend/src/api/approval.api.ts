import api from "./axios";

export const requestApproval = async (taskId: string) => {
  const response = await api.post(`/approvals/${taskId}/request-approval`);
  return response.data;
};

export const approveTask = async (taskId: string) => {
  const response = await api.post(`/approvals/${taskId}/approve`);
  return response.data;
};

export const getApprovals = async (taskId: string) => {
  const response = await api.get(`/approvals/${taskId}`);
  return response.data;
};
