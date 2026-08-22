import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, ArrowLeft, Globe, EyeOff } from "lucide-react";
import {
  useMyUpdates,
  useCreateUpdate,
  useUpdateUpdate,
  useDeleteUpdate,
} from "../hooks/useUpdates";
import { useMyProjects } from "../hooks/useProjects";
import { useToast } from "../context/ToastContext";
import { updateSchema } from "../schemas";
import { stripHtml, truncate } from "../utils/strings";
import { formatDate, formatRelativeDate } from "../utils/dates";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import FormField, { TextInput, SelectInput } from "../components/ui/FormField";
import UpdateEditor from "../components/update/UpdateEditor";
import EmptyState from "../components/ui/EmptyState";

const TAG_OPTIONS = [
  "",
  "milestone",
  "blocker",
  "decision",
  "learning",
  "kickoff",
  "note",
];

export default function DashboardUpdatesPage() {
  const { projectId } = useParams();
  const { addToast } = useToast();

  const { data: projects } = useMyProjects();
  const project = projects?.find((p) => p._id === projectId);

  const { data: updates = [], isLoading } = useMyUpdates(projectId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [deletingUpdate, setDeletingUpdate] = useState(null);

  const createUpdate = useCreateUpdate(projectId);
  const updateUpdate = useUpdateUpdate();
  const deleteUpdate = useDeleteUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: { title: "", summary: "", content: "", tag: "", published: false },
  });

  const openCreate = () => {
    setEditingUpdate(null);
    reset({ title: "", summary: "", content: "", tag: "", published: false });
    setModalOpen(true);
  };

  const openEdit = (update) => {
    setEditingUpdate(update);
    reset({
      title: update.title,
      summary: update.summary || "",
      content: update.content,
      tag: update.tags?.[0] || "",
      published: update.published || false,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      summary: data.summary,
      content: data.content,
      tags: data.tag ? [data.tag] : [],
      published: data.published,
    };
    try {
      if (editingUpdate) {
        await updateUpdate.mutateAsync({
          id: editingUpdate._id,
          payload,
          projectId,
        });
        addToast({ message: data.published ? "Update published." : "Draft saved." });
      } else {
        await createUpdate.mutateAsync(payload);
        addToast({ message: data.published ? "Update published." : "Draft saved." });
      }
      setModalOpen(false);
      reset({ title: "", summary: "", content: "", tag: "", published: false });
    } catch (err) {
      addToast({
        message: err.message || "Something went wrong.",
        type: "error",
      });
    }
  };

  const onDelete = async () => {
    try {
      await deleteUpdate.mutateAsync({ id: deletingUpdate._id, projectId });
      addToast({ message: "Update deleted." });
      setDeletingUpdate(null);
    } catch (err) {
      addToast({ message: err.message || "Failed to delete.", type: "error" });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "8px" }}>
        <Link
          to="/dashboard/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-4)",
            textDecoration: "none",
            transition: "color var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-4)")}>
          <ArrowLeft size={12} />
          All projects
        </Link>
      </div>

      <PageHeader
        eyebrow={project?.title || "Project"}
        title="Update log"
        subtitle={`${updates.length} ${updates.length === 1 ? "entry" : "entries"}`}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={13} />
            Add update
          </Button>
        }
      />

      {isLoading ? (
        <UpdateListSkeleton />
      ) : updates.length === 0 ? (
        <EmptyState
          title="No updates yet."
          description="Document your first progress entry for this project."
          action={
            <div style={{ marginTop: "16px" }}>
              <Button size="sm" onClick={openCreate}>
                <Plus size={13} />
                Add first update
              </Button>
            </div>
          }
        />
      ) : (
        <div>
          {updates.map((update, idx) => (
            <div
              key={update._id}
              className="flex flex-col gap-2 py-4 md:grid md:gap-6 md:py-[18px] md:items-start"
              style={{
                gridTemplateColumns: "120px 1fr auto",
                borderTop: "1px solid var(--rule)",
              }}>
              <div style={{ paddingTop: "2px" }} className="flex items-center gap-2 md:block">
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--ink-4)",
                    letterSpacing: "0.02em",
                    marginBottom: "6px",
                  }}>
                  {formatDate(update.createdAt)}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    padding: "1px 6px",
                    borderRadius: "2px",
                    letterSpacing: "0.03em",
                    background: update.published ? "#dcf5e8" : "var(--paper-3)",
                    color: update.published ? "#2d6a4f" : "var(--ink-4)",
                  }}>
                  {update.published ? "published" : "draft"}
                </span>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--ink)",
                    }}>
                    {update.title}
                  </span>
                  {update.tags?.[0] && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--accent)",
                        background: "var(--accent-dim)",
                        padding: "1px 6px",
                        borderRadius: "2px",
                        letterSpacing: "0.02em",
                      }}>
                      {update.tags[0]}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--ink-4)",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}>
                  {truncate(stripHtml(update.content), 140)}
                </p>
              </div>

              <div style={{ display: "flex", gap: "4px", paddingTop: "2px" }}>
                <button
                  onClick={() =>
                    updateUpdate.mutateAsync({
                      id: update._id,
                      payload: { published: !update.published },
                      projectId,
                    }).catch((err) =>
                      addToast({ message: err.message || "Failed to update.", type: "error" })
                    )
                  }
                  title={update.published ? "Unpublish" : "Publish"}
                  style={iconBtnStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = update.published ? "var(--ink-4)" : "#2d6a4f";
                    e.currentTarget.style.background = update.published ? "var(--paper-3)" : "#dcf5e8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  {update.published ? <EyeOff size={13} /> : <Globe size={13} />}
                </button>
                <button
                  onClick={() => openEdit(update)}
                  title="Edit"
                  style={iconBtnStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--ink)";
                    e.currentTarget.style.background = "var(--paper-3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeletingUpdate(update)}
                  title="Delete"
                  style={iconBtnStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--danger)";
                    e.currentTarget.style.background = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--ink-4)";
                    e.currentTarget.style.background = "transparent";
                  }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUpdate ? "Edit update" : "New update"}
        width="680px"
        dismissible={false}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-4">
            <FormField label="Title" error={errors.title?.message}>
              <TextInput
                placeholder="What happened in this update?"
                error={errors.title?.message}
                {...register("title")}
              />
            </FormField>

            <FormField label="Tag" error={errors.tag?.message}>
              <SelectInput error={errors.tag?.message} {...register("tag")}>
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t || "No tag"}
                  </option>
                ))}
              </SelectInput>
            </FormField>
          </div>

          <FormField label="Summary" error={errors.summary?.message} hint="One-line description shown in the update list">
            <TextInput
              placeholder="Brief summary of this update…"
              error={errors.summary?.message}
              {...register("summary")}
            />
          </FormField>

          <FormField label="Content" error={errors.content?.message}>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <UpdateEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Describe what you built, learned, or ran into…"
                />
              )}
            />
            {errors.content && (
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--danger)",
                  marginTop: "5px",
                  fontFamily: "var(--font-mono)",
                }}>
                {errors.content.message}
              </p>
            )}
          </FormField>

          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            style={{
              marginTop: "16px",
            }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                userSelect: "none",
              }}>
              <input
                type="checkbox"
                {...register("published")}
                style={{ width: "14px", height: "14px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "13px", color: "var(--ink-3)", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                Publish (visible on public profile)
              </span>
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
                type="button">
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {editingUpdate ? "Save changes" : "Save update"} →
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingUpdate}
        onClose={() => setDeletingUpdate(null)}
        onConfirm={onDelete}
        title="Delete update?"
        description={`"${deletingUpdate?.title}" will be permanently deleted.`}
        confirmLabel="Delete update"
        isLoading={deleteUpdate.isPending}
      />
    </div>
  );
}

const iconBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  border: "none",
  background: "transparent",
  color: "var(--ink-4)",
  cursor: "pointer",
  borderRadius: "3px",
  transition: "all var(--transition)",
};

function UpdateListSkeleton() {
  return (
    <div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr auto",
            gap: "24px",
            padding: "18px 0",
            borderTop: "1px solid var(--rule)",
          }}>
          <div
            className="skeleton"
            style={{ height: "12px", width: "80px", borderRadius: "2px" }}
          />
          <div>
            <div
              className="skeleton"
              style={{
                height: "14px",
                width: "55%",
                borderRadius: "2px",
                marginBottom: "8px",
              }}
            />
            <div
              className="skeleton"
              style={{ height: "11px", width: "85%", borderRadius: "2px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            <div
              className="skeleton"
              style={{ width: "28px", height: "28px", borderRadius: "3px" }}
            />
            <div
              className="skeleton"
              style={{ width: "28px", height: "28px", borderRadius: "3px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
