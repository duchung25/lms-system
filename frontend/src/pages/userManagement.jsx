import { useState, useEffect } from "react";
import { useGetAllUsers, useDeleteUser, useRestoreUser, useDeactivateUser, useResetPassword } from "../hook/useAdmin.js";
import "../assets/css/pages/userManagement.css";
import { IoIosSearch, SlOptionsVertical } from "../icons";
import Toast from "../components/toast/toast.jsx";

export default function UserManagement() {
  const [toast, setToast] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAction, setShowAction] = useState(null);

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
  const { deleteUser } = useDeleteUser();
  const { restoreUser } = useRestoreUser();
  const { deactivateUser } = useDeactivateUser();
  const { resetPassword } = useResetPassword();

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

  const handleOnChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

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

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;
    try {
      await deleteUser(userId);
      setParams((prev) => ({
        ...prev,
        page: 1
      }));
      setToast({ type: "success", message: "User deleted successfully" });
      setShowAction(null);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      await restoreUser(userId);
      setParams((prev) => ({
        ...prev,
        page: 1
      }));
      setToast({ type: "success", message: "User restored successfully" });
      setShowAction(null);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await deactivateUser(userId);
      setParams((prev) => ({
        ...prev,
        page: 1
      }));
      setToast({ type: "success", message: "User deactivated successfully" });
      setShowAction(null);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;
    try {
      await resetPassword(userId, newPassword);
      setToast({ type: "success", message: "Password reset successfully" });
      setShowAction(null);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }

  const mappedUsers = (users || []).map((u) => ({
    id: u._id,
    username: u.username,
    email: u.email,
    avatar:
      u.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        u.username || "U"
      )}`,
    role:
      u.role === "student"
        ? "Student"
        : u.role === "teacher"
        ? "Instructor"
        : "Admin",
    roleType: u.role || "student",
    status: u.active ? "Active" : "Pending",
    statusType: u.active ? "active" : "pending",
    joinDate: new Date(u.createdAt).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric"
      }
    ),
    activityPercent:
      Math.floor(Math.random() * 80) + 10,
  }));

  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (error) {
    return (
      <div className="text-danger">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="user-mng-main">
        <div className="user-mng-head d-flex justify-content-between align-items-start">
          <div>
            <div className="user-mng-title1">
              User Management
            </div>
          </div>
          <div className="d-flex gap-2 position-relative">
            <button
              className="btn btn-secondary user-mng-filter"
              onClick={() => setShowFilter(!showFilter)}
            >
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
                  <select
                    className="form-select"
                    value={filter.active}
                    onChange={(e) =>
                      handleFilterChange(
                        "active",
                        e.target.value
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="true">
                      Active
                    </option>
                    <option value="false">
                      Blocked
                    </option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>Deleted</label>
                  <select
                    className="form-select"
                    value={filter.deleted}
                    onChange={(e) =>
                      handleFilterChange(
                        "deleted",
                        e.target.value
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="true">
                      Deleted
                    </option>
                    <option value="false">
                      Not Deleted
                    </option>
                  </select>
                </div>
                <div className="mb-3">
                  <label>Role</label>
                  <select
                    className="form-select"
                    value={filter.role}
                    onChange={(e) =>
                      handleFilterChange(
                        "role",
                        e.target.value
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="admin">
                      Admin
                    </option>
                    <option value="teacher">
                      Teacher
                    </option>
                    <option value="student">
                      Student
                    </option>
                  </select>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleApplyFilter}
                >
                  Apply Filter
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="search-bar d-flex align-items-center gap-2 mb-3">
          <div className="search-bar__text">
            Search:
          </div>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Enter email/username"
            value={searchInput}
            onChange={handleOnChangeSearch}
          />
          <button className="search-bar__btn btn btn-primary">
            <IoIosSearch size={22} />
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
                <th style={{ width: 110 }}>
                  Activity
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mappedUsers.map((u) => (
                <tr
                  key={u.id}
                  className="user-row"
                >
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={u.avatar}
                        alt={u.username}
                        className="avatar"
                      />
                      <div>
                        <strong>{u.username}</strong>
                        <div className="user-email">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge role-badge role-${u.roleType.toLowerCase()}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-dot status-${u.statusType.toLowerCase()}`}
                    ></span>
                    <span className="status-text">
                      {u.status}
                    </span>
                  </td>
                  <td>{u.joinDate}</td>
                  <td>
                    <div className="activity-bar-wrap">
                      <div
                        className="activity-bar"
                        style={{
                          width: `${u.activityPercent}%`
                        }}
                      ></div>
                      <span className="activity-percent">
                        {u.activityPercent}% Completion
                      </span>
                    </div>
                  </td>
                  <td className="text-end position-relative">
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() =>
                        setShowAction(
                          showAction === u.id
                            ? null
                            : u.id
                        )
                      }
                    >
                      <SlOptionsVertical />
                    </button>
                    {showAction === u.id && (
                      <div className="dropdown-menu show">
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleDeleteUser(u.id)
                          }
                        >
                          Delete
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleDeactivateUser(u.id)
                          }
                        >
                          Deactivate
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleRestoreUser(u.id)
                          }
                        >
                          Restore
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleResetPassword(u.id)
                          }
                        >
                          Reset Password
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="user-mng-paging d-flex align-items-center justify-content-between">
            <span>
              Showing {users.length} of {pagination.total} users
            </span>
            <div className="pagination pagination-sm m-0">
              <button
                className="btn btn-white btn-sm px-2"
                onClick={handlePrevPage}
              >
                &lt;
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    page === Number(pagination.page)
                      ? "btn-primary"
                      : "btn-white"
                  }`}
                  onClick={() =>
                    handlePageClick(page)
                  }
                >
                  {page}
                </button>
              ))}

              <span className="mx-2">...</span>
              <button
                className="btn btn-white btn-sm"
                onClick={handleNextPage}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}