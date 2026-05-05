import type { PostInput, PostResult, Provider } from "../types.js";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

const PDS = "https://bsky.social";
const MAX_LEN = 300;

interface Session {
  accessJwt: string;
  did: string;
  handle: string;
}

async function login(handle: string, password: string): Promise<Session> {
  const res = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password }),
  });
  if (!res.ok) throw new Error(`bluesky login ${res.status}: ${await res.text()}`);
  return (await res.json()) as Session;
}

interface BlobRef {
  $type: "blob";
  ref: { $link: string };
  mimeType: string;
  size: number;
}

async function uploadBlob(session: Session, path: string): Promise<BlobRef> {
  const data = await readFile(path);
  const mimeType = mimeFromExt(path);
  const res = await fetch(`${PDS}/xrpc/com.atproto.repo.uploadBlob`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": mimeType,
    },
    body: data,
  });
  if (!res.ok) throw new Error(`bluesky uploadBlob ${res.status}: ${await res.text()}`);
  const { blob } = (await res.json()) as { blob: BlobRef };
  return blob;
}

function mimeFromExt(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

/** Detect URL facets so links are clickable. Mentions/tags left for a follow-up. */
function detectFacets(text: string): unknown[] {
  const facets: unknown[] = [];
  const urlRe = /\bhttps?:\/\/[^\s)]+/g;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let match: RegExpExecArray | null;
  while ((match = urlRe.exec(text)) !== null) {
    const byteStart = encoder.encode(text.slice(0, match.index)).byteLength;
    const byteEnd = byteStart + encoder.encode(match[0]).byteLength;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: match[0] }],
    });
    if (bytes.byteLength > 10_000_000) break; // safety
  }
  return facets;
}

export function bluesky(): Provider {
  const handle = process.env.BSKY_HANDLE;
  const password = process.env.BSKY_APP_PASSWORD;
  return {
    name: "bluesky",
    ready: () => Boolean(handle && password),
    readyReason: () =>
      !handle ? "BSKY_HANDLE missing" : !password ? "BSKY_APP_PASSWORD missing" : "ready",
    async post(input: PostInput): Promise<PostResult> {
      try {
        const text = truncate(input.variants?.bluesky ?? input.text, MAX_LEN);
        const session = await login(handle!, password!);

        const record: Record<string, unknown> = {
          $type: "app.bsky.feed.post",
          text,
          createdAt: new Date().toISOString(),
          facets: detectFacets(text),
        };

        if (input.media?.length) {
          const images = [];
          for (const m of input.media.slice(0, 4)) {
            const blob = await uploadBlob(session, m);
            images.push({ alt: basename(m), image: blob });
          }
          record.embed = { $type: "app.bsky.embed.images", images };
        }

        const res = await fetch(`${PDS}/xrpc/com.atproto.repo.createRecord`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessJwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repo: session.did,
            collection: "app.bsky.feed.post",
            record,
          }),
        });
        if (!res.ok) throw new Error(`createRecord ${res.status}: ${await res.text()}`);
        const { uri } = (await res.json()) as { uri: string };
        const rkey = uri.split("/").pop();
        return {
          platform: "bluesky",
          ok: true,
          id: uri,
          url: `https://bsky.app/profile/${session.handle}/post/${rkey}`,
        };
      } catch (err) {
        return { platform: "bluesky", ok: false, error: (err as Error).message };
      }
    },
  };
}

function truncate(text: string, max: number): string {
  if ([...text].length <= max) return text;
  return [...text].slice(0, max - 1).join("") + "…";
}
