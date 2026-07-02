import { useEffect, useMemo, useState } from "react";
import {
  FiEdit2,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import Toast from "../components/toast/toast.jsx";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  useUpdateCategoryStatus,
} from "../hook/useCategory.js";

const PAGE_SIZE = 8;

const EMPTY_FORM = {
  id: null,
  name: "",
  description: "",
  image: "",
  status: "ACTIVE",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const normalizeText = (value = "") => value.toLowerCase().trim();

function CategoryManagementContent({ onRefresh, onToast }) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const { createCategory, loading: creating } = useCreateCategory();
  const { updateCategory, loading: updating } = useUpdateCategory();
  const { deleteCategory, loading: deleting } = useDeleteCategory();
  const { updateCategoryStatus, loading: updatingStatus } = useUpdateCategoryStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isBusy = creating || updating || deleting || updatingStatus;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filteredCategories = useMemo(() => {
    const keyword = normalizeText(search);

    return (categories || []).filter((category) => {
      const matchesKeyword =
        !keyword ||
        normalizeText(category.name).includes(keyword) ||
        normalizeText(category.slug).includes(keyword) ||
        normalizeText(category.description).includes(keyword);

      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const currentItems = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openCreateForm = () => {
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setFormData({
      id: category._id,
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
      status: category.status || "ACTIVE",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      status: formData.status,
    };

    if (payload.name.length < 3) {
      onToast({ type: "error", message: "Tên danh mục phải có ít nhất 3 ký tự." });
      return;
    }

    try {
      if (formData.id) {
        await updateCategory(formData.id, payload);
        onToast({ type: "success", message: "Cập nhật danh mục thành công." });
      } else {
        await createCategory(payload);
        onToast({ type: "success", message: "Tạo danh mục thành công." });
      }

      closeForm();
      onRefresh();
    } catch (error) {
      onToast({ type: "error", message: error.message });
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) return;

    try {
      await deleteCategory(category._id);
      onToast({ type: "success", message: "Xóa danh mục thành công." });
      onRefresh();
    } catch (error) {
      onToast({ type: "error", message: error.message });
    }
  };

  const handleToggleStatus = async (category) => {
    const nextStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await updateCategoryStatus(category._id, { status: nextStatus });
      onToast({ type: "success", message: `Đã chuyển trạng thái thành ${nextStatus}.` });
      onRefresh();
    } catch (error) {
      onToast({ type: "error", message: error.message });
    }
  };

  if (categoriesLoading && categories.length === 0) {
    return <div className="category-page loading-state">Đang tải danh mục...</div>;
  }

  if (categoriesError) {
    return <div className="category-page error-state">{categoriesError}</div>;
  }

  return (
    <div className="category-page animate-fade-in">
      <div className="category-header">
        <div>
          <h1 className="category-title">Quản lý danh mục</h1>
          <p className="category-subtitle">
            Thêm, sửa, xóa và quản lý các danh mục khóa học.
          </p>
        </div>

        <div className="category-header-actions">
          <button
            type="button"
            className="btn btn-white category-action-btn"
            onClick={onRefresh}
            disabled={categoriesLoading || isBusy}
          >
            <FiRefreshCw /> Làm mới
          </button>

          <button
            type="button"
            className="btn btn-primary category-action-btn"
            onClick={openCreateForm}
            disabled={isBusy}
          >
            <FiPlus /> Thêm danh mục
          </button>
        </div>
      </div>

      <div className="category-toolbar">
        <div className="category-search">
          <FiSearch className="category-search-icon" />
          <input
            type="text"
            className="category-search-input"
            placeholder="Tìm theo tên, slug hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="category-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {showForm && (
      <form className="category-form" onSubmit={handleSubmit}>
        <div className="category-form-header">
          <div>
            <h3>{formData.id ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</h3>
            <p>Slug sẽ được sinh tự động từ tên danh mục.</p>
          </div>
          <button type="button" className="category-icon-button" onClick={closeForm}>
            <FiX />
          </button>
        </div>

        <div className="category-form-content">
          <div className="category-form-left">
            <div className="category-field">
              <label>Tên danh mục <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                maxLength={50}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Lập trình web"
                required
              />
            </div>

            <div className="category-field">
              <label>Trạng thái</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="category-field">
              <label>Mô tả</label>
              <textarea
                className="form-control"
                rows={5}
                maxLength={500}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả ngắn gọn về danh mục..."
              />
            </div>
          </div>

          {/* Bên phải - Upload ảnh + Preview (45%) */}
          <div className="category-form-right">
            <label className="form-label">Ảnh đại diện danh mục</label>
            
            <div className="thumbnail-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({ ...prev, image: previewUrl, imageFile: file }));
                  }
                }}
                className="form-control"
              />
              
              <div className="category-preview-image mt-3">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" />
                ) : (
                  <div className="category-preview-placeholder">
                    <FiImage size={40} />
                    <p>Chưa có ảnh</p>
                  </div>
                )}
              </div>
            </div>

            <small className="text-muted">
              Nên dùng ảnh vuông hoặc ngang, dung lượng dưới 2MB
            </small>
          </div>
        </div>

        <div className="category-form-actions">
          <button type="button" className="btn btn-white" onClick={closeForm} disabled={isBusy}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={isBusy}>
            {formData.id ? "Cập nhật" : "Tạo danh mục"}
          </button>
        </div>
      </form>
    )}

      {/* Bảng danh sách */}
      <div className="category-table-card">
        <div className="category-table-header">
          <div>
            <h3>Danh sách danh mục</h3>
            <p>Hiển thị {currentItems.length} / {filteredCategories.length} kết quả</p>
          </div>
        </div>

        <div className="category-table-wrap">
          <table className="table category-table">
            <thead>
              <tr>
                <th>Danh mục</th>
                <th>Slug</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Không tìm thấy danh mục phù hợp.
                  </td>
                </tr>
              ) : (
                currentItems.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <div className="category-row-title">
                        <div className="category-row-image">
                          {category.image ? (
                            <img src={category.image} alt={category.name} />
                          ) : (
                            <span>{category.name?.charAt(0)?.toUpperCase() || "#"}</span>
                          )}
                        </div>
                        <div>
                          <strong>{category.name}</strong>
                          <p>{category.description || "Chưa có mô tả."}</p>
                        </div>
                      </div>
                    </td>
                    <td><code className="category-slug">{category.slug}</code></td>
                    <td>
                      <button
                        type="button"
                        className={`category-status-toggle ${category.status === "ACTIVE" ? "active" : "inactive"}`}
                        onClick={() => handleToggleStatus(category)}
                        disabled={isBusy}
                      >
                        {category.status}
                      </button>
                    </td>
                    <td>{formatDate(category.createdAt)}</td>
                    <td>
                      <div className="category-row-actions">
                        <button
                          type="button"
                          className="category-icon-button"
                          onClick={() => openEditForm(category)}
                          disabled={isBusy}
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          className="category-icon-button danger"
                          onClick={() => handleDelete(category)}
                          disabled={isBusy}
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="category-pagination">
          <span>Trang {currentPage} / {totalPages}</span>
          <div className="category-pagination-actions">
            <button
              type="button"
              className="btn btn-white btn-sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            <button
              type="button"
              className="btn btn-white btn-sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {(categoriesLoading) && <div className="category-loading-hint">Đang tải...</div>}
    </div>
  );
}

export default function CategoryManagementPage() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [toast, setToast] = useState(null);

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <CategoryManagementContent
        key={refreshToken}
        onRefresh={() => setRefreshToken((v) => v + 1)}
        onToast={setToast}
      />
    </>
  );
}