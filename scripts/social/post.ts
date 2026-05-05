#!/usr/bin/env tsx
/**
 * Scan social/queue/ for markdown posts with status: publish, fan them out to
 * every configured provider, then move each post to social/posted/YYYY/ with
 * post IDs written back into frontmatter.
 *
 * Usage:
 *   VAULT_ROOT=/path/to/vault tsx scripts/social/post.ts
 *
 * Env (provider credentials — any subset, missing providers are skipped):
 *   BSKY_HANDLE, BSKY_APP_PASSWORD
 *   MASTODON_INSTANCE, MASTODON_TOKEN
 *   THREADS_USER_ID, THREADS_ACCESS_TOKEN
 *   LINKEDIN_URN, LINKEDIN_ACCESS_TOKEN
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
 *
 * Kill switch:
 *   SOCIAL_PAUSED=1  -> no-op
 */
import { readdir, readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { dirname, join, resolve, relative, basename, isAbsolute } from "node:path";
import matter from "gray-matter";

import { bluesky } from "./providers/bluesky.js";
import { mastodon } from "./providers/mastodon.js";
import { threads } from "./providers/threads.js";
import { linkedin } from "./providers/linkedin.js";
import { x } from "./providers/x.js";
import type { PlatformName, PostInput, PostResult, Provider } from "./types.js";

const VAULT = resolve(process.env.VAULT_ROOT ?? process.cwd());
const QUEUE = join(VAULT, "social", "queue");
const POSTED = join(VAULT, "social", "posted");

const ALL_PROVIDERS: Provider[] = [bluesky(), mastodon(), threads(), linkedin(), x()];

async function main(): Promise<void> {
  if (process.env.SOCIAL_PAUSED === "1") {
    console.log("SOCIAL_PAUSED=1 — skipping all posting.");
    return;
  }

  const files = await listQueue();
  if (files.length === 0) {
    console.log("No queued posts.");
    return;
  }

  let anyFailures = false;
  for (const file of files) {
    const failed = await processFile(file);
    anyFailures = anyFailures || failed;
  }
  if (anyFailures) process.exit(1);
}

async function listQueue(): Promise<string[]> {
  try {
    const entries = await readdir(QUEUE, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => join(QUEUE, e.name));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

interface Frontmatter {
  status?: string;
  platforms?: PlatformName[];
  post_at?: string;
  thread?: boolean;
  media?: string[];
  post_ids?: Record<string, string>;
  [key: string]: unknown;
}

async function processFile(path: string): Promise<boolean> {
  const raw = await readFile(path, "utf8");
  const parsed = matter(raw);
  const fm = parsed.data as Frontmatter;
  const rel = relative(VAULT, path);

  if (fm.status !== "publish") {
    console.log(`SKIP ${rel} (status=${fm.status ?? "unset"})`);
    return false;
  }
  if (fm.post_at && new Date(fm.post_at).getTime() > Date.now()) {
    console.log(`SKIP ${rel} (post_at ${fm.post_at} in future)`);
    return false;
  }

  const input = buildInput(parsed.content, fm, path);
  const requested = fm.platforms ?? (ALL_PROVIDERS.map((p) => p.name) as PlatformName[]);
  const targets = ALL_PROVIDERS.filter((p) => requested.includes(p.name));

  console.log(`\nPOST ${rel} -> ${targets.map((t) => t.name).join(", ")}`);

  const results: PostResult[] = [];
  for (const provider of targets) {
    if (!provider.ready()) {
      console.log(`  ~ ${provider.name}: ${provider.readyReason()} (skip)`);
      results.push({ platform: provider.name, ok: false, skipped: true, error: provider.readyReason() });
      continue;
    }
    const result = await provider.post(input);
    if (result.ok) {
      console.log(`  ✓ ${provider.name}: ${result.url ?? result.id}`);
    } else {
      console.log(`  ✗ ${provider.name}: ${result.error}`);
    }
    results.push(result);
  }

  const postedIds: Record<string, string> = { ...(fm.post_ids ?? {}) };
  for (const r of results) {
    if (r.ok && r.id) postedIds[r.platform] = r.url ?? r.id;
  }

  const succeeded = results.filter((r) => r.ok);
  const hardFails = results.filter((r) => !r.ok && !r.skipped);

  if (succeeded.length === 0) {
    // Nothing went out — leave in queue, mark failed so humans notice.
    const nextFm: Frontmatter = { ...fm, status: "failed", post_ids: postedIds };
    await writeFile(path, matter.stringify(parsed.content, nextFm), "utf8");
    console.log(`  ! ${rel}: no provider succeeded; left in queue as status=failed`);
    return true;
  }

  const nextFm: Frontmatter = {
    ...fm,
    status: hardFails.length ? "posted-partial" : "posted",
    post_ids: postedIds,
  };
  const year = new Date().getUTCFullYear();
  const destDir = join(POSTED, String(year));
  await mkdir(destDir, { recursive: true });
  const dest = join(destDir, basename(path));
  await writeFile(path, matter.stringify(parsed.content, nextFm), "utf8");
  await rename(path, dest);
  console.log(`  → moved to ${relative(VAULT, dest)}`);
  return hardFails.length > 0;
}

function buildInput(content: string, fm: Frontmatter, notePath: string): PostInput {
  const { primary, variants } = splitBody(content);
  const mediaPaths = (fm.media ?? []).map((m) =>
    isAbsolute(m) ? m : resolve(dirname(notePath), m),
  );
  return {
    text: primary,
    variants,
    media: mediaPaths,
    thread: Boolean(fm.thread),
  };
}

/**
 * Parse the body into the primary Post text and any `### <platform>` variant
 * overrides under a `## Variants` section.
 */
function splitBody(content: string): { primary: string; variants: Partial<Record<PlatformName, string>> } {
  const lines = content.split(/\r?\n/);
  const sections: Record<string, string[]> = {};
  let current = "__preamble__";
  let subCurrent: string | null = null;
  for (const line of lines) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    if (h2) {
      current = h2[1].toLowerCase();
      subCurrent = null;
      continue;
    }
    if (h3 && current === "variants") {
      subCurrent = h3[1].toLowerCase();
      continue;
    }
    const key = subCurrent ? `variants.${subCurrent}` : current;
    (sections[key] ||= []).push(line);
  }
  const primary = stripComments((sections["post"] ?? []).join("\n")).trim();
  const variants: Partial<Record<PlatformName, string>> = {};
  for (const key of Object.keys(sections)) {
    if (!key.startsWith("variants.")) continue;
    const platform = key.slice("variants.".length) as PlatformName;
    const text = stripComments(sections[key].join("\n")).trim();
    if (text) variants[platform] = text;
  }
  return { primary, variants };
}

function stripComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
