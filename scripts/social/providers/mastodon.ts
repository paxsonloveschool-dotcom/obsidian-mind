import type { PostInput, PostResult, Provider } from "../types.js";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const MAX_LEN = 500; // default; instances can raise this but 500 is the safe baseline

async function uploadMedia(instance: string, token: string, path: string): Promise<string> {
  const data = await readFile(path);
  const blob = new Blob([new Uint8Array(data)]);
  const form = new FormData();
  form.set("file", blob, basename(path));
  const res = await fetch(`${instance}/api/v2/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`mastodon media ${res.status}: ${await res.text()}`);
  const { id } = (await res.json()) as { id: string };
  return id;
}

export function mastodon(): Provider {
  const instanceRaw = process.env.MASTODON_INSTANCE;
  const token = process.env.MASTODON_TOKEN;
  const instance = instanceRaw?.replace(/\/+$/, "");
  return {
    name: "mastodon",
    ready: () => Boolean(instance && token),
    readyReason: () =>
      !instance ? "MASTODON_INSTANCE missing" : !token ? "MASTODON_TOKEN missing" : "ready",
    async post(input: PostInput): Promise<PostResult> {
      try {
        const text = truncate(input.variants?.mastodon ?? input.text, MAX_LEN);
        const mediaIds: string[] = [];
        for (const m of (input.media ?? []).slice(0, 4)) {
          mediaIds.push(await uploadMedia(instance!, token!, m));
        }
        const res = await fetch(`${instance}/api/v1/statuses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: text,
            media_ids: mediaIds,
            visibility: "public",
          }),
        });
        if (!res.ok) throw new Error(`mastodon status ${res.status}: ${await res.text()}`);
        const out = (await res.json()) as { id: string; url: string };
        return { platform: "mastodon", ok: true, id: out.id, url: out.url };
      } catch (err) {
        return { platform: "mastodon", ok: false, error: (err as Error).message };
      }
    },
  };
}

function truncate(text: string, max: number): string {
  if ([...text].length <= max) return text;
  return [...text].slice(0, max - 1).join("") + "…";
}
