import { useState, useEffect } from 'react';
import useNavLink from '../hook/useNavLink';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import '../assets/css/pages/adminNavLink.css';

export default function AdminNavLink() {
  const { 
    navLinks, 
    loading, 
    error, 
    fetchAllNavLinks, 
    createNavLink, 
    updateNavLink, 
    deleteNavLink 
  } = useNavLink();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', url: '' });

  // Tải danh sách khi vào trang
  useEffect(() => {
    fetchAllNavLinks().catch(err => console.error(err));
  }, [fetchAllNavLinks]);

  // Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mở form thêm mới
  const handleAddNew = () => {
    setFormData({ id: null, title: '', url: '' });
    setShowForm(true);
  };

  // Mở form cập nhật
  const handleEdit = (link) => {
    const linkId = link._id || link.id;
    setFormData({ id: linkId, title: link.title, url: link.url });
    setShowForm(true);
  };

  // Đóng form
  const handleCancel = () => {
    setShowForm(false);
    setFormData({ id: null, title: '', url: '' });
  };

  // Xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    try {
      if (formData.id) {
        await updateNavLink(formData.id, { title: formData.title, url: formData.url });
      } else {
        await createNavLink({ title: formData.title, url: formData.url });
      }
      handleCancel(); // Đóng form và reset nếu thành công
    } catch (err) {
      console.error("Lưu thất bại:", err);
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa NavLink này không?")) {
      try {
        await deleteNavLink(id);
      } catch (err) {
        console.error("Xóa thất bại:", err);
      }
    }
  };

  return (
    <div className="admin-navlink-container animate-fade-in">
      
      {/* Header Section */}
      <div className="admin-navlink-header">
        <div className="admin-navlink-title">
          <h1>Quản lý Menu (NavLinks)</h1>
          <p>Thêm, sửa, xóa các liên kết trên thanh điều hướng chính.</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FiPlus style={{ marginRight: 'var(--space-sm)' }} /> Thêm liên kết mới
          </button>
        )}
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="alert alert-danger" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form Thêm/Sửa */}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-navlink-form animate-slide-in-right">
          <div className="admin-navlink-form-header">
            <h3>{formData.id ? 'Chỉnh sửa liên kết' : 'Thêm liên kết mới'}</h3>
            <button type="button" className="btn-icon" onClick={handleCancel}>
              <FiX />
            </button>
          </div>

          <div className="admin-navlink-form-grid">
            <div className="admin-navlink-form-group">
              <label>Tên hiển thị (Title) *</label>
              <input
                className="input"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Khóa học của tôi"
                required
              />
            </div>
            <div className="admin-navlink-form-group">
              <label>Đường dẫn (URL) *</label>
              <input
                className="input"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="VD: /courses/my-courses"
                required
              />
            </div>
          </div>

          <div className="admin-navlink-form-actions">
            <button type="button" className="btn btn-white" onClick={handleCancel} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className={`btn btn-primary ${loading ? 'is-loading' : ''}`} disabled={loading}>
              {formData.id ? 'Cập nhật' : 'Lưu liên kết'}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách NavLinks */}
      <div className="admin-navlink-table-wrap animate-fade-in-up--delay-1">
        {loading && navLinks.length === 0 ? (
          // Khung xương (Skeleton Loading) khi đang tải dữ liệu lần đầu
          <div style={{ padding: 'var(--space-lg)' }}>
            {[1, 2, 3].map(item => (
              <div key={item} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ width: '70%' }}>
                  <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
                  <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                </div>
                <div className="skeleton" style={{ width: '80px', height: '40px', borderRadius: 'var(--radius-md)' }}></div>
              </div>
            ))}
          </div>
        ) : navLinks.length === 0 ? (
          // Trạng thái trống
          <div style={{ padding: 'var(--space-3xl)', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            <p>Chưa có liên kết nào. Hãy thêm liên kết đầu tiên!</p>
          </div>
        ) : (
          // Bảng dữ liệu
          <table className="admin-navlink-table">
            <thead>
              <tr>
                <th>Tên hiển thị</th>
                <th>Đường dẫn (URL)</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {navLinks.map((link, index) => {
                const id = link._id || link.id;
                return (
                  <tr key={id} className="admin-navlink-row animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="admin-navlink-row-title">{link.title}</td>
                    <td className="admin-navlink-row-url">{link.url}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-icon btn-white btn-sm" 
                          onClick={() => handleEdit(link)}
                          title="Sửa"
                          disabled={loading}
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn btn-icon btn-sm" 
                          style={{ backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', border: 'none' }}
                          onClick={() => handleDelete(id)}
                          title="Xóa"
                          disabled={loading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}