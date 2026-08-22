import { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/projects", label: "Projects", icon: FolderOpen },
];

const ACCOUNT_ITEMS = [
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

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
        className="flex items-center gap-3 px-4 md:px-6"
        style={{
          height: "52px",
          borderBottom: "1px solid var(--rule)",
          background: "var(--paper)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="md:hidden flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            border: "1px solid var(--rule)",
            borderRadius: "4px",
            background: "transparent",
            color: "var(--ink-3)",
            cursor: "pointer",
            flexShrink: 0,
          }}>
          {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        <NavLink
          to="/"
          className="mr-auto"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
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
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop sidebar — always in the document at md+, absent below it */}
        <aside
          className="hidden md:flex md:flex-col md:sticky md:w-[200px]"
          style={{
            top: "52px",
            height: "calc(100vh - 52px)",
            borderRight: "1px solid var(--rule)",
            background: "var(--paper-2)",
            padding: "28px 0",
          }}>
          <SidebarContent user={user} onLogout={handleLogout} />
        </aside>

        {/* Mobile drawer — only mounted while open, so there's no hidden/mispositioned copy to fight with */}
        {mobileNavOpen && (
          <>
            <div
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 md:hidden"
              style={{ background: "rgba(20, 18, 16, 0.4)", zIndex: 90 }}
            />
            <aside
              className="fixed md:hidden flex flex-col"
              style={{
                top: "52px",
                left: 0,
                width: "220px",
                height: "calc(100vh - 52px)",
                borderRight: "1px solid var(--rule)",
                background: "var(--paper-2)",
                padding: "28px 0",
                zIndex: 95,
              }}>
              <SidebarContent user={user} onLogout={handleLogout} />
            </aside>
          </>
        )}

        {/* Main */}
        <main
          className="flex-1 px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10"
          style={{ overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, onLogout }) {
  return (
    <>
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
          {user && (
            <Link
              to={`/${user.username}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "7px 8px",
                borderRadius: "4px",
                fontSize: "13px",
                color: "var(--ink-3)",
                textDecoration: "none",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--paper-3)";
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--ink-3)";
              }}>
              <User size={14} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
              View public profile
            </Link>
          )}
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
            {user.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "4px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
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
            )}
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
            onClick={onLogout}
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
    </>
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
