import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useSessionExpiry } from "../hooks/useSessionExpiry";

export default function PublicLayout() {
  useSessionExpiry();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper)",
      }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
