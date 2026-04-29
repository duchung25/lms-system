export default function Footer() {
  return (
    <footer className="border-top bg-white">
      <div className="container py-3">
        <div className="d-flex flex-wrap gap-2 justify-content-between text-muted">
          <div>© {new Date().getFullYear()} LMS</div>
          <div className="d-flex gap-3">
            <span>Contact</span>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}