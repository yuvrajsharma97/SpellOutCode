import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMyProjects, useCreateProject } from "../hooks/useProjects";
import { useToast } from "../context/ToastContext";
import { projectSchema } from "../schemas";
import { parseTechStack } from "../utils/strings";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import FormField, { TextInput, TextArea, SelectInput } from "../components/ui/FormField";
import { formatRelativeDate } from "../utils/dates";

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useMyProjects();

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [selectProjectOpen, setSelectProjectOpen] = useState(false);

  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(projectSchema) });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalUpdates = projects.reduce(
    (sum, p) => sum + (p.updateCount || 0),
    0,
  );
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const onCreateProject = async (data) => {
    const payload = {
      ...data,
      techStack: parseTechStack(data.techStack),
      tags: parseTechStack(data.tags),
    };
    try {
      await createProject.mutateAsync(payload);
      addToast({ message: "Project created." });
      setCreateProjectOpen(false);
      reset({});
    } catch (err) {
      addToast({ message: err.message || "Something went wrong.", type: "error" });
    }
  };

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(" ")[0]}.`}
        subtitle={`spelloutcode.com/${user?.username} · ${user?.email}`}
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
              <div style={{ marginTop: "16px" }}>
                <Button size="sm" onClick={() => setCreateProjectOpen(true)}>
                  <Plus size={13} />
                  Add first project
                </Button>
              </div>
            }
          />
        ) : (
          <div>
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
            onClick={() => {
              reset({});
              setCreateProjectOpen(true);
            }}
            icon={<Plus size={16} style={{ color: "var(--ink-4)" }} />}
            title="New project"
            desc="Start archiving a new build"
          />
          <QuickAction
            onClick={() => setSelectProjectOpen(true)}
            icon={<FileText size={16} style={{ color: "var(--ink-4)" }} />}
            title="Add update"
            desc="Write a progress entry"
          />
        </div>
      </div>

      {/* Create project modal */}
      <Modal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        title="New project"
        width="520px">
        <form onSubmit={handleSubmit(onCreateProject)} noValidate>
          <FormField label="Title" error={errors.title?.message}>
            <TextInput
              placeholder="Auth System"
              error={errors.title?.message}
              {...register("title")}
            />
          </FormField>

          <FormField
            label="Summary"
            error={errors.summary?.message}
            hint="One-line description, shown on profile listing">
            <TextInput
              placeholder="Short description of this project"
              error={errors.summary?.message}
              {...register("summary")}
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <TextArea
              rows={3}
              placeholder="Detailed overview of what you're building…"
              error={errors.description?.message}
              {...register("description")}
            />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="Status" error={errors.status?.message}>
              <SelectInput error={errors.status?.message} {...register("status")}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </SelectInput>
            </FormField>

            <FormField label="Tech stack" error={errors.techStack?.message} hint="Comma-separated">
              <TextInput
                placeholder="React, Node.js, MongoDB"
                error={errors.techStack?.message}
                {...register("techStack")}
              />
            </FormField>
          </div>

          <FormField label="Tags" error={errors.tags?.message} hint="Comma-separated">
            <TextInput
              placeholder="open-source, api, side-project"
              error={errors.tags?.message}
              {...register("tags")}
            />
          </FormField>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <FormField label="GitHub URL" error={errors.githubUrl?.message}>
              <TextInput
                placeholder="https://github.com/…"
                error={errors.githubUrl?.message}
                {...register("githubUrl")}
              />
            </FormField>

            <FormField label="Live URL" error={errors.liveUrl?.message}>
              <TextInput
                placeholder="https://…"
                error={errors.liveUrl?.message}
                {...register("liveUrl")}
              />
            </FormField>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
            <Button variant="ghost" onClick={() => setCreateProjectOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create project →
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project picker modal for Add update */}
      <Modal
        isOpen={selectProjectOpen}
        onClose={() => setSelectProjectOpen(false)}
        title="Select a project"
        width="420px">
        {projects.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--ink-4)", marginBottom: "16px" }}>
              No projects yet. Create one first.
            </p>
            <Button
              size="sm"
              onClick={() => {
                setSelectProjectOpen(false);
                reset({});
                setCreateProjectOpen(true);
              }}>
              <Plus size={13} />
              New project
            </Button>
          </div>
        ) : (
          <div>
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => {
                  setSelectProjectOpen(false);
                  navigate(`/dashboard/projects/${project._id}/updates`);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  border: "none",
                  borderBottom: "1px solid var(--rule)",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background var(--transition)",
                  gap: "12px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--ink)",
                      marginBottom: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {project.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--ink-4)",
                    }}>
                    {project.updateCount || 0} {project.updateCount === 1 ? "update" : "updates"}
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

function QuickAction({ onClick, icon, title, desc }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "16px 18px",
        border: "1px solid var(--rule)",
        borderRadius: "6px",
        textDecoration: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
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
    </button>
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
