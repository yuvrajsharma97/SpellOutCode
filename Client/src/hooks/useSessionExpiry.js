import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export function useSessionExpiry() {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = async () => {
      await logout().catch(() => {});
      addToast({
        message: "Your session has expired. Please sign in again.",
        type: "info",
        duration: 5000,
      });
      navigate("/login");
    };

    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, [logout, addToast, navigate]);
}
