/* ==========================================================================
   SUBSTRATE RUNTIME PLATFORM // ENGINE OPERATIONS MODULE v12.2
   CORE LOGIC CONSOLIDATION & COMPLIANCE ENGINE
   ========================================================================== */

(() => {
  'use strict';

  // --- RUNTIME SYSTEM STATE ---
  const simState = {
    stability: 85,
    corruption: 15,
    coherence: 90,
    isPaused: false,
    socketConnected: false
  };

  let socket = null;

  // --- DOM CACHE MATRIX ---
  const DOM = {
    body: document.body,
    shell: document.querySelector('.site-shell'),
    sysLogs: document.getElementById('log'),
    agentFeed: document.getElementById('agentFeed'),
    memoryTimeline: document.getElementById('memoryTimeline'),
    userTrace: document.getElementById('userTrace'),
    runtimeStatus: document.getElementById('runtimeStatus'),
    worldDisplay: document.getElementById('world'),
    copyDisplay: document.getElementById('worldCopy'),
    validationForm: document.getElementById('validationLedgerForm'),
    validationInput: document.getElementById('validationInput'),
    micaBlock: document.getElementById('micaBlock'),
    bars: {
      stability: document.getElementById('stabilityBar'),
      corruption: document.getElementById('corruptionBar'),
      coherence: document.getElementById('coherenceBar')
    },
    vals: {
      stability: document.getElementById('stabilityVal'),
      corruption: document.getElementById('corruptionVal'),
      coherence: document.getElementById('coherenceBar')
    }
  };

  const NARRATIVE_POOL = [
    "A SIGNAL IS BLEEDING THROUGH THE ARCHIVE",
    "FINCH DETECTED A MEMORY LOOP",
    "CASO FAILED TO STABILIZE A COLLAPSE NODE",
    "VANCE FLAGGED AN IMPOSSIBLE STATE",
    "A USER HAS ENTERED THE SYSTEM"
  ];

  const GENERIC_NARRATIVES = [
    "LEDGER EXCEPTION: Reality glitch logged within unrendered context block.",
    "DEPARTMENTAL NOTICE: Form 104-C automatically generated due to baseline continuity drift.",
    "WARNING: Structural repetition identified near Aldersyth Sector limits. Deploying anchors.",
    "ADMINISTRATIVE REPORT: Narrative consensus matching target bureaucratic layout."
  ];

  // --- CORE TELEMETRY LOGGING ENGINE ---
  function getTimestamp() {
    return new Date().toISOString().split('T')[1].substring(0, 8);
  }

  function appendTerminalLog(msg, systemTag = 'SYSTEM', destination = DOM.sysLogs) {
    if (simState.isPaused || !destination) return;

    // Handle standard stream arrays vs flat pre elements
    if (destination === DOM.sysLogs) {
      const line = document.createElement('div');
      line.className = `log-line ${systemTag.toLowerCase()}`;
      line.textContent = `[${getTimestamp()}] <${systemTag.toUpperCase()}> ${msg}`;
      destination.appendChild(line);

      if (destination.children.length > 120) {
        destination.removeChild(destination.firstChild);
      }
      destination.scrollTop = destination.scrollHeight;
    } else {
      // Direct raw string injection for raw standard terminal output components
      destination.innerHTML += `[${getTimestamp()}] ${msg}\n`;
      destination.scrollTop = destination.scrollHeight;
    }
  }

  // --- INTERFACE INTERACTION & ROUTING SYSTEM ---
  window.view = function(viewId) {
    const views = ['worldView', 'agentsView', 'memoryView', 'diagnosticsView'];
    
    document.querySelectorAll('.navbar button').forEach(btn => btn.classList.remove('active'));
    
    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) {
        if (v === `${viewId}View`) {
          el.classList.remove('hidden');
          const activeBtn = document.querySelector(`.navbar button[onclick="view('${viewId}')"]`);
          if (activeBtn) activeBtn.classList.add('active');
          appendTerminalLog(`BRANCH ROUTED // SUB-SYSTEM ENGINE MOUNTED: [${viewId.toUpperCase()}]`);
        } else {
          el.classList.add('hidden');
        }
      }
    });
  };

  window.toggleVisor = function() {
    DOM.body.classList.toggle('visor-active');
    if (DOM.shell) DOM.shell.classList.toggle('visor-active');
    const isActive = DOM.body.classList.contains('visor-active');
    appendTerminalLog(`POLARIZED VISOR SPECTRUM: ${isActive ? 'ACTIVE // FILTERING CHRONO-GLITCH PERCEPTIONS' : 'DEACTIVATED // DIRECT BYPASS'}`, 'SYSTEM');
  };

  window.breakReality = function() {
    DOM.body.style.transform = "skew(2deg)";
    DOM.body.style.filter = "hue-rotate(90deg)";
    appendTerminalLog("CRITICAL REALITY SECTOR DESTABILIZED VIA DIRECT ADMINISTRATIVE EXERTION", "CRITICAL");
    
    setTimeout(() => {
      DOM.body.style.transform = "";
      DOM.body.style.filter = "";
    }, 2000);
  };

  function applyNormalizingFlash() {
    DOM.body.classList.add('normalized');
    document.querySelectorAll('.panel').forEach(panel => {
      panel.classList.add('ledger-flash');
      setTimeout(() => panel.classList.remove('ledger-flash'), 400);
    });
    setTimeout(() => DOM.body.classList.remove('normalized'), 1800);
  }

  // --- METRIC VECTOR CALCULATION & INTERACTION BINDINGS ---
  function parseSystemVector(rawData) {
    if (simState.isPaused) return;

    const vectorStr = JSON.stringify(rawData, null, 2);
    const truncatedStr = vectorStr.substring(0, 800);

    if (DOM.worldDisplay) DOM.worldDisplay.textContent = truncatedStr;
    if (DOM.copyDisplay) DOM.copyDisplay.textContent = truncatedStr;

    // Calculate dynamic algorithm vectors based on physical string configuration parameters
    const structuralFactors = (vectorStr.match(/e/gi) || []).length;
    simState.corruption = Math.min(100, Math.max(5, (structuralFactors * 1.8) % 100));
    simState.stability = Math.max(0, Math.min(100, 100 - (simState.corruption * 0.9)));
    simState.coherence = Math.max(10, Math.min(100, 100 - ((simState.corruption + structuralFactors) % 40)));

    updateSystemMeters();

    if (simState.corruption > 60 && Math.random() > 0.85) {
      appendTerminalLog('CORE COMPUTE ZONE: LIQUID MERCURY TRENCH OVERFLOW IN SECTOR 0', 'CRITICAL');
    } else if (Math.random() > 0.75) {
      const fallbackLog = GENERIC_NARRATIVES[Math.floor(Math.random() * GENERIC_NARRATIVES.length)];
      appendTerminalLog(fallbackLog, 'SYSTEM');
    }
  }

  function updateSystemMeters() {
    const stab = Math.round(simState.stability);
    const corr = Math.round(simState.corruption);
    const coh = Math.round(simState.coherence);

    if (DOM.bars.stability) DOM.bars.stability.style.width = `${simState.stability}%`;
    if (DOM.bars.corruption) DOM.bars.corruption.style.width = `${simState.corruption}%`;
    if (DOM.bars.coherence) DOM.bars.coherence.style.width = `${simState.coherence}%`;

    if (DOM.vals.stability) DOM.vals.stability.textContent = `${stab}%`;
    if (DOM.vals.corruption) DOM.vals.corruption.textContent = `${corr}%`;
    if (DOM.vals.coherence) DOM.vals.coherence.textContent = `${coh}%`;

    if (DOM.micaBlock) {
      if (simState.stability < 35) {
        DOM.micaBlock.classList.add('thinning', 'mica-active');
        if (Math.random() > 0.9) appendTerminalLog('MICA LAYER DETECTED AT SYSTEM CRITICAL MATRIX INTERSECTION THINNING', 'WARNING');
      } else {
        DOM.micaBlock.classList.remove('thinning', 'mica-active');
      }
    }
  }

  function generateLocalVectorMock() {
    parseSystemVector({
      timestamp: new Date().toISOString(),
      departmentalSubNode: `DEPT_SUB_NODE_${Math.floor(Math.random() * 900 + 100)}`,
      realityVarianceIndex: (Math.random() * 0.42).toFixed(4),
      unrenderedMicaFlowRate: `${(Math.random() * 12 + 8).toFixed(2)} L/sec`
    });
  }

  // --- STREAM INTERACTIVE INTERFACES ---
  window.pause = function() { 
    simState.isPaused = true; 
    appendTerminalLog("CONTINUITY PROCESSING ENGINE HALTED BY ADMINISTRATIVE ORDER.", "SYSTEM"); 
  };
  
  window.resume = function() { 
    simState.isPaused = false; 
    appendTerminalLog("CONTINUITY PROCESSING ENGINE ENGAGED // SYNCHRONIZING FLUX.", "SYSTEM"); 
  };
  
  window.clearLog = function() { 
    if (DOM.sysLogs) DOM.sysLogs.innerHTML = ""; 
  };

  window.injectEvent = function(type) {
    if (socket && simState.socketConnected) {
      socket.emit('inject:event', type);
    }
    appendTerminalLog(`MANUAL DIRECT MANIPULATION FAULT EVENT TRIGGERED: [${type.toUpperCase()}]`, "COMMAND");
    
    if (type === 'stability') {
      simState.stability = Math.min(100, simState.stability + 15);
      simState.coherence = Math.min(100, simState.coherence + 5);
    } else if (type === 'corruption') {
      simState.corruption = Math.min(100, simState.corruption + 25);
      simState.stability = Math.max(0, simState.stability - 10);
    } else if (type === 'desync') {
      simState.coherence = Math.max(0, simState.coherence - 30);
      simState.corruption = Math.min(100, simState.corruption + 15);
    }
    updateSystemMeters();
  };

  window.pokeAgent = function(agentName) {
    if (socket && simState.socketConnected) {
      socket.emit('agent:poke', agentName);
    }

    const dynamicResponses = {
      finch: ["Entropy rising. You shouldn't be here.", "I can corrupt this layer if you want.", "Nothing stays stable."],
      caso: ["Holding structure… barely.", "You are affecting the system.", "Stability is not guaranteed."],
      vance: ["You are not supposed to see this.", "There are contradictions in your behavior.", "Explain your presence."]
    };

    const responses = dynamicResponses[agentName.toLowerCase()] || ["Identity signal verification failure."];
    const selection = responses[Math.floor(Math.random() * responses.length)];

    appendTerminalLog(`INTERROGATING AGENT IDENTITY LINK: [${agentName.toUpperCase()}]... ACTIVE.`, 'COMMAND', DOM.agentFeed);
    appendTerminalLog(`${agentName.toUpperCase()} → ${selection}`, 'AGENT', DOM.agentFeed);
  };

  // --- EXTERNAL NETWORK TELEMETRY LAYERS ---
  function initTelemetryStreams() {
    if (typeof io !== 'undefined') {
      try {
        socket = io();
        socket.on('connect', () => {
          simState.socketConnected = true;
          if (DOM.runtimeStatus) {
            DOM.runtimeStatus.innerHTML = "MATRIX SUBSTRATE L-11: ACTIVE<br>INGEST INGESTION VECTOR: LIVE [SOCKET.IO STREAM]<br>CONTINUITY PROCESSING: SYNCHRONIZED";
          }
        });

        socket.on('world:update', data => {
          if (!simState.isPaused) parseSystemVector(data);
        });

        socket.on('story:event', e => {
          if (!simState.isPaused) appendTerminalLog(e.msg, e.type || 'NARRATIVE');
        });

        socket.on('ui:state', data => {
          if (data?.state) {
            ['state-normal', 'state-stable', 'state-corrupt', 'state-fractured'].forEach(c => DOM.body.classList.remove(c));
            DOM.body.classList.add(`state-${data.state}`);
            appendTerminalLog(`MATRIX COMPRESSION PARADIGM SHIFTED TO: [${data.state.toUpperCase()}]`, 'SYSTEM');
          }
        });
      } catch (e) {
        console.warn("Socket connection failed. Utilizing standalone telemetry fallback layers.");
      }
    }

    // Baseline Telemetry Emulation Polling Engine Loop
    setInterval(() => {
      if (!simState.socketConnected && !simState.isPaused) {
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
          .then(res => res.json())
          .then(data => parseSystemVector(data))
          .catch(() => generateLocalVectorMock());
      }
    }, 4000);

    // Crypto Network Fluctuations Signal Loop
    setInterval(async () => {
      if (simState.isPaused) return;
      try {
        const res = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
        const data = await res.json();
        const price = data.bpi.USD.rate_float;

        simState.coherence = Math.min(100, price % 100);
        appendTerminalLog(`EXTERNAL CRYPTO TELEMETRY RECOGNIZED: BTC=${price.toFixed(2)}`, 'SYSTEM');
      } catch {
        appendTerminalLog("EXTERNAL TELEMETRY LINK DISCONNECTED SECTOR BREAKOUT RISK", "WARNING");
      }
    }, 10000);
  }

  // --- CHRONO RECURRENT LOOPS ---
  setInterval(() => {
    if (Math.random() > 0.6) {
      const msg = NARRATIVE_POOL[Math.floor(Math.random() * NARRATIVE_POOL.length)];
      appendTerminalLog(`⚠ ${msg}`, 'NARRATIVE');
    }
  }, 6000);

  setInterval(() => {
    if (DOM.userTrace) {
      DOM.userTrace.textContent = `Session: ${Math.floor(Math.random() * 99999)}\nLatency: ${Math.random().toFixed(4)}ms\nDrift: ${(Math.random() * 10).toFixed(2)}%`;
    }
  }, 3000);

  // --- INITIALIZATION PROTOCOLS ---
  document.addEventListener('DOMContentLoaded', () => {
    updateSystemMeters();
    initTelemetryStreams();

    if (DOM.validationForm) {
      DOM.validationForm.addEventListener('submit', e => {
        e.preventDefault();
        if (!DOM.validationInput) return;

        const token = DOM.validationInput.value.trim().toUpperCase();
        if (token) {
          simState.stability = 100;
          simState.corruption = 0;
          simState.coherence = 100;
          updateSystemMeters();
          applyNormalizingFlash();

          appendTerminalLog(`CONTRADICTION RECORDED IN IRON JOURNAL: "${token}"`, 'LEDGER');
          appendTerminalLog(`ENVIRONMENTAL ENTRY FORCED: ${token} // BASELINE STABILIZED`, 'LEDGER', DOM.memoryTimeline);
          appendTerminalLog(`CRITICAL OVERRIDE: Substrate values forced to Departmental baseline configuration.`, 'SYSTEM');

          if (socket && simState.socketConnected) {
            socket.emit('inject:event', 'normalize');
          }

          DOM.validationInput.value = '';
        }
      });
    }

    appendTerminalLog("DEPARTMENT TERMINAL INITIALIZED // SUBSTRATE INTERFACE READY.", "SYSTEM");
  });

})();

/* ==========================================================================
   SUBSTRATE TELEMETRY INGESTION CORE
   - low-level event loop
   - severity tagging aligned to UI matrix colors
   - stochastic network jitter (Poisson-ish scheduler)
   ========================================================================== */

/**
 * Severity mapping aligned to your UI system:
 * system  -> neutral / green base
 * success -> emerald
 * warning -> yellow
 * error   -> red
 * agent   -> cyan (optional extension)
 * command -> amber/orange
 */

const SEVERITY_MATRIX = {
  system:  { color: "text-green-400", weight: 0.45 },
  success: { color: "text-emerald-400", weight: 0.20 },
  warning: { color: "text-yellow-400", weight: 0.20 },
  error:   { color: "text-red-500", weight: 0.10 },
  agent:   { color: "text-cyan-400", weight: 0.03 },
  command: { color: "text-orange-400", weight: 0.02 }
};

/* ==========================================================================
   LOW-LEVEL TELEMETRY EVENT GENERATOR
   ========================================================================== */

function generateTelemetryEvent(seq = 0) {
  const roll = Math.random();

  let severity = "system";
  let cumulative = 0;

  for (const [key, meta] of Object.entries(SEVERITY_MATRIX)) {
    cumulative += meta.weight;
    if (roll <= cumulative) {
      severity = key;
      break;
    }
  }

  const payloads = {
    system:  `Ledger sync heartbeat @ frame ${seq}`,
    success: `Node validation confirmed (cluster-${Math.floor(Math.random()*9)})`,
    warning: `Latency spike detected in SEC_${Math.floor(Math.random()*10).toString().padStart(2,"0")}`,
    error:   `Packet desync failure — buffer overflow risk elevated`,
    agent:   `Vance shadow lag detected in render pipeline`,
    command: `Manual override signal injected into stream`
  };

  return {
    id: seq,
    timestamp: Date.now(),
    severity,
    color: SEVERITY_MATRIX[severity].color,
    message: payloads[severity] || "Unknown telemetry frame"
  };
}

/* ==========================================================================
   NETWORK JITTER MODEL (POISSON-LIKE SCHEDULER)
   - simulates unstable packet arrival intervals
   ========================================================================== */

function jitterInterval(base = 1200, variance = 900) {
  // exponential-ish jitter curve (network burst simulation)
  const u = Math.random();
  const skew = -Math.log(1 - u); // exponential distribution
  return base + skew * variance;
}

/* ==========================================================================
   TELEMETRY LOOP ENGINE
   ========================================================================== */

export class TelemetryEngine {
  constructor(onEvent) {
    this.onEvent = onEvent;
    this.seq = 0;
    this.running = false;
    this._timeout = null;
  }

  start() {
    this.running = true;
    this._tick();
  }

  stop() {
    this.running = false;
    clearTimeout(this._timeout);
  }

  _tick() {
    if (!this.running) return;

    const event = generateTelemetryEvent(this.seq++);

    // push into consumer (React state / log buffer / websocket proxy)
    this.onEvent?.(event);

    // jittered scheduling (core simulation layer)
    const delay = jitterInterval(
      800,                       // base packet interval
      1200 - Math.random()*300  // dynamic variance injection
    );

    this._timeout = setTimeout(() => this._tick(), delay);
  }
}

/* ==========================================================================
   OPTIONAL: LOG FORMATTER (UI READY)
   ========================================================================== */

export function formatTelemetryLine(event) {
  const prefix =
    event.severity === "error" ? "✗" :
    event.severity === "warning" ? "⚠" :
    event.severity === "success" ? "✓" :
    "•";

  return {
    text: `${prefix} ${event.message}`,
    type: event.severity,
    colorClass: event.color,
    ts: event.timestamp
  };
}