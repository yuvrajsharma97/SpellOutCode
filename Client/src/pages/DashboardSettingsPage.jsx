import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { profilesApi } from "../api/profiles";
import { authApi } from "../api/auth";
import { profileSchema, socialSchema, changePasswordSchema } from "../schemas";
import PageHeader from "../components/layout/PageHeader";
import FormField, { TextInput, TextArea } from "../components/ui/FormField";
import Button from "../components/ui/Button";
import AvatarUploader from "../components/profile/AvatarUploader";

const TABS = ["Profile", "Avatar", "Social links", "Security"];

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and account" />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid var(--rule)",
          marginBottom: "36px",
        }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "9px 18px",
              border: "none",
              borderBottom: `2px solid ${activeTab === tab ? "var(--ink)" : "transparent"}`,
              background: "transparent",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: activeTab === tab ? "var(--ink)" : "var(--ink-4)",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all var(--transition)",
              marginBottom: "-1px",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab)
                e.currentTarget.style.color = "var(--ink-3)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab)
                e.currentTarget.style.color = "var(--ink-4)";
            }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: "520px" }}>
        {activeTab === "Profile" && <ProfileTab />}
        {activeTab === "Avatar" && <AvatarTab />}
        {activeTab === "Social links" && <SocialTab />}
        {activeTab === "Security" && <SecurityTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      roleTitle: user?.roleTitle || "",
      bio: user?.bio || "",
    },
  });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 20) return;
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const onSubmit = async (data) => {
    try {
      const res = await profilesApi.updateProfile({ ...data, skills });
      setUser(res.data.user);
      addToast({ message: "Profile updated." });
    } catch (err) {
      addToast({
        message: err.message || "Failed to update profile.",
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Full name" error={errors.name?.message}>
        <TextInput error={errors.name?.message} {...register("name")} />
      </FormField>

      <FormField
        label="Role / title"
        error={errors.roleTitle?.message}
        hint="e.g. Full-stack engineer, Indie maker">
        <TextInput
          placeholder="Full-stack engineer"
          error={errors.roleTitle?.message}
          {...register("roleTitle")}
        />
      </FormField>

      <FormField
        label="Bio"
        error={errors.bio?.message}
        hint="Shown on your public profile. Max 300 characters.">
        <TextArea
          rows={4}
          placeholder="A short description of who you are and what you're building…"
          error={errors.bio?.message}
          {...register("bio")}
        />
      </FormField>

      {/* Skills */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: "8px",
          }}>
          Skills
        </label>

        {/* Skill chips */}
        {skills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 10px",
                  background: "var(--paper-3)",
                  border: "1px solid var(--rule)",
                  borderRadius: "2px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--ink-2)",
                }}>
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ink-4)",
                    padding: "0",
                    lineHeight: 1,
                    fontSize: "13px",
                  }}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Skill input */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="e.g. React, Node.js…"
            disabled={skills.length >= 20}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid var(--rule)",
              borderRadius: "3px",
              background: "var(--paper)",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={addSkill}
            disabled={!skillInput.trim() || skills.length >= 20}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--rule)",
              borderRadius: "3px",
              background: "var(--paper-3)",
              color: "var(--ink-3)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
            Add
          </button>
        </div>
        {skills.length >= 20 && (
          <p style={{ fontSize: "12px", color: "var(--ink-4)", marginTop: "6px" }}>
            Maximum 20 skills reached.
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} disabled={!isDirty && skills.join() === (user?.skills || []).join()}>
        Save changes →
      </Button>
    </form>
  );
}

function AvatarTab() {
  return (
    <div>
      <p
        style={{
          fontSize: "13px",
          color: "var(--ink-4)",
          marginBottom: "28px",
          fontWeight: 300,
          lineHeight: 1.6,
        }}>
        Upload a photo to display on your public profile.
      </p>
      <AvatarUploader />
    </div>
  );
}

function SocialTab() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      website: user?.socialLinks?.website || "",
      github: user?.socialLinks?.github || "",
      twitter: user?.socialLinks?.twitter || "",
      linkedin: user?.socialLinks?.linkedin || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await profilesApi.updateProfile({ socialLinks: data });
      setUser(res.data.user);
      addToast({ message: "Social links updated." });
    } catch (err) {
      addToast({ message: err.message || "Failed to update.", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="GitHub" error={errors.github?.message}>
        <TextInput
          placeholder="https://github.com/yourusername"
          error={errors.github?.message}
          {...register("github")}
        />
      </FormField>

      <FormField label="LinkedIn" error={errors.linkedin?.message}>
        <TextInput
          placeholder="https://linkedin.com/in/yourusername"
          error={errors.linkedin?.message}
          {...register("linkedin")}
        />
      </FormField>

      <FormField label="Twitter / X" error={errors.twitter?.message}>
        <TextInput
          placeholder="https://twitter.com/yourusername"
          error={errors.twitter?.message}
          {...register("twitter")}
        />
      </FormField>

      <FormField label="Website" error={errors.website?.message}>
        <TextInput
          placeholder="https://yoursite.com"
          error={errors.website?.message}
          {...register("website")}
        />
      </FormField>

      <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
        Save links →
      </Button>
    </form>
  );
}

function SecurityTab() {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data) => {
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      addToast({ message: "Password updated." });
      reset();
    } catch (err) {
      addToast({
        message: err.message || "Failed to change password.",
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField
        label="Current password"
        error={errors.currentPassword?.message}>
        <TextInput
          type="password"
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          autoComplete="current-password"
          {...register("currentPassword")}
        />
      </FormField>

      <FormField label="New password" error={errors.newPassword?.message}>
        <TextInput
          type="password"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          autoComplete="new-password"
          {...register("newPassword")}
        />
      </FormField>

      <FormField
        label="Confirm new password"
        error={errors.confirmPassword?.message}>
        <TextInput
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" isLoading={isSubmitting}>
        Change password →
      </Button>

      <div
        style={{
          marginTop: "48px",
          paddingTop: "32px",
          borderTop: "1px solid var(--rule)",
        }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
          Danger zone
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "var(--ink-4)",
            marginBottom: "16px",
            fontWeight: 300,
          }}>
          Deleting your account will permanently remove your profile, all
          projects, and all updates. This cannot be undone.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => alert("Contact support to delete your account.")}>
          Delete account
        </Button>
      </div>
    </form>
  );
}
