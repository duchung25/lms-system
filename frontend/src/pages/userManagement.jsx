import { useState, useEffect } from "react";
import { useGetAllUsers } from "../hook/useAdmin.js";
import "../assets/css/pages/userManagement.css";
import { IoIosSearch, SlOptionsVertical} from "../icons";

export default function UserManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [filter, setFilter] = useState({
        page: 1,
        limit: 5,
        search: "",
        role: "",
        active: "", 
        deleted: "",
    });
  const [params, setParams] = useState({
        page: 1,
        limit: 5,
        search: "",
        role: "",
        active: "",
        deleted: "",
    });
  const { users, pagination, loading, error } = useGetAllUsers(params);

  const handleOnChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setParams((prev) => ({
        ...prev,
        search: searchInput,
        page: 1
      }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);
  const handleNextPage = () => {
    setParams((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, pagination.totalPages)
    }));
  };
  const handlePrevPage = () => {
    setParams((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1)
    }));
  };
  const handlePageClick = (page) => {
    setParams((prev) => ({
      ...prev,
      page
    }));
  };
  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };
  const handleApplyFilter = () => {
    setParams((prev) => ({
      ...prev,
      ...filter,
    }));
    setShowFilter(false);
  };
  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  };
  
  const mappedUsers = (users || []).map((u) => ({
    id: u._id,
    username: u.username,
    email: u.email,
    avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || "U")}`,
    role: u.role === "student" ? "Student" : u.role === "teacher" ? "Instructor" : "Admin",
    roleType: u.role || "student",
    status: u.active ? "Active" : "Pending",
    statusType: u.active ? "active" : "pending",
    joinDate: new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    activityPercent: Math.floor(Math.random() * 80) + 10,
  }));
  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (error) {
    return <div className="text-danger">Lỗi: {error}</div>;
  }
  return (
    <div className="user-mng-main">
      <div className="user-mng-head d-flex justify-content-between align-items-start">
        <div>
          <div className="user-mng-title1">User Management</div>
        </div>
        <div className="d-flex gap-2 position-relative">
          <button className="btn btn-secondary user-mng-filter" onClick={() => setShowFilter(!showFilter)}>
            <i className="bi bi-sliders2"></i>
            <span>Filter</span>
          </button>
          <button className="btn btn-primary user-mng-export">
            <i className="bi bi-download"></i>
            <span>Export CSV</span>
          </button>
          {showFilter && (
            <div className="filter-box mt-3 p-3 border rounded position-absolute bg-white shadow filter-option">
              <h5>Filter Users</h5>

              <div className="mb-3">
                <label>Status</label>
                <select className="form-select" value={filter.active} onChange={(e) => handleFilterChange("active", e.target.value)}>
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Blocked</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Role</label>
                <select className="form-select" value={filter.role} onChange={(e) => handleFilterChange("role", e.target.value)}>
                  <option value="">All</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={handleApplyFilter}>
                Apply Filter
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="search-bar d-flex align-items-center gap-2 mb-3">
            <div className="search-bar__text">Search:</div>
            <input type="text" className="search-bar__input" placeholder="Enter email/username" value={searchInput} onChange={handleOnChangeSearch}/>
            <button className="search-bar__btn btn btn-primary">
              <IoIosSearch size={22}/>
            </button>
          </div>

      <div className="user-mng-table-wrap">
        <table className="table user-mng-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th style={{width: 110}}>Activity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mappedUsers.map((u) => (
              <tr key={u.email} className="user-row">
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={u.avatar} alt={u.username} className="avatar" />
                    <div>
                      <strong>{u.username}</strong>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge role-badge role-${u.roleType.toLowerCase()}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`status-dot status-${u.statusType.toLowerCase()}`}></span>
                  <span className="status-text">{u.status}</span>
                </td>
                <td>{u.joinDate}</td>
                <td>
                  <div className="activity-bar-wrap">
                    <div className="activity-bar" style={{width: `${u.activityPercent}%`}}></div>
                    <span className="activity-percent">{u.activityPercent}% Completion</span>
                  </div>
                </td>
                <td classsName="text-end position-relative">
                  <button className="btn btn-icon btn-sm" value={showAction} onClick={() => setShowAction(!showAction)}>
                    <SlOptionsVertical />
                  </button>
                  {showAction && (
                    <div className="dropdown-menu show">
                      <button className="dropdown-item">Edit</button>
                      <button className="dropdown-item">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="user-mng-paging d-flex align-items-center justify-content-between">
          <span>Showing {users.length} of {pagination.total} users</span>
          <div className="pagination pagination-sm m-0">
            <button className="btn btn-white btn-sm px-2" onClick={handlePrevPage}>&lt;</button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                className={`btn btn-sm ${page === Number(pagination.page) ? 'btn-primary' : 'btn-white'}`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ))}
            <span className="mx-2">...</span>
            <button className="btn btn-white btn-sm" onClick={handleNextPage}>&gt;</button>
          </div>
        </div>
      </div>

      <div className="row gx-3 user-mng-stats">
        <div className="col-lg-4 col-12">
          <div className="statbox">
            <div className="statbox-title">Total Users</div>
            <div className="statbox-value">{pagination.total} <span className="statbox-change statbox-up">+12%</span></div>
          </div>
        </div>
        <div className="col-lg-4 col-6">
          <div className="statbox">
            <div className="statbox-title">Active Instructors</div>
            <div className="statbox-value">158</div>
            <div className="statbox-caption">Last 30 days</div>
          </div>
        </div>
        <div className="col-lg-4 col-6">
          <div className="statbox">
            <div className="statbox-title">Enrolled Students</div>
            <div className="statbox-value">
              2,334 
              <span className="statbox-pending">| <span className="text-danger">42 pending</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}