import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/projects", label: "Projects", icon: FolderOpen },
  { to: "/dashboard/updates", label: "Updates", icon: FileText },
];

const ACCOUNT_ITEMS = [
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      addToast({ message: "Failed to sign out. Try again.", type: "error" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper)",
      }}>
      {/* Top bar */}
      <header
        style={{
          height: "52px",
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "0",
          background: "var(--paper)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
        <NavLink
          to="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginRight: "auto",
          }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#2563a8",
              display: "inline-block",
            }}
          />
          SpellOutCode
        </NavLink>

        {user && (
          <a
            href={`/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-4)",
              transition: "color var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ink-4)")
            }>
            /{user.username}
            <ExternalLink size={11} />
          </a>
        )}
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "200px",
            borderRight: "1px solid var(--rule)",
            background: "var(--paper-2)",
            padding: "28px 0",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: "52px",
            height: "calc(100vh - 52px)",
          }}>
          <nav
            style={{
              flex: 1,
              padding: "0 12px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}>
            <SidebarSection label="Workspace">
              {NAV_ITEMS.map((item) => (
                <SidebarItem key={item.to} {...item} />
              ))}
            </SidebarSection>

            <SidebarSection label="Account" style={{ marginTop: "auto" }}>
              {ACCOUNT_ITEMS.map((item) => (
                <SidebarItem key={item.to} {...item} />
              ))}
            </SidebarSection>
          </nav>

          {/* User + Logout */}
          {user && (
            <div
              style={{
                padding: "16px 16px 0",
                borderTop: "1px solid var(--rule)",
                marginTop: "16px",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "4px",
                    background: "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--paper)",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}>
                  {user.name?.slice(0, 2).toUpperCase() ||
                    user.username?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--ink)",
                      lineHeight: 1.3,
                    }}>
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--ink-4)",
                    }}>
                    @{user.username}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 8px",
                  borderRadius: "4px",
                  border: "none",
                  background: "transparent",
                  fontSize: "12px",
                  color: "var(--ink-4)",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "all var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--paper-3)";
                  e.currentTarget.style.color = "var(--danger)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--ink-4)";
                }}>
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "40px 48px", overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarSection({ label, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--ink-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "0 8px",
          marginBottom: "4px",
        }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function SidebarItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "7px 8px",
        borderRadius: "4px",
        fontSize: "13px",
        color: isActive ? "var(--ink)" : "var(--ink-3)",
        fontWeight: isActive ? 500 : 400,
        background: isActive ? "var(--paper)" : "transparent",
        transition: "all 0.12s",
        textDecoration: "none",
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.dataset.active) {
          e.currentTarget.style.background = "var(--paper-3)";
          e.currentTarget.style.color = "var(--ink)";
        }
      }}
      onMouseLeave={(e) => {
        const isActive =
          e.currentTarget.getAttribute("aria-current") === "page";
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--ink-3)";
        }
      }}>
      <Icon size={14} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
      {label}
    </NavLink>
  );
}
