"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJson } from "@/lib/api-client";
import type { ContactSubmission } from "@/services/contact.service";

export function useContactSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContactSubmission) =>
      postJson("/api/contact", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });
}
