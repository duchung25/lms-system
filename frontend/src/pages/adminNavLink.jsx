import { useState, useEffect } from 'react';
import useNavLink from '../hook/useNavLink';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

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
    <div className="admin-navlink-container animate-fade-in" style={{ padding: 'var(--space-xl)', maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--fs-h2)', color: 'var(--color-on-background)', marginBottom: 'var(--space-xs)' }}>
            Quản lý Menu (NavLinks)
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--fs-body-sm)' }}>
            Thêm, sửa, xóa các liên kết trên thanh điều hướng chính.
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            <FiPlus style={{ marginRight: 'var(--space-sm)' }} /> Thêm liên kết mới
          </button>
        )}
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div style={{ padding: 'var(--space-md)', backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Form Thêm/Sửa */}
      {showForm && (
        <form 
          onSubmit={handleSubmit} 
          className="animate-slide-in-right"
          style={{ 
            backgroundColor: 'var(--color-surface)', 
            padding: 'var(--space-lg)', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-level-1)',
            marginBottom: 'var(--space-xl)',
            border: '1px solid var(--color-outline-variant)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: 'var(--fs-h4)', color: 'var(--color-primary)' }}>
              {formData.id ? 'Chỉnh sửa liên kết' : 'Thêm liên kết mới'}
            </h3>
            <button type="button" className="btn-icon" onClick={handleCancel}>
              <FiX />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-label)', marginBottom: 'var(--space-xs)', fontWeight: 'var(--fw-medium)' }}>
                Tên hiển thị (Title) *
              </label>
              <input
                className="input"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Khóa học của tôi"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--fs-label)', marginBottom: 'var(--space-xs)', fontWeight: 'var(--fw-medium)' }}>
                Đường dẫn (URL) *
              </label>
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

          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
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
      <div 
        className="animate-fade-in-up--delay-1"
        style={{ 
          backgroundColor: 'var(--color-surface-container-lowest)', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden'
        }}
      >
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-surface-container)' }}>
              <tr>
                <th style={{ padding: 'var(--space-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-on-surface-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}>Tên hiển thị</th>
                <th style={{ padding: 'var(--space-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-on-surface-variant)', borderBottom: '1px solid var(--color-outline-variant)' }}>Đường dẫn (URL)</th>
                <th style={{ padding: 'var(--space-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-on-surface-variant)', borderBottom: '1px solid var(--color-outline-variant)', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {navLinks.map((link, index) => {
                const id = link._id || link.id;
                return (
                  <tr key={id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s`, borderBottom: '1px solid var(--color-outline-variant)', transition: 'background-color var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: 'var(--space-md)', fontWeight: 'var(--fw-medium)' }}>{link.title}</td>
                    <td style={{ padding: 'var(--space-md)', color: 'var(--color-primary)' }}>{link.url}</td>
                    <td style={{ padding: 'var(--space-md)', textAlign: 'right' }}>
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