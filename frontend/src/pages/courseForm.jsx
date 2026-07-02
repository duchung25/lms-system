import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { 
  useCreateCourse, 
  useUpdateCourse, 
  useCourseForm, 
  useCourseDetail
} from "../hook/useCourse"; 
import { useCategories } from "../hook/useCategory";
import Toast from "../components/toast/toast";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isUpdateMode = !!courseId;

  const [toast, setToast] = useState(null);
  
  const { 
    formData, 
    setFormData, 
    updateField, 
    thumbnailFile, 
    thumbnailPreview,
    setThumbnailPreview, 
    handleThumbnailChange,
    resetForm 
  } = useCourseForm();

  const { createCourse, loading: creating } = useCreateCourse();
  const { updateCourse, loading: updating } = useUpdateCourse(courseId);
  const { course, loading: fetchingCourse } = useCourseDetail(isUpdateMode ? courseId : null);
  const { categories, loading: fetchingCategories } = useCategories();
  console.log(categories);

  useEffect(() => {
    if (isUpdateMode && course) {
      const categoryId =
        course.categoryId && typeof course.categoryId === "object"
            ? course.categoryId._id
            : course.categoryId;

      setFormData({
        title: course.title || "",
        description: course.description || "",
        level: course.level || "",
        categoryId: categoryId || "", 
        price: course.price || 0,
        thumbnail: course.thumbnail || "",
      });
      setThumbnailPreview(course.thumbnail || "");
    }
  }, [isUpdateMode, course, setFormData, setThumbnailPreview]);

  const isActionLoading = creating || updating;

  async function handleSubmit(e) {
    e.preventDefault();
    let imageUrl = formData.thumbnail;

    if (thumbnailFile) {
      const cloudFormData = new FormData();
      cloudFormData.append("file", thumbnailFile);
      cloudFormData.append("upload_preset", "lms_unsigned");
      
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/df5pttdfk/image/upload", {
          method: "POST",
          body: cloudFormData,
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (err) {
        setToast({ message: "Lỗi upload ảnh: " + err.message, type: "error" });
        return; 
      }
    }

    try {
      const payload = { ...formData, thumbnail: imageUrl };
      
      if (isUpdateMode) {
        await updateCourse(payload);
        navigate(`/courses/${courseId}`);
      } else {
        await createCourse(payload);
        setToast({ message: "Tạo khóa học thành công!", type: "success" });
        resetForm(); 
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  }

  if (fetchingCourse || fetchingCategories) {
    return <div className="container py-4"><h3>Đang tải dữ liệu...</h3></div>;
  }

  return (
    <div className="container py-4 create-course-container">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
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
              value={formData.title}
              onChange={e => updateField('title', e.target.value)}
              required
            />
            <div className="form-text">Không quá 100 ký tự.</div>
          </div>
          
          <div className="mb-3">
            <label className="form-label create-course-label">Danh mục</label>
            <select
              className="form-select"
              value={formData.categoryId}
              onChange={e => updateField('categoryId', e.target.value)}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label create-course-label">Cấp độ</label>
            <select
              className="form-select"
              value={formData.level}
              onChange={e => updateField('level', e.target.value)}
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
              value={formData.price}
              onChange={e => updateField('price', +e.target.value)}
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
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
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
                  src={thumbnailPreview || "https://via.placeholder.com/160x120?text=Preview"}
                  alt="preview"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-2"
                  onChange={(e) => handleThumbnailChange(e.target.files[0])}
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
          <button 
            className="btn btn-primary create-course-btn" 
            type="submit" 
            disabled={isActionLoading}
          >
            {isActionLoading ? "Đang xử lý..." : (isUpdateMode ? "Cập nhật khóa học" : "Tạo khóa học")}
          </button>
        </div>
      </form>
    </div>
  );
}