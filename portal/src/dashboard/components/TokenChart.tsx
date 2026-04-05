import React from "react";
import type { TokenSnapshot } from "../../shared/types";

interface Props {
  tokensByHour: TokenSnapshot[];
}

export function TokenChart({ tokensByHour }: Props) {
  // Group by hour, sum across devices
  const hourlyTotals = new Map<string, { input: number; output: number; cost: number }>();

  for (const snap of tokensByHour) {
    const hour = snap.timestamp.slice(11, 16); // "HH:MM"
    const existing = hourlyTotals.get(hour) ?? { input: 0, output: 0, cost: 0 };
    existing.input += snap.input;
    existing.output += snap.output;
    existing.cost += snap.cost_usd;
    hourlyTotals.set(hour, existing);
  }

  const hours = Array.from(hourlyTotals.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const maxTokens = Math.max(1, ...hours.map(([, v]) => v.input + v.output));

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-3">Token Usage (24h)</h2>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        {hours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No token data yet</p>
            <p className="text-xs mt-1">Data will appear as sessions report usage</p>
          </div>
        ) : (
          <div className="space-y-1">
            {hours.map(([hour, totals]) => {
              const inputWidth = (totals.input / maxTokens) * 100;
              const outputWidth = (totals.output / maxTokens) * 100;

              return (
                <div key={hour} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-12 text-right font-mono">{hour}</span>
                  <div className="flex-1 flex gap-0.5 h-5">
                    <div
                      className="bg-cyan-500/60 rounded-sm transition-all"
                      style={{ width: `${inputWidth}%` }}
                      title={`Input: ${totals.input.toLocaleString()}`}
                    />
                    <div
                      className="bg-purple-500/60 rounded-sm transition-all"
                      style={{ width: `${outputWidth}%` }}
                      title={`Output: ${totals.output.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-gray-500 w-16 text-right">
                    ${totals.cost.toFixed(2)}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-3 h-2 bg-cyan-500/60 rounded-sm" />
                Input
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-2 bg-purple-500/60 rounded-sm" />
                Output
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
