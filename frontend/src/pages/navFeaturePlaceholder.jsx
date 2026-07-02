import { Link } from "react-router-dom";

export default function NavFeaturePlaceholder({
  title,
  roleLabel,
  description,
  bullets = [],
  primaryLink = "/",
  primaryLabel = "Quay lại",
}) {
  return (
    <div className="nav-feature-page">
      <div className="nav-feature-header">
        <div>
          <p>{roleLabel}</p>
          <h1>{title}</h1>
          <span>{description}</span>
        </div>
        <Link to={primaryLink} className="btn btn-primary">
          {primaryLabel}
        </Link>
      </div>

      <div className="nav-feature-panel">
        <h2>Thiết kế mở rộng</h2>
        <p>
          Mục này được giữ trong sidebar để ổn định cấu trúc điều hướng. Khi cần
          triển khai chi tiết, có thể nối vào API/collection hiện có mà không đổi
          đường dẫn người dùng.
        </p>

        {bullets.length > 0 && (
          <div className="nav-feature-list">
            {bullets.map((item) => (
              <div key={item}>
                <span />
                <p>{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
