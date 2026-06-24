import { useState, useEffect } from "react";
import { useGetProfile, useEditProfile } from "../hook/useAuth.js";
import { useAuth } from "../auth/useAuth.js";
import Toast from "../components/toast/toast.jsx";

export default function MyProfile() {
    const { profile, loading: profileLoading, error } = useGetProfile();
    const { editProfile, loading: editLoading } = useEditProfile();
    const { user } = useAuth();

    const [toast, setToast] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        username: "",
        role: "",
        email: "",
        avatar: "",
    });

    useEffect(() => {
        if (!profile) return;

        setForm({
            username: profile.username || "",
            role: profile.role || "",
            email: profile.email || "",
            avatar: profile.avatar || "",
        });
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        if (!form.username.trim()) {
            setToast({
                type: "error",
                message: "Tên hiển thị không được để trống.",
            });
            return;
        }

        try {
            const updatedProfile = await editProfile(form);

            setToast({
                type: "success",
                message: "Cập nhật hồ sơ thành công!",
            });

            setIsEditing(false);

            setForm((prev) => ({
                ...prev,
                ...updatedProfile,
            }));
        } catch (err) {
            setToast({
                type: "error",
                message: err.message || "Không thể cập nhật hồ sơ",
            });
        }
    };

    const handleEdit = () => {
        if (!profile) return;

        setForm({
            username: profile.username || "",
            role: profile.role || "",
            email: profile.email || "",
            avatar: profile.avatar || "",
        });

        setIsEditing(true);
        setToast(null);
    };

    const handleCancel = () => {
        setIsEditing(false);

        if (profile) {
            setForm({
                username: profile.username || "",
                role: profile.role || "",
                email: profile.email || "",
                avatar: profile.avatar || "",
            });
        }

        setToast(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (profileLoading && !profile) {
        return (
            <main className="container profile-page">
                <div className="profile-state">
                    Đang tải hồ sơ...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="container profile-page">
                <div className="profile-state profile-state--error">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="container profile-page">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="profile-header">
                <div>
                    <p className="profile-eyebrow">Tài khoản</p>
                    <h2 className="profile-title">
                        Hồ sơ của tôi
                    </h2>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </button>
                )}
            </div>

            <section className="profile-card">
                <aside className="profile-summary">
                    {form.avatar ? (
                        <img
                            src={form.avatar}
                            alt={form.username || "User avatar"}
                            className="profile-avatar"
                        />
                    ) : (
                        <div
                            className="profile-avatar profile-avatar--placeholder"
                            aria-label="User avatar"
                        >
                            {form.username
                                ? form.username
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                : "N/A"}
                        </div>
                    )}

                    <div>
                        <h3 className="profile-name">
                            {form.username || "Chưa có tên"}
                        </h3>

                        <span
                            className={`role-badge role-${form.role}`}
                        >
                            {form.role || "N/A"}
                        </span>
                    </div>
                </aside>

                <form
                    className="profile-form"
                    onSubmit={handleSubmit}
                >
                    <h4 className="profile-section-title">
                        Thông tin cá nhân
                    </h4>

                    <div className="profile-grid">
                        <label className="profile-field">
                            <span>Tên hiển thị</span>

                            <input
                                type="text"
                                name="username"
                                className="profile-input"
                                value={form.username}
                                onChange={handleChange}
                                disabled={
                                    !isEditing ||
                                    profileLoading ||
                                    editLoading
                                }
                            />
                        </label>

                        <label className="profile-field">
                            <span>Email</span>

                            <input
                                type="email"
                                className="profile-input"
                                value={form.email}
                                disabled
                            />
                        </label>

                        <label className="profile-field">
                            <span>Vai trò</span>

                            <input
                                type="text"
                                className="profile-input"
                                value={form.role}
                                disabled
                            />
                        </label>

                        <label className="profile-field profile-field--wide">
                            <span>Ảnh đại diện URL</span>

                            <input
                                type="url"
                                name="avatar"
                                className="profile-input"
                                value={form.avatar}
                                onChange={handleChange}
                                placeholder="https://example.com/avatar.jpg"
                                disabled={
                                    !isEditing ||
                                    profileLoading ||
                                    editLoading
                                }
                            />
                        </label>
                    </div>

                    {isEditing && (
                        <div className="profile-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={
                                    profileLoading ||
                                    editLoading
                                }
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    profileLoading ||
                                    editLoading
                                }
                            >
                                {editLoading
                                    ? "Đang lưu..."
                                    : "Lưu thay đổi"}
                            </button>
                        </div>
                    )}
                </form>
            </section>

            <section className="profile-card">
                <h4 className="profile-section-title">
                    Bảo mật
                </h4>

                <p className="profile-description">
                    Quản lý mật khẩu tài khoản của bạn.
                </p>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() =>
                        setToast({
                            type: "info",
                            message:
                                "Tính năng đổi mật khẩu sẽ được triển khai sau.",
                        })
                    }
                >
                    Đổi mật khẩu
                </button>
            </section>

            {user?.role === "student" && (
                <section className="profile-card">
                    <h4 className="profile-section-title">
                        Trở thành giảng viên
                    </h4>

                    <p className="profile-description">
                        Gửi yêu cầu nâng cấp tài khoản để
                        tạo khóa học và giảng dạy trên hệ
                        thống.
                    </p>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() =>
                            setToast({
                                type: "info",
                                message:
                                    "Tính năng đăng ký giảng viên sẽ được triển khai sau.",
                            })
                        }
                    >
                        Đăng ký giảng dạy
                    </button>
                </section>
            )}
        </main>
    );
}