import React from "react";
import type { Session } from "../../shared/types";

interface Props {
  sessions: Session[];
  compact?: boolean;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeSince(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function statusColor(status: string): string {
  if (status === "active") return "bg-green-400";
  if (status === "errored") return "bg-red-400";
  return "bg-gray-500";
}

function projectName(cwd: string): string {
  if (!cwd) return "Unknown";
  const parts = cwd.split("/");
  return parts[parts.length - 1] || parts[parts.length - 2] || cwd;
}

export function SessionList({ sessions, compact }: Props) {
  const displayed = compact ? sessions.slice(0, 8) : sessions;

  return (
    <div className={compact ? "" : ""}>
      <h2 className="text-lg font-semibold text-white mb-3">
        {compact ? "Recent Sessions" : `Sessions (${sessions.length})`}
      </h2>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500">
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Device</th>
              <th className="text-left px-4 py-2 font-medium">Project</th>
              {!compact && <th className="text-left px-4 py-2 font-medium">Branch</th>}
              <th className="text-left px-4 py-2 font-medium">Activity</th>
              <th className="text-right px-4 py-2 font-medium">Tokens</th>
              {!compact && <th className="text-right px-4 py-2 font-medium">Cost</th>}
              {!compact && <th className="text-right px-4 py-2 font-medium">Tools</th>}
              <th className="text-right px-4 py-2 font-medium">Started</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((session) => (
              <tr
                key={session.id}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusColor(session.status)} ${session.status === "active" ? "animate-pulse" : ""}`} />
                    <span className="text-xs text-gray-400 capitalize">{session.status}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-gray-300 font-medium">{session.device_name}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-white font-medium">{projectName(session.cwd)}</span>
                </td>
                {!compact && (
                  <td className="px-4 py-2.5">
                    <span className="text-gray-400 font-mono text-xs">{session.branch || "-"}</span>
                  </td>
                )}
                <td className="px-4 py-2.5">
                  <span className="text-gray-400 text-xs">{session.current_activity || "-"}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="text-xs">
                    <span className="text-cyan-400">{formatTokens(session.token_input)}</span>
                    <span className="text-gray-600 mx-1">/</span>
                    <span className="text-purple-400">{formatTokens(session.token_output)}</span>
                  </div>
                </td>
                {!compact && (
                  <td className="px-4 py-2.5 text-right text-orange-400 text-xs">
                    ${session.cost_usd.toFixed(2)}
                  </td>
                )}
                {!compact && (
                  <td className="px-4 py-2.5 text-right text-gray-400 text-xs">
                    {session.tool_calls}
                  </td>
                )}
                <td className="px-4 py-2.5 text-right text-gray-500 text-xs">
                  {timeSince(session.started_at)}
                </td>
              </tr>
            ))}

            {displayed.length === 0 && (
              <tr>
                <td colSpan={compact ? 6 : 9} className="px-4 py-8 text-center text-gray-500">
                  No sessions recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
