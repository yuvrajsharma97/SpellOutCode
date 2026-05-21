import { Github, Globe, Linkedin, Twitter } from "lucide-react";

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

        <div className="profile-links">
          {profile?.socialLinks?.github && (
            <a
              href={`https://github.com/${profile.socialLinks.github}`}
              target="_blank"
              rel="noreferrer">
              <Github size={18} />
            </a>
          )}

          {profile?.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer">
              <Linkedin size={18} />
            </a>
          )}

          {profile?.socialLinks?.twitter && (
            <a
              href={`https://twitter.com/${profile.socialLinks.twitter}`}
              target="_blank"
              rel="noreferrer">
              <Twitter size={18} />
            </a>
          )}

          {profile?.socialLinks?.website && (
            <a
              href={profile.socialLinks.website}
              target="_blank"
              rel="noreferrer">
              <Globe size={18} />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProfileRail;
