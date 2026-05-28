import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/* ---------------- STATE ---------------- */

function loadState() {
  try {
    return JSON.parse(fs.readFileSync("state.json", "utf-8"));
  } catch {
    return null;
  }
}

function saveState(state) {
  fs.writeFileSync("state.json", JSON.stringify(state, null, 2));
}

const persisted = loadState();

let world = persisted?.world ?? {
  stability: 70,
  corruption: 30,
  coherence: 60,
  sector: 4
};

let finchMemory = persisted?.finchMemory ?? {
  events: [],
  themes: { recursion: 0, collapse: 0, drift: 0 }
};

/* ---------------- AGENTS ---------------- */

function Finch(world) {
  return `Finch: Corruption at ${world.corruption}. Let it degrade.`;
}

function Caso(world) {
  return `Caso: Stability required. Reinforce immediately.`;
}

function Vance(world) {
  return `Vance: Contradictions detected in system state.`;
}

/* ---------------- CONSENSUS ---------------- */

function deltaEngine(text) {
  let d = { stability: 0, corruption: 0, coherence: 0 };

  if (text.includes("corruption") || text.includes("degrade")) {
    d.corruption += 3;
    d.stability -= 2;
  }

  if (text.includes("stability") || text.includes("reinforce")) {
    d.stability += 3;
    d.coherence += 2;
  }

  if (text.includes("contradictions")) {
    d.coherence -= 1;
    d.corruption += 1;
  }

  return d;
}

function apply(d) {
  world.stability += d.stability;
  world.corruption += d.corruption;
  world.coherence += d.coherence;

  for (const k in world) {
    world[k] = Math.max(0, Math.min(100, world[k]));
  }
}

/* ---------------- UI STATE MAPPING ---------------- */

function getUIState(world) {
  if (world.corruption > 70) return "corrupt";
  if (world.stability > 75) return "stable";
  if (world.coherence < 30) return "fractured";
  return "normal";
}

/* ---------------- LOOP ---------------- */

function tick() {
  const msgs = [Finch(world), Caso(world), Vance(world)];

  const delta = deltaEngine(msgs.join(" "));
  apply(delta);

  const uiState = getUIState(world);

  io.emit("world:update", world);

  io.emit("ui:state", { state: uiState });

  msgs.forEach(m =>
    io.emit("story:event", { type: "agent", msg: m })
  );

  io.emit("story:event", {
    type: "system",
    msg: `Δ S:${delta.stability} C:${delta.corruption} H:${delta.coherence}`
  });

  saveState({ world, finchMemory });
}

setInterval(tick, 1500);

io.on("connection", socket => {
  socket.emit("world:update", world);
});

server.listen(3000, () => {
  console.log("SUBSTRATE v11 CLEAN ARCHITECTURE ONLINE");
});