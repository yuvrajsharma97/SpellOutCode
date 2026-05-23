// import { Github ,Globe, Linkedin, Twitter } from "lucide-react";

const ProfileRail = ({ profile }) => {
  return (
    <aside className="profile-rail">
      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.avatar?.url ? (
            <img
              src={profile.avatar.url}
              alt={profile.name}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-fallback">
              {profile?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>

        <h2>{profile?.name}</h2>

        {profile?.roleTitle && (
          <p className="profile-role">{profile.roleTitle}</p>
        )}

        {profile?.bio && <p className="profile-bio">{profile.bio}</p>}

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

        <div className="profile-links">
          {profile?.socialLinks?.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer">
              {/* <Github size={18} /> */}
            </a>
          )}

          {profile?.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer">
              {/* <Linkedin size={18} /> */}
            </a>
          )}

          {profile?.socialLinks?.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noreferrer">
              {/* <Twitter size={18} /> */}
            </a>
          )}

          {profile?.socialLinks?.website && (
            <a
              href={profile.socialLinks.website}
              target="_blank"
              rel="noreferrer">
              {/* <Globe size={18} /> */}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProfileRail;
