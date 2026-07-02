import { useState, useEffect, useRef } from "react";
import { useGetProfile, useEditProfile } from "../hook/useAuth.js";
import Toast from "../components/toast/toast.jsx";

export default function MyProfile() {
    // Sử dụng nguyên bản các custom hook hệ thống của bạn
    const { profile, loading: profileLoading, error } = useGetProfile();
    const { editProfile, loading: editLoading } = useEditProfile();

    const [toast, setToast] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Quản lý file ảnh nhị phân và link blob để hiển thị preview instant
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        username: "",
        role: "",
        email: "",
    });

    // Đồng bộ dữ liệu từ hook profile vào form state
    useEffect(() => {
        if (!profile) return;

        setForm({
            username: profile.username || "",
            role: profile.role || "",
            email: profile.email || "",
        });
        setAvatarPreview(profile.avatar || "");
        setAvatarFile(null);
    }, [profile]);

    // Xử lý thay đổi dữ liệu chữ trong các ô input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý khi chọn file ảnh mới và tạo link ảo preview ngắn hạn
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setToast({ type: "error", message: "Kích thước ảnh không được vượt quá 2MB." });
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); 
        }
    };

    // ĐÓNG GÓI FORMDATA GỬI QUA HOOK (Xử lý dứt điểm lỗi Cast Object của Mongoose)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        if (!form.username.trim()) {
            setToast({ type: "error", message: "Tên hiển thị không được để trống." });
            return;
        }

        try {
            // Khởi tạo FormData đóng gói dữ liệu đa phần (Multipart)
            const formData = new FormData();
            formData.append("username", form.username);
            
            if (avatarFile) {
                // Nếu có file mới được chọn, append đối tượng File thực tế lên
                formData.append("avatar", avatarFile);
            } else {
                // Nếu không đổi ảnh, truyền lại chuỗi string url cũ
                formData.append("avatar", avatarPreview);
            }

            // Gửi formData qua hook editProfile của bạn
            const updatedProfile = await editProfile(formData);

            setToast({ type: "success", message: "Cập nhật hồ sơ thành công!" });
            setIsEditing(false);

            if (updatedProfile) {
                setForm((prev) => ({ ...prev, ...updatedProfile }));
                if (updatedProfile.avatar) setAvatarPreview(updatedProfile.avatar);
                setAvatarFile(null);
            }
        } catch (err) {
            setToast({
                type: "error",
                message: err.message || "Không thể cập nhật hồ sơ",
            });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setToast(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setAvatarFile(null);
        if (profile) {
            setForm({
                username: profile.username || "",
                role: profile.role || "",
                email: profile.email || "",
            });
            setAvatarPreview(profile.avatar || "");
        }
        setToast(null);
    };

    // Giữ nguyên hàm tạo Avatar mặc định bằng chữ của bạn
    const getInitials = (name) => {
        if (!name) return "N/A";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    // Màn hình Loading đi kèm class layout hệ thống mới
    if (profileLoading && !profile) {
        return (
            <main className="profile-container">
                <div className="profile-state">Đang tải hồ sơ của bạn...</div>
            </main>
        );
    }

    // Màn hình báo lỗi đi kèm class layout hệ thống mới
    if (error) {
        return (
            <main className="profile-container">
                <div className="profile-state profile-state--error">{error}</div>
            </main>
        );
    }

    return (
        <main className="profile-container">
            {/* Sử dụng component Toast nguyên bản của bạn */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="profile-card-layout">
                {/* ================= CỘT TRÁI: SIDEBAR (AVATAR & INFO) ================= */}
                <aside className="profile-sidebar">
                    <div className="avatar-wrapper">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt={form.username || "User avatar"}
                                className="profile-avatar-img"
                            />
                        ) : (
                            <div className="profile-avatar-fallback">
                                {getInitials(form.username)}
                            </div>
                        )}

                        {/* Nút Camera nổi lên ở góc phải khi bấm Chỉnh sửa */}
                        {isEditing && (
                            <label className="avatar-edit-badge" htmlFor="avatar-upload" title="Thay đổi ảnh đại diện">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </label>
                        )}
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            disabled={!isEditing || editLoading}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className="sidebar-info">
                        <h3 className="user-fullname">{form.username || "Chưa đặt tên"}</h3>
                        <span className={`role-tag role-tag--${form.role?.toLowerCase()}`}>
                            {form.role === "admin" ? "Quản trị viên" : form.role === "teacher" ? "Giảng viên" : form.role || "Thành viên"}
                        </span>
                    </div>
                </aside>

                {/* ================= CỘT PHẢI: FORM NỘI DUNG CHÍNH ================= */}
                <section className="profile-main-content">
                    <div className="content-header">
                        <div>
                            <span className="subtitle">Tài khoản</span>
                            <h2 className="title">Thông tin cá nhân</h2>
                        </div>
                        {!isEditing && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleEdit}
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="modern-form">
                        <div className="form-grid">
                            {/* Trường: Tên hiển thị */}
                            <div className="form-group">
                                <label htmlFor="username">Tên hiển thị</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={form.username}
                                    onChange={handleChange}
                                    disabled={!isEditing || editLoading}
                                    placeholder="Nhập tên hiển thị"
                                />
                            </div>

                            {/* Trường: Địa chỉ Email (Read-only) */}
                            <div className="form-group">
                                <label htmlFor="email">Địa chỉ Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control disabled-input"
                                    value={form.email}
                                    disabled
                                />
                            </div>

                            {/* Trường: Vai trò hệ thống (Read-only) */}
                            <div className="form-group">
                                <label htmlFor="role">Vai trò hệ thống</label>
                                <input
                                    id="role"
                                    type="text"
                                    className="form-control disabled-input"
                                    value={form.role ? form.role.toUpperCase() : ""}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Cụm nút hành động dưới chân form chỉ mở ra khi bấm edit */}
                        {isEditing && (
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleCancel}
                                    disabled={editLoading}
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-save"
                                    disabled={editLoading}
                                >
                                    {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        )}
                    </form>
                </section>
            </div>
        </main>
    );
}