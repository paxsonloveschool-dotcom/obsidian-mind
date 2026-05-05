import type { PostInput, PostResult, Provider } from "../types.js";

/**
 * LinkedIn personal share via the UGC Posts API.
 * Docs: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api
 *
 * LINKEDIN_URN is the author URN, e.g. urn:li:person:ABCD1234.
 * Company pages need urn:li:organization:... and a partner-approved app.
 */
const API = "https://api.linkedin.com/v2/ugcPosts";
const MAX_LEN = 3000;

export function linkedin(): Provider {
  const urn = process.env.LINKEDIN_URN;
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  return {
    name: "linkedin",
    ready: () => Boolean(urn && token),
    readyReason: () =>
      !urn ? "LINKEDIN_URN missing" : !token ? "LINKEDIN_ACCESS_TOKEN missing" : "ready",
    async post(input: PostInput): Promise<PostResult> {
      try {
        const text = truncate(input.variants?.linkedin ?? input.text, MAX_LEN);
        const body = {
          author: urn,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text },
              shareMediaCategory: "NONE",
            },
          },
          visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
        };
        const res = await fetch(API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`linkedin ${res.status}: ${await res.text()}`);
        const { id } = (await res.json()) as { id: string };
        return { platform: "linkedin", ok: true, id };
      } catch (err) {
        return { platform: "linkedin", ok: false, error: (err as Error).message };
      }
    },
  };
}

function truncate(text: string, max: number): string {
  if ([...text].length <= max) return text;
  return [...text].slice(0, max - 1).join("") + "…";
}
