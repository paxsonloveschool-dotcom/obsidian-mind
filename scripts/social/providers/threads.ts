import type { PostInput, PostResult, Provider } from "../types.js";

/**
 * Threads via the Meta Threads Graph API.
 * Docs: https://developers.facebook.com/docs/threads
 *
 * Flow is two-step:
 *   1. POST /{user-id}/threads      -> returns creation_id
 *   2. POST /{user-id}/threads_publish?creation_id=...
 *
 * Long-lived tokens expire; rotate them via the Meta token refresh endpoint.
 */
const GRAPH = "https://graph.threads.net/v1.0";
const MAX_LEN = 500;

export function threads(): Provider {
  const userId = process.env.THREADS_USER_ID;
  const token = process.env.THREADS_ACCESS_TOKEN;
  return {
    name: "threads",
    ready: () => Boolean(userId && token),
    readyReason: () =>
      !userId
        ? "THREADS_USER_ID missing"
        : !token
          ? "THREADS_ACCESS_TOKEN missing"
          : "ready",
    async post(input: PostInput): Promise<PostResult> {
      try {
        const text = truncate(input.variants?.threads ?? input.text, MAX_LEN);

        const createRes = await fetch(
          `${GRAPH}/${userId}/threads?` +
            new URLSearchParams({
              media_type: "TEXT",
              text,
              access_token: token!,
            }),
          { method: "POST" },
        );
        if (!createRes.ok) throw new Error(`threads create ${createRes.status}: ${await createRes.text()}`);
        const { id: creationId } = (await createRes.json()) as { id: string };

        const pubRes = await fetch(
          `${GRAPH}/${userId}/threads_publish?` +
            new URLSearchParams({
              creation_id: creationId,
              access_token: token!,
            }),
          { method: "POST" },
        );
        if (!pubRes.ok) throw new Error(`threads publish ${pubRes.status}: ${await pubRes.text()}`);
        const { id } = (await pubRes.json()) as { id: string };
        return { platform: "threads", ok: true, id };
      } catch (err) {
        return { platform: "threads", ok: false, error: (err as Error).message };
      }
    },
  };
}

function truncate(text: string, max: number): string {
  if ([...text].length <= max) return text;
  return [...text].slice(0, max - 1).join("") + "…";
}
