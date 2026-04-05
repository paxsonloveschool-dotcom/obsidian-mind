import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { WSMessage } from "../shared/types.js";

const clients = new Set<WebSocket>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    clients.add(ws);
    const msg: WSMessage = {
      type: "connected",
      device_count: clients.size,
    };
    ws.send(JSON.stringify(msg));

    ws.on("close", () => {
      clients.delete(ws);
    });

    ws.on("error", () => {
      clients.delete(ws);
    });
  });

  return wss;
}

export function broadcast(message: WSMessage) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export function getConnectedCount(): number {
  return clients.size;
}
