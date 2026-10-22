"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJson } from "@/lib/api-client";

interface NewsletterSubscriptionPayload {
  email: string;
  managerSlug: string;
}

export function useNewsletterSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewsletterSubscriptionPayload) =>
      postJson("/api/subscribers", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["subscribers"] }),
  });
}
