import { useGetAdminOrderDashboard } from "../hook/useOrder";

export default function AdminOrdersPage() {
  const { dashboardData, loading, error } = useGetAdminOrderDashboard();
  const overview = dashboardData?.overview || {};

  return (
    <div className="nav-feature-page">
      <div className="nav-feature-header">
        <div>
          <p>Admin</p>
          <h1>Orders</h1>
          <span>Theo dõi đơn hàng và doanh thu từ collection Order hiện có.</span>
        </div>
      </div>

      {loading ? (
        <div className="nav-feature-state">Đang tải đơn hàng...</div>
      ) : error ? (
        <div className="nav-feature-state error">{error}</div>
      ) : (
        <div className="nav-feature-kpi-grid">
          <div><span>Total Orders</span><strong>{overview.totalOrders || 0}</strong></div>
          <div><span>Paid Orders</span><strong>{overview.paidOrders || 0}</strong></div>
          <div><span>Pending Orders</span><strong>{overview.pendingOrders || 0}</strong></div>
          <div><span>Revenue</span><strong>{Number(overview.totalRevenue || 0).toLocaleString("vi-VN")} VND</strong></div>
        </div>
      )}
    </div>
  );
}
