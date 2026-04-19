import api from "./axios";

export const login = async (data: any) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data: any) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
