import { useEffect } from "react";

export default function Toast({ message, type = "error", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [message, duration, onClose]); // ✅ Giữ dependency nhưng không tạo handleClose

  if (!message) return null;

  return (
    <div 
      className={`app-toast app-toast-${type}`}
      style={{ 
        position: "fixed", 
        top: 20, 
        right: 20, 
        zIndex: 9999
      }}
    >
      <span>{message}</span>
      <button 
        onClick={() => onClose?.()} 
        className="app-toast-close"
      >
        ×
      </button>
    </div>
  );
}
