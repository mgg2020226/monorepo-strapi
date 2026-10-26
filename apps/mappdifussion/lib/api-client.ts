interface MutationResult {
  ok: boolean;
  error?: string;
}

type ApiErrorResponse = {
  error?: string | { message?: string };
};

export async function postJson<TResult extends MutationResult>(
  url: string,
  payload: unknown,
): Promise<TResult> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | ApiErrorResponse
      | null;
    const apiError = data && "error" in data ? data.error : undefined;
    const message =
      typeof apiError === "string"
        ? apiError
        : apiError?.message || "No se pudo completar la solicitud.";
    throw new Error(message);
  }

  const data = (await response.json().catch(() => null)) as
    | TResult
    | MutationResult
    | null;

  if (!data || !("ok" in data) || !data.ok) {
    const apiError = data && "error" in data ? data.error : undefined;
    throw new Error(
      typeof apiError === "string"
        ? apiError
        : "No se pudo completar la solicitud.",
    );
  }

  return data as TResult;
}
