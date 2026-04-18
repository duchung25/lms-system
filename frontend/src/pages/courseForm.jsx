    import { useEffect, useState } from "react";
    import { useAuth } from "../auth/useAuth";
    import { useNavigate, useParams } from "react-router-dom";
    import '../assets/css/pages/createCoursePage.css';

    export default function CreateCoursePage() {
        const { token } = useAuth();
        const navigate = useNavigate();
        const { courseId } = useParams();
        const isUpdateMode = !!courseId;
        const [thumbnail, setThumbnail] = useState(null);
        const [thumbnailUrl, setThumbnailUrl] = useState("");
        const [form, setForm] = useState({
        title: "",
        description: "",
        level: "",
        category: "",
        price: 0,
        });
        const [loading, setLoading] = useState(false);

        useEffect(() => {
        if (isUpdateMode) {
            setLoading(true);
            fetch(`http://localhost:5000/api/courses/${courseId}`, {
            headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                const course = data.data.course;
                setForm({
                title: course.title,
                description: course.description,
                level: course.level,
                category: course.category,
                price: course.price,
                thumbnail: course.thumbnail,
                });
                setThumbnailUrl(course.thumbnail);
                setLoading(false);
            })
            .catch(() => setLoading(false));
            }
        }, [isUpdateMode, courseId, token]);
        function handleThumbnailChange(e) {
        const file = e.target.files[0];
        if(file){
            setThumbnail(file);
            setThumbnailUrl(URL.createObjectURL(file));
        }
        }

        async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        let imageUrl = form.thumbnail;

        if (thumbnail) {
            const formData = new FormData();
            formData.append("file", thumbnail);
            formData.append("upload_preset", "lms_unsigned");
            try {
            const res = await fetch("https://api.cloudinary.com/v1_1/df5pttdfk/image/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            imageUrl = data.secure_url;
            } catch (err) {
            alert("Lỗi upload ảnh: " + err.message);
            return;
            }
        }

        try {
            let apiUrl = "http://localhost:5000/api/courses";
            let method = "POST";
            if (isUpdateMode) {
            apiUrl += `/${courseId}`;
            method = "PATCH";
            }
            const res = await fetch(apiUrl, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    thumbnail: imageUrl,
                }),
            });
            await res.json();
            if(isUpdateMode){
                alert("Cập nhật khóa học thành công!");
            } else {
                alert("Tạo khóa học thành công!");
            }
            setForm({
                title: "",
                description: "",
                level: "",
                category: "",
                price: 0,
            });
            setThumbnail(null);
            setThumbnailUrl("");
            navigate("/courses/my-courses");
        } catch (err) {
            alert("Lỗi tạo khóa học: " + err.message);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <div className="container py-4"><h3>Loading...</h3></div>;

         return (
            <div className="container py-4 create-course-container">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="m-0 create-course-title">
                {isUpdateMode ? "Chỉnh sửa khóa học" : "Thêm khóa học"}
                </h3>
                <button className="btn btn-outline-primary" type="button">Xem tài liệu hướng dẫn</button>
            </div>
            <ul className="nav nav-tabs mb-3 create-course-tabs">
                <li className="nav-item">
                <span className="nav-link active" aria-current="page">Thông tin khóa học</span>
                </li>
            </ul>

            <form className="row g-4 create-course-form" onSubmit={handleSubmit}>
                <div className="col-md-6">
                <div className="mb-3">
                    <label className="form-label create-course-label">Tên khóa học</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên khóa học"
                    maxLength={100}
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                    />
                    <div className="form-text">Không quá 100 ký tự.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label create-course-label">Danh mục</label>
                    <select
                    className="form-select"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    required
                    >
                    <option value="">-- Chọn --</option>
                    <option value="Programming">Lập trình</option>
                    <option value="Design">Thiết kế</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Kinh doanh</option>
                    <option value="Other">Khác</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label create-course-label">Cấp độ</label>
                    <select
                    className="form-select"
                    value={form.level}
                    onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                    required
                    >
                    <option value="">-- Chọn --</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label create-course-label">Giá (VNĐ)</label>
                    <input
                    type="number"
                    className="form-control"
                    min={0}
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                    required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label create-course-label">Mô tả</label>
                    <textarea
                    className="form-control"
                    rows={3}
                    maxLength={250}
                    placeholder="Mô tả ngắn gọn"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                    />
                    <div className="form-text">Không quá 250 ký tự.</div>
                </div>
                </div>

                <div className="col-md-6">
                <label className="form-label create-course-label">Ảnh thumbnail khóa học</label>
                <div className="row g-2">
                    <div className="col-12">
                    <div className="thumbnail-upload-box">
                        <img
                        src={
                            thumbnailUrl
                            ? thumbnailUrl
                            : (form.thumbnail || "https://via.placeholder.com/160x120?text=Preview")
                        }
                        alt="preview"
                        />
                        <input
                        type="file"
                        accept="image/*"
                        className="form-control mt-2"
                        onChange={handleThumbnailChange}
                        style={{ maxWidth: 260 }}
                        />
                        <small className="text-muted text-center d-block mt-1">
                        Chọn hoặc kéo thả ảnh tại đây
                        </small>
                    </div>
                    </div>
                </div>
                <div className="form-text mt-2">
                    Ảnh nên rõ nét, đúng kích thước chuẩn, dung lượng dưới 2MB. <br />
                    Nên sử dụng ảnh ngang tỉ lệ 4:3.
                </div>
                </div>

                <div className="col-12 text-end">
                <button className="btn btn-primary create-course-btn" type="submit">
                    {isUpdateMode ? "Cập nhật khóa học" : "Tạo khóa học"}
                </button>
                </div>
            </form>
            </div>
        );
    }