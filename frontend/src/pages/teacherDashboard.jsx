import { useState } from "react";
import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import {
  IoBookOutline,
  IoPeopleOutline,
  IoStatsChartOutline
} from "react-icons/io5";

import { useTeacherDashboard } from "../hook/useCourse";
import { useGetTeacherOrderDashboard } from "../hook/useOrder";

import "../assets/css/pages/teacherDashboard.css";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("courses");

  const { dashboardData: courseData, loading: courseLoading, error: courseError } = useTeacherDashboard();
  const { dashboardData: orderData, loading: orderLoading, error: orderError } = useGetTeacherOrderDashboard();
  console.log ("Course Dashboard Data:", courseData);
  console.log ("Order Dashboard Data:", orderData);

  const courseOverview = courseData?.overview || {};
  const learningStats = courseData?.learningStats || {};
  const courseCharts = courseData?.charts || {};
  const topCourses = courseData?.topCourses || [];
  const latestCourses = courseData?.latestCourses || [];

  const orderOverview = orderData?.overview || {};
  const revenueCharts = orderData?.charts || {};
  const topRevenueCourses = orderData?.topCourses || [];

  const enrollmentGrowth =
    courseCharts?.enrollmentGrowth?.map(i => ({
      month: `${i._id.month}/${i._id.year}`,
      value: i.totalEnrollments
    })) || [];

  const revenueGrowth =
    revenueCharts?.revenueGrowth?.map(i => ({
      month: `${i._id.month}/${i._id.year}`,
      value: i.revenue
    })) || [];

  return (
    <div className="teacher-dashboard-v2">

      {/* ================= HEADER ================= */}
      <div className="td-header">

        <div>
          <h1>Teacher Studio</h1>
          <p>Performance & revenue insights</p>
        </div>

        <div className="td-tabs">
          <button className={activeTab === "courses" ? "active" : ""} onClick={() => setActiveTab("courses")}>
            Courses
          </button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            Revenue
          </button>
        </div>

      </div>

      {/* ================= COURSES ================= */}
      {activeTab === "courses" && (
        <>
          {courseLoading ? <div>Loading...</div> : courseError ? <div>{courseError}</div> : (

            <>
              {/* HERO SNAPSHOT */}
              <div className="td-hero glass">

                <div>
                  <h2>Your Teaching Snapshot</h2>
                  <p>Real-time learning analytics</p>
                </div>

                <div className="td-pills">
                  <div className="pill">
                    <IoBookOutline />
                    {courseOverview.totalCourses} Courses
                  </div>

                  <div className="pill">
                    <IoPeopleOutline />
                    {courseOverview.totalStudents} Students
                  </div>

                  <div className="pill highlight">
                    {learningStats.averageProgress}% Avg
                  </div>
                </div>

              </div>

              {/* CHART */}
              <div className="card glass chart-focus">
                <h3>Enrollment Growth</h3>

                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={enrollmentGrowth}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    <Area dataKey="value" stroke="#6366f1" fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* LIST STYLE (timeline feel) */}
              <div className="td-grid">

                <div className="card glass">
                  <h3>Top Courses</h3>

                  {topCourses.map((c, i) => (
                    <div className="timeline-row" key={c._id}>
                      <span className="dot">{i + 1}</span>
                      <div>
                        <h4>{c.title}</h4>
                        <small>{c.studentsCount} learners</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card glass">
                  <h3>Latest Courses</h3>

                  {latestCourses.map(c => (
                    <div className="mini-row" key={c._id}>
                      <img src={c.thumbnail} />
                      <div>
                        <h4>{c.title}</h4>
                        <small>{c.level}</small>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </>
          )}
        </>
      )}

      {/* ================= REVENUE ================= */}
      {activeTab === "orders" && (
        <>
          {orderLoading ? <div>Loading...</div> : orderError ? <div>{orderError}</div> : (

            <>
              {/* FINANCE HERO (gradient strip) */}
              <div className="td-revenue-hero">

                <div>
                  <h2>Total Revenue</h2>
                  <h1>${orderOverview.totalRevenue}</h1>
                </div>

                <div className="td-inline-kpi">
                  <span>{orderOverview.totalOrders} Orders</span>
                  <span>{orderOverview.paidOrders} Paid</span>
                  <span>{orderOverview.pendingOrders} Pending</span>
                </div>

              </div>

              {/* BIG CHART FOCUS */}
              <div className="card glass chart-focus">
                <h3>Revenue Growth</h3>

                <ResponsiveContainer width="100%" height={340}>
                  <AreaChart data={revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    <Area dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* LEDGER STYLE */}
              <div className="card glass">
                <h3>Top Revenue Courses</h3>

                {topRevenueCourses.map((c, i) => (
                  <div className="ledger-row" key={c._id}>
                    <span className="rank">{i + 1}</span>
                    <div>
                      <h4>{c.title}</h4>
                      <small>${c.revenue}</small>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

    </div>
  );
}