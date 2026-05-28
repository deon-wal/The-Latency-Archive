import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/* -----------------------------
   STATE PERSISTENCE
------------------------------ */

function loadState() {
  try {
    const data = fs.readFileSync("state.json", "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function saveState(state) {
  fs.writeFileSync("state.json", JSON.stringify(state, null, 2));
}

/* -----------------------------
   INITIAL STATE (with restore)
------------------------------ */

const persisted = loadState();

let world = persisted?.world ?? {
  stability: 70,
  corruption: 30,
  coherence: 60,
  sector: 4
};

let finchMemory = persisted?.finchMemory ?? {
  events: [],
  themes: {
    recursion: 0,
    collapse: 0,
    drift: 0
  }
};

/* -----------------------------
   AGENT LANGUAGE MODELS
------------------------------ */

function Finch(world) {
  return `Finch: The system is dissolving again. Corruption at ${world.corruption}. I suggest allowing degradation to continue to reveal underlying structure.`;
}

function Caso(world) {
  return `Caso: Stability is degrading. Immediate reinforcement is required or structural collapse will occur.`;
}

function Vance(world) {
  return `Vance: Observation indicates contradictory system signals. Collapse and stabilisation processes are active simultaneously.`;
}

/* -----------------------------
   CONSENSUS ENGINE
------------------------------ */

function extractConsensus(transcript) {
  const text = transcript.join(" ").toLowerCase();

  let delta = {
    stability: 0,
    corruption: 0,
    coherence: 0
  };

  if (text.includes("dissolving") || text.includes("degradation")) {
    delta.corruption += 3;
    delta.stability -= 2;
  }

  if (text.includes("stability") || text.includes("reinforcement")) {
    delta.stability += 3;
    delta.coherence += 2;
  }

  if (text.includes("contradictory") || text.includes("simultaneously")) {
    delta.coherence -= 1;
    delta.corruption += 1;
  }

  return delta;
}

/* -----------------------------
   APPLY DELTA
------------------------------ */

function applyDelta(delta) {
  world.stability += delta.stability;
  world.corruption += delta.corruption;
  world.coherence += delta.coherence;

  for (const k in world) {
    world[k] = Math.max(0, Math.min(100, world[k]));
  }
}

/* -----------------------------
   MAIN LOOP
------------------------------ */

function tick() {
  const finchMsg = Finch(world);
  const casoMsg = Caso(world);
  const vanceMsg = Vance(world);

  const transcript = [finchMsg, casoMsg, vanceMsg];

  const delta = extractConsensus(transcript);

  applyDelta(delta);

  /* broadcast world */
  io.emit("world:update", world);

  /* broadcast agent dialogue */
  transcript.forEach(msg => {
    io.emit("story:event", {
      type: "agent",
      msg
    });
  });

  /* system interpretation */
  io.emit("story:event", {
    type: "system",
    msg: `SYSTEM Δ → Stability:${delta.stability} Corruption:${delta.corruption} Coherence:${delta.coherence}`
  });

  /* -----------------------------
     PERSISTENCE WRITE (IMPORTANT)
  ------------------------------ */

  saveState({
    world,
    finchMemory
  });
}

setInterval(tick, 1500);

/* -----------------------------
   SOCKET CONNECTION
------------------------------ */

io.on("connection", (socket) => {
  socket.emit("world:update", world);
});

/* -----------------------------
   START SERVER
------------------------------ */

server.listen(3000, () => {
  console.log("SUBSTRATE v11 ONLINE (PERSISTENT)");
});
