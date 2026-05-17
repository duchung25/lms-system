import { useState, useEffect } from "react";
import { useGetProfile, useEditProfile } from "../hook/useAuth.js";
import Toast from "../components/toast/toast.jsx";
import "../assets/css/pages/myProfile.css" ;

export default function MyProfile() {
    const { profile, loading: profileLoading, error } = useGetProfile();
    const { editProfile, loading: editLoading } = useEditProfile(); 

    const [toast, setToast] = useState(null);
    const [isEditing, setIsEditing] = useState(false); 

    const [form, setForm] = useState({
        username: "",
        role: "",
        email: "",
        avatar: "",
    });
    useEffect(() => {
        if(!profile) return;
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
        if(!form.username.trim()){
            setToast({ type: "error", message: "Tên hiển thị không được để trống." });
            return;
        }
        try {
            const updatedProfile = await editProfile(form);
            setToast({ type: "success", message: "Cập nhật hồ sơ thành công!" });
            setIsEditing(false);
            setForm((prev) => ({ ...prev, ...updatedProfile }));
        } catch (err) {
            setToast({ type: "error", message: err.message || "Không thể cập nhật hồ sơ" });
        }
    };
    const handleEdit = () => {
        if(!profile) return;
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
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    if (profileLoading && !profile) {
        return (
            <main className="container profile-page">
                <div className="profile-state">Đang tải hồ sơ...</div>
            </main>
        );
    }
    if (error) {
        return (
            <main className="container profile-page">
                <div className="profile-state profile-state--error">{error}</div>
            </main>
        );
    }

    return (
        <main className="container profile-page">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        <div className="profile-header">
            <div>
            <p className="profile-eyebrow">Tài khoản</p>
            <h2 className="profile-title">Hồ sơ của tôi</h2>
            </div>
            {!isEditing && (
            <button type="button" className="btn btn-primary" onClick={handleEdit}>
                Chỉnh sửa
            </button>
            )}
        </div>

        <section className="profile-card">
            <aside className="profile-summary">
            {form.avatar ? (
                <img src={form.avatar} alt={form.username || "User avatar"} className="profile-avatar" />
            ) : (
                <div className="profile-avatar profile-avatar--placeholder" aria-label="User avatar">
                {form.username ? form.username.split(" ").map(n => n[0]).join("").toUpperCase() : "N/A"}
                </div>
            )}
            <div>
                <h3 className="profile-name">{form.username || "Chưa có tên"}</h3>
                <p className="profile-role">{form.role || "N/A"}</p>
            </div>
            </aside>

            <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-grid">
                <label className="profile-field">
                <span>Tên hiển thị</span>
                <input
                    type="text"
                    name="username"
                    className="profile-input"
                    value={form.username}
                    onChange={handleChange}
                    disabled={!isEditing || profileLoading || editLoading}
                />
                </label>

                <label className="profile-field">
                <span>Email</span>
                <input type="email" className="profile-input" value={form.email} disabled />
                </label>

                <label className="profile-field">
                <span>Vai trò</span>
                <input type="text" className="profile-input" value={form.role} disabled />
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
                    disabled={!isEditing || profileLoading || editLoading}
                />
                </label>
            </div>

            {isEditing && (
                <div className="profile-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={profileLoading || editLoading}>
                    Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={profileLoading || editLoading}>
                    {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                </div>
            )}
            </form>
        </section>
        </main>
    );
}