import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { usePublicProjects } from "../hooks/useProjects";
import { useDebounce } from "../hooks/useDebounce";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileIntro from "../components/profile/ProfileIntro";
import ProjectShowcase from "../components/profile/ProjectShowcase";
import FeaturedWork from "../components/profile/FeaturedWork";
import BuildSteps from "../components/profile/BuildSteps";
import { sectionShell } from "../components/profile/profileUtils";

export default function ProfilePage() {
  const { username } = useParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 250);
  const projectsRef = useRef(null);

  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile(username);
  const { data: projects = [], isLoading: projectsLoading } = usePublicProjects(username);

  if (profileError) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--ink-4)" }}>
          Profile not found.
        </p>
      </div>
    );
  }

  if (profileLoading || !profile) return <ProfileSkeleton />;

  const query = debouncedSearch.trim().toLowerCase();
  const filtered = projects.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.summary?.toLowerCase().includes(query) ||
      p.techStack?.some((t) => t.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const seeProjects = () =>
    projectsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="pb-14 sm:pb-20">
      <ProfileHero profile={profile} onSeeProjects={seeProjects} />
      {!projectsLoading && (
        <>
          <BuildSteps projects={projects} />
          <ProfileIntro profile={profile} projects={projects} />
        </>
      )}
      <div className={projectsLoading ? "pt-14 sm:pt-20" : ""}>
        <ProjectShowcase
          ref={projectsRef}
          profile={profile}
          projects={filtered}
          isLoading={projectsLoading}
          search={search}
          onSearch={setSearch}
          status={statusFilter}
          onStatus={setStatusFilter}
        />
      </div>
      {!projectsLoading && (
        <FeaturedWork profile={profile} projects={projects} onSeeProjects={seeProjects} />
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className={`${sectionShell} pt-4 sm:pt-6`}>
      <div className="skeleton h-[380px] sm:h-[440px]" style={{ borderRadius: "20px" }} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-14 md:px-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton flex-shrink-0" style={{ width: "40px", height: "40px", borderRadius: "999px" }} />
            <div className="flex-1">
              <div className="skeleton" style={{ height: "14px", width: "60%", borderRadius: "3px", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "12px", width: "90%", borderRadius: "3px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
