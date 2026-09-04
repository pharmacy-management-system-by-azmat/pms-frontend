"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyProfile, updateMyProfile } from "@/lib/api/profile";

const profileQueryKey = ["auth", "profile"];

export function useProfile() {
  return useQuery({ queryKey: profileQueryKey, queryFn: getMyProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => queryClient.setQueryData(profileQueryKey, profile),
  });
}
