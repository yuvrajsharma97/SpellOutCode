import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { initials } from "../../utils/strings";
import ContactModal from "../contact/ContactModal";

export default function ProfileRail({ profile }) {
  const [contactOpen, setContactOpen] = useState(false);

  const socialLinks = [
    profile.github && {
      label: `github.com/${profile.github}`,
      href: `https://github.com/${profile.github}`,
    },
    profile.website && {
      label: profile.website.replace(/^https?:\/\//, ""),
      href: profile.website,
    },
    profile.twitter && {
      label: `@${profile.twitter}`,
      href: `https://twitter.com/${profile.twitter}`,
    },
    profile.linkedin && {
      label: "LinkedIn",
      href: `https://linkedin.com/in/${profile.linkedin}`,
    },
  ].filter(Boolean);

  return (
    <>
      <aside
        style={{
          borderRight: "1px solid var(--rule)",
          paddingRight: "40px",
          position: "sticky",
          top: "80px",
          alignSelf: "start",
        }}>
        {/* Avatar */}
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "6px",
              objectFit: "cover",
              marginBottom: "18px",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "6px",
              background: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--paper)",
              marginBottom: "18px",
              letterSpacing: "0.02em",
            }}>
            {initials(profile.name)}
          </div>
        )}

        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "20px",
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: "4px",
            lineHeight: 1.2,
          }}>
          {profile.name}
        </h1>

        {/* Role */}
        {profile.role && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-4)",
              marginBottom: "16px",
              letterSpacing: "0.02em",
            }}>
            {profile.role}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--ink-3)",
              lineHeight: 1.65,
              marginBottom: "24px",
              fontWeight: 300,
            }}>
            {profile.bio}
          </p>
        )}

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "28px",
            }}>
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--ink-4)",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color var(--transition)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink-4)")
                }>
                <ExternalLink size={10} />
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Contact */}
        <button
          onClick={() => setContactOpen(true)}
          style={{
            width: "100%",
            padding: "9px",
            background: "transparent",
            border: "1px solid var(--rule)",
            borderRadius: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-3)",
            cursor: "pointer",
            letterSpacing: "0.03em",
            transition: "all var(--transition)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--ink-4)";
            e.currentTarget.style.color = "var(--ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--rule)";
            e.currentTarget.style.color = "var(--ink-3)";
          }}>
          Contact {profile.name?.split(" ")[0]}
        </button>
      </aside>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        username={profile.username}
        recipientName={profile.name}
      />
    </>
  );
}
