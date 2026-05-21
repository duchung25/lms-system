import { useState } from "react"; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar} from "recharts";
import { IoPeopleOutline, IoPersonAddOutline, IoShieldCheckmarkOutline, IoStatsChartOutline, IoBookOutline, IoCashOutline } from "react-icons/io5";
import { useGetDashboardStatistics } from "../hook/useAdmin";
import "../assets/css/pages/adminDashBoard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const { statistics, loading, error } =
    useGetDashboardStatistics();

  const overview = statistics?.overview || {};

  const growthData =
    statistics?.charts?.userGrowthByMonth?.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      users: item.totalUsers
    })) || [];

  const roleData = [
    {
      name: "Students",
      value: overview.totalStudents || 0
    },
    {
      name: "Teachers",
      value: overview.totalTeachers || 0
    },
    {
      name: "Admins",
      value: overview.totalAdmins || 0
    }
  ];

  const mockEnrollmentData = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 230 },
    { month: "Mar", value: 180 },
    { month: "Apr", value: 350 },
    { month: "May", value: 400 }
  ];

  const COLORS = [
    "#4f46e5",
    "#7c3aed",
    "#06b6d4"
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Monitor your LMS analytics</p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`dashboard-tab ${activeTab === "enrollments"? "active": ""}`}
            onClick={() => setActiveTab("enrollments")}
          >
            Enrollments
          </button>
          <button
            className={`dashboard-tab ${activeTab === "revenue"? "active": ""}`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>

          <button
            className={`dashboard-tab ${
              activeTab === "courses"? "active": ""}`}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </button>
        </div>
      </div>

      {activeTab === "users" && (
        <>
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon primary">
                <IoPeopleOutline />
              </div>

              <div className="dashboard-stat-content">
                <span className="dashboard-stat-label">Total Users</span>
                <h3>{overview.totalUsers || 0}</h3>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon success">
                <IoShieldCheckmarkOutline />
              </div>

              <div className="dashboard-stat-content">
                <span className="dashboard-stat-label">Active Users</span>
                <h3>{overview.activeUsers || 0}</h3>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon warning">
                <IoPersonAddOutline />
              </div>

              <div className="dashboard-stat-content">
                <span className="dashboard-stat-label">
                  New This Month
                </span>

                <h3>
                  {overview.newUsersThisMonth || 0}
                </h3>
              </div>
            </div>

            <div className="dashboard-stat-card gradient-card">
              <div className="dashboard-stat-content">
                <span className="dashboard-stat-label light">
                  Deleted Users
                </span>

                <h3 className="light">{overview.deletedUsers || 0}</h3>
                <div className="dashboard-progress">
                  <div className="dashboard-progress-fill" style={{ width: `${Math.min( overview.deletedUsers || 0,100)}%`}}/>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <h3>User Growth Analytics</h3>
                <p>Monthly user growth overview</p>
              </div>

              <div className="dashboard-chart-badge">
                <IoStatsChartOutline />
                Analytics
              </div>
            </div>

            <div className="dashboard-chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#d9d7e8"/>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#4f46e5"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-bottom-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>User Demographics</h3>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={55}
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h3>Daily Activity</h3>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#4f46e5"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === "enrollments" && (
        <div className="dashboard-placeholder-card">
          <IoBookOutline />

          <h2>Enrollment Dashboard</h2>

          <p>
            Enrollment analytics API will be
            integrated later.
          </p>
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="dashboard-placeholder-card">
          <IoCashOutline />

          <h2>Revenue Dashboard</h2>

          <p>
            Revenue analytics API will be
            integrated later.
          </p>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="dashboard-placeholder-card">
          <IoBookOutline />
          <h2>Course Dashboard</h2>
          <p>
            Course analytics API will be
            integrated later.
          </p>
        </div>
      )}
    </div>
  );
}