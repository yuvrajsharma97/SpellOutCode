import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import {
  useMyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects"
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { projectSchema } from "../schemas";
import { parseTechStack } from "../utils/strings";
import { formatRelativeDate } from "../utils/dates";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmationDialog from "..Button/components/ui/ConfirmationDialog";
import FormField, {
  TextInput,
  TextArea,
  SelectInput,
} from "../components/ui/FormField";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";

export default function DashboardProjectsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data, isLoading } = useMyProjects();
  const projects = data?.projects || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(projectSchema) });

  const openCreate = () => {
    setEditingProject(null);
    reset({});
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      summary: project.summary || "",
      description: project.description || "",
      status: project.status,
      techStack: project.techStack?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      techStack: parseTechStack(data.techStack),
    };

    try {
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject._id, payload });
        addToast({ message: "Project updated." });
      } else {
        await createProject.mutateAsync(payload);
        addToast({ message: "Project created." });
      }
      setModalOpen(false);
      reset({});
    } catch (err) {
      addToast({
        message: err.message || "Something went wrong.",
        type: "error",
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteProject.mutateAsync(deletingProject._id);
      addToast({ message: "Project deleted." });
      setDeletingProject(null);
    } catch (err) {
      addToast({
        message: err.message || "Failed to delete project.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Manage your project archives"
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={13} />
            New project
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet."
          description="Start documenting your first build."
          action={
            <div style={{ marginTop: "16px" }}>
              <Button size="sm" onClick={openCreate}>
                <Plus size={13} />
                Add first project
              </Button>
            </div>
          }
        />
      ) : (
        <div>
          {/* Table head */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 70px 100px 120px",
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
            <div>Updated</div>
            <div />
          </div>

          {projects.map((project) => (
            <div
              key={project._id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 70px 100px 120px",
                gap: "12px",
                padding: "14px 0",
                borderBottom: "1px solid var(--rule)",
                alignItems: "center",
              }}>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: "2px",
                  }}>
                  {project.title}
                </div>
                {project.summary && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--ink-4)",
                      fontWeight: 300,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "340px",
                    }}>
                    {project.summary}
                  </div>
                )}
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
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}>
                <Link
                  to={`/dashboard/projects/${project._id}/updates`}
                  title="Manage updates"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    color: "var(--ink-4)",
                    textDecoration: "none",
                    borderRadius: "3px",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ink)";
                    e.currentTarget.style.background = "var(--paper-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <FileText size={14} />
                </Link>
                <a
                  href={`/${user?.username}/projects/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View public page"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    color: "var(--ink-4)",
                    textDecoration: "none",
                    borderRadius: "3px",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ink)";
                    e.currentTarget.style.background = "var(--paper-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => openEdit(project)}
                  title="Edit project"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    color: "var(--ink-4)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "3px",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ink)";
                    e.currentTarget.style.background = "var(--paper-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeletingProject(project)}
                  title="Delete project"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    color: "var(--ink-4)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "3px",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--danger)";
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit project" : "New project"}
        width="520px">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
            <FormField label="Status" error={errors.status?.message}>
              <SelectInput
                error={errors.status?.message}
                {...register("status")}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </SelectInput>
            </FormField>

            <FormField
              label="Tech stack"
              error={errors.techStack?.message}
              hint="Comma-separated">
              <TextInput
                placeholder="React, Node.js, MongoDB"
                error={errors.techStack?.message}
                {...register("techStack")}
              />
            </FormField>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
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

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}>
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingProject ? "Save changes" : "Create project"} →
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={onDelete}
        title="Delete project?"
        description={`"${deletingProject?.title}" and all its updates will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete project"
        isLoading={deleteProject.isPending}
      />
    </div>
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
            gridTemplateColumns: "1fr 100px 70px 100px 120px",
            gap: "12px",
            padding: "14px 0",
            borderBottom: "1px solid var(--rule)",
            alignItems: "center",
          }}>
          <div>
            <div
              className="skeleton"
              style={{
                height: "13px",
                width: "45%",
                borderRadius: "2px",
                marginBottom: "6px",
              }}
            />
            <div
              className="skeleton"
              style={{ height: "11px", width: "70%", borderRadius: "2px" }}
            />
          </div>
          <div
            className="skeleton"
            style={{ height: "20px", width: "60px", borderRadius: "2px" }}
          />
          <div
            className="skeleton"
            style={{ height: "13px", width: "24px", borderRadius: "2px" }}
          />
          <div
            className="skeleton"
            style={{ height: "13px", width: "60px", borderRadius: "2px" }}
          />
          <div
            style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="skeleton"
                style={{ height: "24px", width: "24px", borderRadius: "3px" }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
