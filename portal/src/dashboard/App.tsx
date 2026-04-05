import React, { useState, useEffect } from "react";
import { useApi } from "./hooks/useApi";
import { useWebSocket } from "./hooks/useWebSocket";
import { StatsOverview } from "./components/StatsOverview";
import { DeviceGrid } from "./components/DeviceGrid";
import { SessionList } from "./components/SessionList";
import { TokenChart } from "./components/TokenChart";
import type { Device, Session, AggregateStats, WSMessage } from "../shared/types";

const WS_URL = `ws://${window.location.hostname}:4981/ws`;

export default function App() {
  const { connected, subscribe } = useWebSocket(WS_URL);
  const { data: stats, refetch: refetchStats } = useApi<AggregateStats>("/api/stats", 30_000);
  const { data: devices, refetch: refetchDevices } = useApi<Device[]>("/api/devices", 15_000);
  const { data: sessions, refetch: refetchSessions } = useApi<Session[]>("/api/sessions?limit=20", 10_000);

  const [tab, setTab] = useState<"overview" | "devices" | "sessions">("overview");

  // Refetch on WebSocket updates
  useEffect(() => {
    return subscribe((msg: WSMessage) => {
      if (msg.type === "token_update" || msg.type === "session_update") {
        refetchStats();
        refetchSessions();
      }
      if (msg.type === "device_update") {
        refetchDevices();
      }
      if (msg.type === "event") {
        refetchSessions();
      }
    });
  }, [subscribe, refetchStats, refetchDevices, refetchSessions]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Claude Code Portal</h1>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
              {stats?.total_devices ?? 0} devices
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 text-xs ${connected ? "text-green-400" : "text-red-400"}`}>
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              {connected ? "Live" : "Disconnected"}
            </div>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <nav className="flex gap-1 border-b border-gray-800 mb-6">
          {(["overview", "devices", "sessions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-portal-500 text-portal-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {tab === "overview" && (
          <div className="space-y-6">
            <StatsOverview stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TokenChart tokensByHour={stats?.tokens_by_hour ?? []} />
              <SessionList sessions={sessions ?? []} compact />
            </div>
            <DeviceGrid devices={devices ?? []} />
          </div>
        )}

        {tab === "devices" && <DeviceGrid devices={devices ?? []} expanded />}

        {tab === "sessions" && <SessionList sessions={sessions ?? []} />}
      </main>
    </div>
  );
}
