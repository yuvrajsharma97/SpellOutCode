import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/api/projects";
import { queryKeys } from "@/lib/queryKeys";

export function usePublicProjects(username) {
  return useQuery({
    queryKey: queryKeys.projects(username),
    queryFn: () => projectsApi.getByUsername(username),
    enabled: !!username,
  });
}

export function usePublicProject(username, slug) {
  return useQuery({
    queryKey: queryKeys.project(username, slug),
    queryFn: () => projectsApi.getBySlug(username, slug),
    enabled: !!username && !!slug,
  });
}

export function useMyProjects() {
  return useQuery({
    queryKey: queryKeys.myProjects(),
    queryFn: () => projectsApi.getMyProjects(),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => projectsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.myProjects() }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => projectsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.myProjects() }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => projectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.myProjects() }),
  });
}
