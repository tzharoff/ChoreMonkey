import { useEffect } from "react";

export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#222",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 999,
      }}
    >
      {message}
    </div>
  );
}
