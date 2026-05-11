import { useQuery } from "@tanstack/react-query";
import { profilesApi } from "@/api/profiles";
import { queryKeys } from "@/lib/queryKeys";

export function useProfile(username) {
  return useQuery({
    queryKey: queryKeys.profile(username),
    queryFn: () => profilesApi.getProfile(username),
    enabled: !!username,
  });
}
