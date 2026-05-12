import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { profilesApi } from "../../api/profiles";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/strings";

export default function AvatarUploader() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user?.avatarUrl || null);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast({ message: "Please select an image file.", type: "error" });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      addToast({ message: "Image must be under 3MB.", type: "error" });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await profilesApi.uploadAvatar(formData);
      updateUser({ avatarUrl: res.avatarUrl });
      setPreview(res.avatarUrl);
      addToast({ message: "Avatar updated." });
    } catch (err) {
      addToast({ message: err.message || "Upload failed.", type: "error" });
      setPreview(user?.avatarUrl || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {/* Current avatar */}
      <div style={{ position: "relative" }}>
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "6px",
              objectFit: "cover",
              display: "block",
              opacity: uploading ? 0.5 : 1,
              transition: "opacity var(--transition)",
            }}
          />
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "6px",
              background: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "22px",
              fontWeight: 500,
              color: "var(--paper)",
            }}>
            {initials(user?.name)}
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 14px",
            border: "1px solid var(--rule)",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-3)",
            background: "transparent",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.5 : 1,
            transition: "all var(--transition)",
            marginBottom: "8px",
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              e.currentTarget.style.borderColor = "var(--ink-4)";
              e.currentTarget.style.color = "var(--ink)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--rule)";
            e.currentTarget.style.color = "var(--ink-3)";
          }}>
          <Upload size={12} />
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--ink-4)",
          }}>
          JPG, PNG or WebP · Max 3MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
