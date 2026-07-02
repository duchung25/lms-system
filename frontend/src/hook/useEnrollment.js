import { useCallback, useEffect, useState } from "react";
import { enrollmentService } from "../service/enrollment.service";
import { getErrorMessage } from "../helpers/error.helper";

export const useStudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await enrollmentService.getStudentDashboard();
      setDashboardData(data);
    } catch (err) {
      setDashboardData(null);
      setError(getErrorMessage(err) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboardData, loading, error, refetch: fetchDashboard };
};
