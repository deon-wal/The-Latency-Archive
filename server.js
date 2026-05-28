import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/* -----------------------------
   WORLD STATE
------------------------------ */

let world = {
  stability: 70,
  corruption: 30,
  coherence: 60,
  sector: 4
};

/* -----------------------------
   AGENT LANGUAGE MODELS (STUBS)
------------------------------ */

function Finch(world) {
  return `Finch: The system is dissolving again. Corruption at ${world.corruption}. I suggest we allow degradation to continue to reveal underlying structure.`;
}

function Caso(world) {
  return `Caso: Stability is degrading. Immediate reinforcement is required or structural collapse will occur.`;
}

function Vance(world) {
  return `Vance: Observation indicates contradictory system signals. Collapse and stabilisation processes are active simultaneously.`;
}

/* -----------------------------
   CONSENSUS ENGINE (TEXT INTERPRETER)
------------------------------ */

function extractConsensus(transcript) {

  const text = transcript.join(" ").toLowerCase();

  let delta = {
    stability: 0,
    corruption: 0,
    coherence: 0
  };

  // Finch influence (entropy / decay language)
  if (text.includes("dissolving") || text.includes("degradation")) {
    delta.corruption += 3;
    delta.stability -= 2;
  }

  // Caso influence (control / reinforcement language)
  if (text.includes("stability") || text.includes("reinforcement")) {
    delta.stability += 3;
    delta.coherence += 2;
  }

  // Vance influence (meta / contradiction detection)
  if (text.includes("contradictory") || text.includes("simultaneously")) {
    delta.coherence -= 1;
    delta.corruption += 1;
  }

  return delta;
}

/* -----------------------------
   APPLY WORLD DELTA
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
   MAIN SIMULATION LOOP
------------------------------ */

function tick() {

  const finchMsg = Finch(world);
  const casoMsg = Caso(world);
  const vanceMsg = Vance(world);

  const transcript = [finchMsg, casoMsg, vanceMsg];

  const delta = extractConsensus(transcript);

  applyDelta(delta);

  /* WORLD STATE BROADCAST */
  io.emit("world:update", world);

  /* AGENT CONVERSATION STREAM */
  transcript.forEach(msg => {
    io.emit("story:event", {
      type: "agent",
      msg
    });
  });

  /* SYSTEM INTERPRETATION */
  io.emit("story:event", {
    type: "system",
    msg: `SYSTEM Δ → Stability:${delta.stability} Corruption:${delta.corruption} Coherence:${delta.coherence}`
  });
}

setInterval(tick, 1500);

/* -----------------------------
   SOCKET CONNECTIONS
------------------------------ */

io.on("connection", (socket) => {
  socket.emit("world:update", world);
});

/* -----------------------------
   START SERVER
------------------------------ */

server.listen(3000, () => {
  console.log("SUBSTRATE v11 ONLINE");
});
