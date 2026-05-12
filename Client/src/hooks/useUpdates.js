import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updatesApi } from "../api/updates";
import { queryKeys } from "../lib/queryKeys";

export function usePublicUpdates(username, slug) {
  return useQuery({
    queryKey: queryKeys.updates(username, slug),
    queryFn: () => updatesApi.getByProject(username, slug),
    enabled: !!username && !!slug,
  });
}

export function usePublicUpdate(username, slug, updateId) {
  return useQuery({
    queryKey: queryKeys.update(username, slug, updateId),
    queryFn: () => updatesApi.getById(username, slug, updateId),
    enabled: !!username && !!slug && !!updateId,
  });
}

export function useMyUpdates(projectId) {
  return useQuery({
    queryKey: queryKeys.myUpdates(projectId),
    queryFn: () => updatesApi.getByProjectId(projectId),
    enabled: !!projectId,
  });
}

export function useCreateUpdate(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updatesApi.create(projectId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.myUpdates(projectId) }),
  });
}

export function useUpdateUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updatesApi.update(id, payload),
    onSuccess: (_data, { projectId }) => {
      if (projectId)
        qc.invalidateQueries({ queryKey: queryKeys.myUpdates(projectId) });
    },
  });
}

export function useDeleteUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => updatesApi.delete(id),
    onSuccess: (_data, { projectId }) => {
      if (projectId)
        qc.invalidateQueries({ queryKey: queryKeys.myUpdates(projectId) });
    },
  });
}
