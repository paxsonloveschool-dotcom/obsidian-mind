import React, { useState } from "react";
import type { Device } from "../../shared/types";

interface Props {
  devices: Device[];
  expanded?: boolean;
}

function timeSince(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function platformIcon(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes("darwin") || p.includes("mac")) return "macOS";
  if (p.includes("linux")) return "Linux";
  if (p.includes("win")) return "Windows";
  return platform;
}

export function DeviceGrid({ devices, expanded }: Props) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-3">
        Devices ({devices.length})
      </h2>
      <div className={`grid gap-3 ${expanded ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
            className={`bg-gray-900 border rounded-lg p-4 cursor-pointer transition-all hover:border-gray-600 ${
              device.status === "online" ? "border-green-800/50" : "border-gray-800"
            } ${selectedDevice === device.id ? "ring-1 ring-portal-500" : ""}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    device.status === "online" ? "bg-green-400 animate-pulse" : "bg-gray-600"
                  }`}
                />
                <h3 className="font-medium text-white">{device.name}</h3>
              </div>
              <span className="text-xs text-gray-500">{platformIcon(device.platform)}</span>
            </div>

            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Hostname</span>
                <span className="text-gray-300 font-mono">{device.hostname}</span>
              </div>
              <div className="flex justify-between">
                <span>Active sessions</span>
                <span className={device.active_sessions > 0 ? "text-portal-400 font-medium" : "text-gray-500"}>
                  {device.active_sessions}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last seen</span>
                <span>{timeSince(device.last_seen)}</span>
              </div>
            </div>

            {/* Extensions panel (expanded) */}
            {(expanded || selectedDevice === device.id) && device.extensions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-2">Extensions ({device.extensions.length})</p>
                <div className="space-y-1">
                  {device.extensions.map((ext, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          ext.type === "mcp-server"
                            ? "bg-purple-900/50 text-purple-300"
                            : ext.type === "hook"
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {ext.type}
                      </span>
                      <span className="text-gray-300 truncate">{ext.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {devices.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No devices registered yet</p>
            <p className="text-sm">Install the hook script on each machine to start tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}
