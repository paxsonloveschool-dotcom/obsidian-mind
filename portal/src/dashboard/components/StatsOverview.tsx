import React from "react";
import type { AggregateStats } from "../../shared/types";

interface Props {
  stats: AggregateStats | null;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

const cards = [
  {
    label: "Devices Online",
    getValue: (s: AggregateStats) => `${s.online_devices}/${s.total_devices}`,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    label: "Active Sessions",
    getValue: (s: AggregateStats) => String(s.active_sessions),
    color: "text-portal-400",
    bg: "bg-portal-400/10",
  },
  {
    label: "Sessions Today",
    getValue: (s: AggregateStats) => String(s.total_sessions_today),
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    label: "Input Tokens",
    getValue: (s: AggregateStats) => formatTokens(s.total_input_tokens),
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    label: "Output Tokens",
    getValue: (s: AggregateStats) => formatTokens(s.total_output_tokens),
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    label: "Total Cost",
    getValue: (s: AggregateStats) => formatCost(s.total_cost_usd),
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

export function StatsOverview({ stats }: Props) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-800 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.bg} border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-700`}
        >
          <p className="text-xs text-gray-400 mb-1">{c.label}</p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.getValue(stats)}</p>
        </div>
      ))}
    </div>
  );
}
