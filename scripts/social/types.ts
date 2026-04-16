export type PlatformName = "bluesky" | "mastodon" | "threads" | "linkedin" | "x";

export interface PostInput {
  /** Primary text. Per-platform variants override this. */
  text: string;
  /** Optional per-platform overrides keyed by platform name. */
  variants?: Partial<Record<PlatformName, string>>;
  /** Absolute paths to media files (images for now). */
  media?: string[];
  /** True if the orchestrator should split into a thread on supported platforms. */
  thread?: boolean;
}

export interface PostResult {
  platform: PlatformName;
  ok: boolean;
  /** Platform-native post id, when successful. */
  id?: string;
  /** Canonical URL to the post, when derivable. */
  url?: string;
  /** Human-readable error when ok is false. */
  error?: string;
  /** True when the provider was skipped due to missing secrets. */
  skipped?: boolean;
}

export interface Provider {
  name: PlatformName;
  /** True when all required secrets are present. */
  ready(): boolean;
  /** Why the provider is not ready, for logging. */
  readyReason(): string;
  /** Publish a single post. */
  post(input: PostInput): Promise<PostResult>;
}
