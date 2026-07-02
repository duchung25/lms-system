import apiClient from "./apiClient";

export const enrollmentApi = {
  getStudentDashboard: () => {
    return apiClient.get("/enrollments/student/dashboard");
  },
};
