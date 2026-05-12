import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMyProjects } from "../hooks/useProjects";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import { formatRelativeDate } from "../utils/dates";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useMyProjects();
  const projects = data?.projects || [];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalUpdates = projects.reduce(
    (sum, p) => sum + (p.updateCount || 0),
    0,
  );
  const activeProjects = projects.filter((p) => p.status === "active").length;

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(" ")[0]}.`}
        subtitle={`spelloutcode.com/${user?.username} · ${user?.email}`}
        actions={
          <Link to="/dashboard/projects">
            <Button size="sm">
              <Plus size={13} />
              New project
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "var(--rule)",
          border: "1px solid var(--rule)",
          borderRadius: "6px",
          overflow: "hidden",
          marginBottom: "48px",
        }}>
        {[
          { label: "Projects", value: projects.length },
          { label: "Active projects", value: activeProjects },
          { label: "Total updates", value: totalUpdates },
        ].map((s) => (
          <div
            key={s.label}
            style={{ background: "var(--paper)", padding: "20px 24px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}>
              {s.label}
            </div>
            {isLoading ? (
              <div
                className="skeleton"
                style={{ height: "32px", width: "48px", borderRadius: "3px" }}
              />
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "32px",
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}>
                {s.value}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent projects table */}
      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
            Projects
          </span>
          <Link
            to="/dashboard/projects"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--accent)",
              textDecoration: "none",
              transition: "opacity var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            Manage all →
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet."
            description="Start documenting your build."
            action={
              <Link
                to="/dashboard/projects"
                style={{ display: "inline-block", marginTop: "16px" }}>
                <Button size="sm">
                  <Plus size={13} />
                  Add first project
                </Button>
              </Link>
            }
          />
        ) : (
          <div>
            {/* Table head */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 80px 100px 72px",
                gap: "12px",
                padding: "8px 0",
                borderBottom: "1px solid var(--rule)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--ink-4)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
              <div>Project</div>
              <div>Status</div>
              <div>Updates</div>
              <div>Last updated</div>
              <div />
            </div>

            {projects.slice(0, 6).map((project) => (
              <div
                key={project._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 80px 100px 72px",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--rule)",
                  alignItems: "center",
                }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {project.title}
                </div>
                <div>
                  <StatusBadge status={project.status} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--ink-4)",
                  }}>
                  {project.updateCount || 0}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--ink-4)",
                  }}>
                  {formatRelativeDate(project.updatedAt)}
                </div>
                <div>
                  <Link
                    to={`/dashboard/projects/${project._id}/updates`}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}>
                    Updates →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
          Quick actions
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}>
          <QuickAction
            to="/dashboard/projects"
            icon={<Plus size={16} style={{ color: "var(--ink-4)" }} />}
            title="New project"
            desc="Start archiving a new build"
          />
          <QuickAction
            to={
              projects[0]
                ? `/dashboard/projects/${projects[0]._id}/updates`
                : "/dashboard/projects"
            }
            icon={<FileText size={16} style={{ color: "var(--ink-4)" }} />}
            title="Add update"
            desc="Write a progress entry"
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "16px 18px",
        border: "1px solid var(--rule)",
        borderRadius: "6px",
        textDecoration: "none",
        transition: "all var(--transition)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ink-4)";
        e.currentTarget.style.background = "var(--paper-2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--rule)";
        e.currentTarget.style.background = "transparent";
      }}>
      <div style={{ marginBottom: "6px" }}>{icon}</div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--ink)",
          marginBottom: "3px",
        }}>
        {title}
      </div>
      <div style={{ fontSize: "12px", color: "var(--ink-4)", fontWeight: 300 }}>
        {desc}
      </div>
    </Link>
  );
}

function TableSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 100px 80px 100px 72px",
            gap: "12px",
            padding: "14px 0",
            borderBottom: "1px solid var(--rule)",
            alignItems: "center",
          }}>
          <div
            className="skeleton"
            style={{ height: "13px", width: "55%", borderRadius: "2px" }}
          />
          <div
            className="skeleton"
            style={{ height: "20px", width: "60px", borderRadius: "2px" }}
          />
          <div
            className="skeleton"
            style={{ height: "13px", width: "30px", borderRadius: "2px" }}
          />
          <div
            className="skeleton"
            style={{ height: "13px", width: "60px", borderRadius: "2px" }}
          />
          <div
            className="skeleton"
            style={{ height: "13px", width: "56px", borderRadius: "2px" }}
          />
        </div>
      ))}
    </div>
  );
}
