import { ExternalLink } from "lucide-react";

// lucide-react no longer ships brand/logo icons (Github, Twitter, Linkedin, etc.)
// so social links are shown as labeled text instead of unlabeled brand marks.
const SOCIAL_LABELS = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
};

const ProfileRail = ({ profile }) => {
  const socialEntries = Object.entries(profile?.socialLinks || {}).filter(
    ([, url]) => url,
  );

  return (
    <aside className="flex md:block items-start gap-5 md:gap-0">
      <div className="flex-shrink-0">
        {profile?.avatar?.url ? (
          <img
            src={profile.avatar.url}
            alt={profile.name}
            className="w-14 h-14 md:w-16 md:h-16 rounded-md object-cover md:mb-5"
          />
        ) : (
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-md flex items-center justify-center md:mb-5"
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              fontFamily: "var(--font-mono)",
              fontSize: "22px",
              fontWeight: 500,
            }}>
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 md:flex-none">
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--ink)",
            marginBottom: "2px",
            lineHeight: 1.3,
          }}>
          {profile?.name}
        </h2>

        {profile?.roleTitle && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--ink-4)",
              fontWeight: 300,
              marginBottom: "14px",
            }}>
            {profile.roleTitle}
          </p>
        )}

        {profile?.bio && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--ink-3)",
              fontWeight: 300,
              lineHeight: 1.6,
              marginBottom: "16px",
            }}>
            {profile.bio}
          </p>
        )}

        {profile?.skills?.length > 0 && (
          <div style={{ marginTop: "16px", marginBottom: "4px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
                marginBottom: "8px",
              }}>
              Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "2px 8px",
                    background: "var(--paper-3)",
                    border: "1px solid var(--rule)",
                    borderRadius: "2px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--ink-3)",
                  }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {socialEntries.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            {socialEntries.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 transition-colors w-fit"
                style={{
                  color: "var(--ink-4)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-4)")}>
                {SOCIAL_LABELS[key] || key}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProfileRail;
