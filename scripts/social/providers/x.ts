import type { PostInput, PostResult, Provider } from "../types.js";
import crypto from "node:crypto";

/**
 * X (Twitter) via v2 POST /2/tweets with OAuth 1.0a user context.
 * Requires a paid Basic+ tier app as of Feb 2023.
 *
 * OAuth 1.0a is signed manually to avoid pulling in a larger dependency.
 */
const ENDPOINT = "https://api.twitter.com/2/tweets";
const MAX_LEN = 280;

function percentEncode(s: string): string {
  return encodeURIComponent(s).replace(
    /[!*'()]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase(),
  );
}

function sign(params: Record<string, string>, secret: string, tokenSecret: string): string {
  const baseParams = Object.keys(params)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");
  const baseString = [
    "POST",
    percentEncode(ENDPOINT),
    percentEncode(baseParams),
  ].join("&");
  const signingKey = `${percentEncode(secret)}&${percentEncode(tokenSecret)}`;
  return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}

export function x(): Provider {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_SECRET;
  const allPresent = apiKey && apiSecret && accessToken && accessSecret;
  return {
    name: "x",
    ready: () => Boolean(allPresent),
    readyReason: () =>
      allPresent ? "ready" : "X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET missing",
    async post(input: PostInput): Promise<PostResult> {
      try {
        const text = truncate(input.variants?.x ?? input.text, MAX_LEN);
        const oauthParams: Record<string, string> = {
          oauth_consumer_key: apiKey!,
          oauth_nonce: crypto.randomBytes(16).toString("hex"),
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
          oauth_token: accessToken!,
          oauth_version: "1.0",
        };
        const signature = sign(oauthParams, apiSecret!, accessSecret!);
        oauthParams.oauth_signature = signature;

        const authHeader =
          "OAuth " +
          Object.entries(oauthParams)
            .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
            .join(", ");

        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error(`x ${res.status}: ${await res.text()}`);
        const out = (await res.json()) as { data: { id: string } };
        return {
          platform: "x",
          ok: true,
          id: out.data.id,
          url: `https://x.com/i/status/${out.data.id}`,
        };
      } catch (err) {
        return { platform: "x", ok: false, error: (err as Error).message };
      }
    },
  };
}

function truncate(text: string, max: number): string {
  if ([...text].length <= max) return text;
  return [...text].slice(0, max - 1).join("") + "…";
}
