import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

import {
  IoPeopleOutline,
  IoPersonAddOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
  IoBookOutline,
  IoCheckmarkDoneOutline
} from "react-icons/io5";

import {
  useGetDashboardStatistics,
  useGetCourseDashboard
} from "../hook/useAdmin";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const {
    statistics,
    loading: statisticsLoading,
    error
  } = useGetDashboardStatistics();

  const {
    courseStats,
    loading: courseLoading,
    error: courseError
  } = useGetCourseDashboard();

  const overview = statistics?.overview || {};

  const courseOverview = courseStats?.overview || {};

  const learningStats =
    courseStats?.learningStats || {};

  const latestCourses =
    courseStats?.latestCourses || [];

  const topCourses =
    courseStats?.topCourses || [];

  const growthData =
    statistics?.charts?.userGrowthByMonth?.map(item => ({
      month: `${item._id.month}/${item._id.year}`,
      users: item.totalUsers
    })) || [];

  const enrollmentGrowth =
    courseStats?.charts?.enrollmentGrowth?.map(item => ({
      month: `${item._id.month}/${item._id.year}`,
      enrollments: item.totalEnrollments
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

  const COLORS = [
    "#4f46e5",
    "#7c3aed",
    "#06b6d4"
  ];

  if (statisticsLoading && activeTab === "users") {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error && activeTab === "users") {
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
          <h1 className="dashboard-title">
            Dashboard Overview
          </h1>

          <p className="dashboard-subtitle">
            Monitor your LMS analytics
          </p>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            className={`dashboard-tab ${
              activeTab === "courses" ? "active" : ""
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </button>

          <button
            className={`dashboard-tab ${
              activeTab === "revenue" ? "active" : ""
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
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
                <span className="dashboard-stat-label">
                  Total Users
                </span>

                <h3>
                  {overview.totalUsers || 0}
                </h3>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon success">
                <IoShieldCheckmarkOutline />
              </div>

              <div className="dashboard-stat-content">
                <span className="dashboard-stat-label">
                  Active Users
                </span>

                <h3>
                  {overview.activeUsers || 0}
                </h3>
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
                  New Today
                </span>

                <h3 className="light">
                  {overview.newUsersToday || 0}
                </h3>

                <div className="dashboard-progress">
                  <div
                    className="dashboard-progress-fill"
                    style={{
                      width: `${Math.min(
                        overview.newUsersToday || 0,
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <h3>User Growth Analytics</h3>

                <p>
                  Monthly user growth overview
                </p>
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
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#d9d7e8" />

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
                        fill={COLORS[index % COLORS.length]}
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
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="users"
                    fill="#4f46e5"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === "courses" && (
        <>
          {courseLoading ? (
            <div className="dashboard-loading">
              Loading course dashboard...
            </div>
          ) : courseError ? (
            <div className="dashboard-error">
              {courseError}
            </div>
          ) : (
            <>
              <div className="dashboard-stats-grid">
                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon primary">
                    <IoBookOutline />
                  </div>

                  <div className="dashboard-stat-content">
                    <span className="dashboard-stat-label">
                      Total Courses
                    </span>

                    <h3>
                      {courseOverview.totalCourses || 0}
                    </h3>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon success">
                    <IoShieldCheckmarkOutline />
                  </div>

                  <div className="dashboard-stat-content">
                    <span className="dashboard-stat-label">
                      Published Courses
                    </span>

                    <h3>
                      {courseOverview.publishedCourses || 0}
                    </h3>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon warning">
                    <IoStatsChartOutline />
                  </div>

                  <div className="dashboard-stat-content">
                    <span className="dashboard-stat-label">
                      Draft Courses
                    </span>

                    <h3>
                      {courseOverview.draftCourses || 0}
                    </h3>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon primary">
                    <IoPeopleOutline />
                  </div>

                  <div className="dashboard-stat-content">
                    <span className="dashboard-stat-label">
                      Total Students
                    </span>

                    <h3>
                      {courseOverview.totalStudents || 0}
                    </h3>
                  </div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="dashboard-stat-icon success">
                    <IoStatsChartOutline />
                  </div>

                  <div className="dashboard-stat-content">
                    <span className="dashboard-stat-label">
                      Average Progress
                    </span>

                    <h3>
                      {learningStats.averageProgress || 0}%
                    </h3>
                  </div>
                </div>

                <div className="dashboard-stat-card gradient-card">
                  <div className="dashboard-stat-content">
                    <span className="dashboard-stat-label light">
                      Completion Rate
                    </span>

                    <h3 className="light">
                      {learningStats.completionRate || 0}%
                    </h3>
                  </div>
                </div>
              </div>

              <div className="dashboard-chart-card">
                <div className="dashboard-card-header">
                  <div>
                    <h3>Enrollment Growth</h3>

                    <p>
                      Monthly enrollment analytics
                    </p>
                  </div>

                  <div className="dashboard-chart-badge">
                    <IoStatsChartOutline />
                    Analytics
                  </div>
                </div>

                <div className="dashboard-chart-wrapper">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={enrollmentGrowth}>
                      <defs>
                        <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="enrollments"
                        stroke="#7c3aed"
                        fillOpacity={1}
                        fill="url(#colorEnrollments)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="dashboard-bottom-grid">
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Top Courses</h3>
                  </div>

                  <div className="dashboard-latest-courses">
                    {topCourses.length === 0 ? (
                      <p>No courses found.</p>
                    ) : (
                      topCourses.map(course => (
                        <div
                          key={course._id}
                          className="dashboard-latest-course-item"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            width={60}
                            height={40}
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                          />

                          <div>
                            <h5>
                              {course.title}
                            </h5>

                            <p>
                              {course.studentsCount || 0} students
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h3>Latest Courses</h3>
                  </div>

                  <div className="dashboard-latest-courses">
                    {latestCourses.length === 0 ? (
                      <p>No courses found.</p>
                    ) : (
                      latestCourses.map(course => (
                        <div
                          key={course._id}
                          className="dashboard-latest-course-item"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            width={60}
                            height={40}
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                          />

                          <div>
                            <h5>
                              {course.title}
                            </h5>

                            <p>
                              {course.level} • {course.studentsCount || 0} students
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h3>Course Statistics</h3>
                </div>

                <div className="dashboard-course-stats">
                  <p>
                    <strong>Total Lessons:</strong>{" "}
                    {courseOverview.totalLessons || 0}
                  </p>

                  <p>
                    <strong>Total Duration:</strong>{" "}
                    {courseOverview.totalDuration || 0} mins
                  </p>

                  <p>
                    <strong>Total Enrollments:</strong>{" "}
                    {learningStats.totalEnrollments || 0}
                  </p>

                  <p>
                    <strong>Completed Enrollments:</strong>{" "}
                    {learningStats.completedEnrollments || 0}
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}