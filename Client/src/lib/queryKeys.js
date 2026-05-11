export const queryKeys = {
  profile: (username) => ["profile", username],
  projects: (username) => ["projects", username],
  project: (username, slug) => ["project", username, slug],
  updates: (username, slug) => ["updates", username, slug],
  update: (username, slug, id) => ["update", username, slug, id],
  myProjects: () => ["my-projects"],
  myUpdates: (projectId) => ["my-updates", projectId],
  me: () => ["me"],
};
