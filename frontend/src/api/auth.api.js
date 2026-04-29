import apiClient from "./apiClient";

export const login = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
}
export const register = (username, email, password) => {
  return apiClient.post("/auth/register", { username, email, password });
}
export const getProfile = () => {
  return apiClient.get("/auth/profile");
}
export const editProfile = (data) => {
  return apiClient.put("/auth/profile", data);
}
export const changePassword = (currentPassword, newPassword) => {
  return apiClient.post("/auth/change-password", { currentPassword, newPassword });
}