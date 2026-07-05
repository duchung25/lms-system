import apiClient from "./apiClient";

export const authApi = {
  login: (payLoad) => {
    return apiClient.post("/auth/login", payLoad);
  },
  register: (payLoad) => {
    return apiClient.post("/auth/register", payLoad);
  },
  getProfile: () => {
    return apiClient.get("/auth/profile");
  },
  editProfile: (data) => {
    return apiClient.put("/auth/profile", data);
  },
  changePassword: (payLoad) => {
    return apiClient.put("/auth/change-password", payLoad);
  }
};
