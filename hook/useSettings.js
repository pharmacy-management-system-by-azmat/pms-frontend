"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSettings, updateSettings } from "@/lib/api/settings";

const settingsKey = ["settings"];

export function useSettings() {
  return useQuery({ queryKey: settingsKey, queryFn: getSettings });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (settings) => queryClient.setQueryData(settingsKey, settings),
  });
}
