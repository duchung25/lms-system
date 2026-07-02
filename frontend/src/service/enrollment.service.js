import { enrollmentApi } from "../api/enrollment.api";

export const enrollmentService = {
  async getStudentDashboard() {
    const res = await enrollmentApi.getStudentDashboard();
    return res.data?.data?.dashboardData ?? null;
  },
};
