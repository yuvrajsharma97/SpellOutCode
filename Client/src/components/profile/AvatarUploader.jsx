import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { profilesApi } from "../../api/profiles";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/strings";

export default function AvatarUploader() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [preview, setPreview] = useState(user?.avatar?.url || null);
  const inputRef = useRef(null);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await profilesApi.removeAvatar();
      setUser((prev) => ({ ...prev, avatar: { url: "", fileId: "" } }));
      setPreview(null);
      addToast({ message: "Avatar removed." });
    } catch (err) {
      addToast({ message: err.message || "Failed to remove avatar.", type: "error" });
    } finally {
      setRemoving(false);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input immediately so the same file can be re-selected after an error
    inputRef.current.value = "";

    const allowed = ["image/jpeg", "image/png", "image/gif"];
    if (!allowed.includes(file.type)) {
      addToast({ message: "Only JPG, PNG or GIF files are allowed.", type: "error" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({ message: "Image must be under 5MB.", type: "error" });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await profilesApi.uploadAvatar(formData);
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      setPreview(res.data.avatar.url);
      addToast({ message: "Avatar updated." });
    } catch (err) {
      addToast({ message: err.message || "Upload failed.", type: "error" });
      setPreview(user?.avatar?.url || null);
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
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || removing}
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
              cursor: uploading || removing ? "not-allowed" : "pointer",
              opacity: uploading || removing ? 0.5 : 1,
              transition: "all var(--transition)",
            }}
            onMouseEnter={(e) => {
              if (!uploading && !removing) {
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

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading || removing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                border: "1px solid var(--rule)",
                borderRadius: "4px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--ink-4)",
                background: "transparent",
                cursor: uploading || removing ? "not-allowed" : "pointer",
                opacity: uploading || removing ? 0.5 : 1,
                transition: "all var(--transition)",
              }}
              onMouseEnter={(e) => {
                if (!uploading && !removing) {
                  e.currentTarget.style.borderColor = "#f87171";
                  e.currentTarget.style.color = "#f87171";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rule)";
                e.currentTarget.style.color = "var(--ink-4)";
              }}>
              <X size={12} />
              {removing ? "Removing…" : "Remove"}
            </button>
          )}
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--ink-4)",
          }}>
          JPG, PNG or GIF · Max 5MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
