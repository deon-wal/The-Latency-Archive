const socket = io();
let validationLedgerValue = '';
let streamPaused = false;

/* ---------------- VIEW SWITCH & EXECUTION LAYERS ---------------- */
function view(viewId) {
  const views = ['worldView', 'agentsView', 'memoryView', 'diagnosticsView'];
  
  // 1. Clear active states from all terminal buttons
  document.querySelectorAll('.navbar button').forEach(btn => btn.classList.remove('active'));
  
  views.forEach(v => {
    const el = document.getElementById(v);
    if (v === `${viewId}View`) {
      el.classList.remove('hidden');
      
      // 2. Find the clicked button by its onclick target attribute and latch it down
      const activeBtn = document.querySelector(`.navbar button[onclick="view('${viewId}')"]`);
      if(activeBtn) activeBtn.classList.add('active');
      
      logOutput(`BRANCH ROUTED // NOW VIEWING CORE SUBSYSTEM: [${viewId.toUpperCase()}]`, sysLogs);
    } else {
      el.classList.add('hidden');
    }
  });
}

function collapseBranch(viewName) {
  document.body.classList.remove('vis-branch-world', 'vis-branch-agents', 'vis-branch-memory', 'vis-branch-diagnostics');
  if (viewName) {
    document.body.classList.add('vis-branch-' + viewName);
  }
}

/* ---------------- OBSERVER LAYER (FIELD KITS) ---------------- */
function toggleVisor() {
  document.body.classList.toggle('visor-active');
  const isActive = document.body.classList.contains('visor-active');
  localLogAppend('SYSTEM', `POLARIZED VISOR: ${isActive ? 'FILTERS ENGAGED // NOISE SUPPRESSED' : 'BYPASS ACTIVE'}`);
}

function setMicaState(enabled) {
  const mica = document.getElementById('micaBlock');
  if (!mica) return;
  mica.classList.toggle('mica-active', enabled);
  if (enabled) {
    localLogAppend('CRITICAL', 'MICA BLOCK VIBRATION DETECTED: LOCAL BRANCH THINNING');
  }
}

function normalizeFieldKit() {
  document.body.classList.add('normalized');
  setTimeout(() => document.body.classList.remove('normalized'), 1800);
}

/* ---------------- WORLD TELEMETRY & ZONE MONITORING ---------------- */
socket.on('world:update', w => {
  const formatted = JSON.stringify(w, null, 2);
  const worldDisplay = document.getElementById('world');
  const copyDisplay = document.getElementById('worldCopy');
  
  if (worldDisplay) worldDisplay.innerText = formatted;
  if (copyDisplay) copyDisplay.innerText = formatted;

  // Direct injection of tracking vectors to the brutalist layout bars
  if (document.getElementById('stabilityBar')) document.getElementById('stabilityBar').style.width = w.stability + '%';
  if (document.getElementById('corruptionBar')) document.getElementById('corruptionBar').style.width = w.corruption + '%';
  if (document.getElementById('coherenceBar')) document.getElementById('coherenceBar').style.width = w.coherence + '%';

  // Mica device monitors the physical reality alignment matrix threshold
  setMicaState(w.stability < 30);
  
  // Random contextual zone errors based on environmental drift parameters
  if (w.corruption > 60 && Math.random() > 0.85) {
    localLogAppend('CRITICAL', 'CORE COMPUTE ZONE: LIQUID MERCURY TRENCH OVERFLOW IN SECTOR 0');
  }
  if (w.coherence < 40 && Math.random() > 0.85) {
    localLogAppend('WARNING', 'TRANSIT SWAPS: SENSORY DESYNCHRONIZATION DETECTED IN ECHO RUNS');
  }
});

/* ---------------- UI STATE SYSTEM ---------------- */
function setStateClass(state) {
  ['state-normal', 'state-stable', 'state-corrupt', 'state-fractured'].forEach(cls => document.body.classList.remove(cls));
  document.body.classList.add('state-' + state);
}

socket.on('ui:state', data => {
  if (data && data.state) {
    setStateClass(data.state);
    localLogAppend('SYSTEM', `MATRIX COMPRESSION PARADIGM SHIFTED TO: [${data.state.toUpperCase()}]`);
  }
});

/* ---------------- STREAM [TRANSIT & RESIDENTIAL CHANNELS] ---------------- */
socket.on('story:event', e => {
  if (streamPaused) return;

  const div = document.createElement('div');
  div.className = 'log-line ' + (e.type || '');
  div.textContent = e.msg;

  const log = document.getElementById('log');
  if (!log) return;
  log.appendChild(div);

  if (log.children.length > 120) {
    log.removeChild(log.firstChild);
  }

  log.scrollTop = log.scrollHeight;
});

/* ---------------- RUNTIME CONTROLS ---------------- */
function pause() { 
  streamPaused = true; 
  localLogAppend('SYSTEM', 'LIVE EXECUTION STREAM SEGREGATED [PAUSED]');
}

function resume() { 
  streamPaused = false; 
  localLogAppend('SYSTEM', 'LIVE EXECUTION STREAM RE-ALIGNED [RESUMED]');
}

function clearLog() { 
  const log = document.getElementById('log');
  if (log) log.innerHTML = ''; 
}

function injectEvent(type) { 
  socket.emit('inject:event', type); 
  localLogAppend('COMMAND', `FORCING INJECTIONS MATRIX PACKET: [${type.toUpperCase()}]`);
}

function pokeAgent(agent) { 
  socket.emit('agent:poke', agent); 
  
  // Feedback logic routed to historical structural nodes
  const agentFeed = document.getElementById('agentFeed');
  if (agentFeed) {
    const ts = new Date().toISOString().split('T')[1].substring(0, 8);
    agentFeed.innerHTML += `[${ts}] INTERROGATING IDENTITY LINK: [${agent.toUpperCase()}]... CONNECTION ACTIVE.\n`;
    agentFeed.scrollTop = agentFeed.scrollHeight;
  }
}

/* ---------------- VALIDATION LEDGER PIPELINE ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  const ledgerForm = document.getElementById('validationLedgerForm');
  if (!ledgerForm) return;

  ledgerForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('validationInput');
    validationLedgerValue = input ? input.value.trim() : '';
    
    if (validationLedgerValue) {
      // Manually committing concrete parameters forces the environment to override conflicts
      localLogAppend('LEDGER', `CONTRADICTION RECORDED IN IRON JOURNAL: "${validationLedgerValue}"`);
      
      const timeline = document.getElementById('memoryTimeline');
      if (timeline) {
        const ts = new Date().toISOString().split('T')[1].substring(0, 8);
        timeline.innerHTML += `[${ts}] ENVIRONMENTAL ENTRY FORCED: ${validationLedgerValue} // BASELINE STABILIZED\n`;
        timeline.scrollTop = timeline.scrollHeight;
      }
      
      // Emit override reset command back up through socket network if backend supports it
      socket.emit('inject:event', 'normalize');
    }

    if (input) input.value = '';
    normalizeFieldKit();
  });
});

/* Helper logging function to display internal operations in the live terminal feed */
function localLogAppend(tag, msg) {
  if (streamPaused) return;
  const log = document.getElementById('log');
  if (!log) return;
  
  const div = document.createElement('div');
  div.className = `log-line ${tag.toLowerCase()}`;
  const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
  div.textContent = `[${timestamp}] <${tag}> ${msg}`;
  
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
const narrativeEvents = [
  "A SIGNAL IS BLEEDING THROUGH THE ARCHIVE",
  "FINCH DETECTED A MEMORY LOOP",
  "CASO FAILED TO STABILIZE A COLLAPSE NODE",
  "VANCE FLAGGED AN IMPOSSIBLE STATE",
  "A USER HAS ENTERED THE SYSTEM (YOU?)"
];

function emitNarrative() {
  if (simState.isPaused) return;

  const msg = narrativeEvents[Math.floor(Math.random() * narrativeEvents.length)];
  logOutput(`⚠ ${msg}`, sysLogs);
}

// run every 6–10 sec randomly
setInterval(() => {
  if (Math.random() > 0.6) emitNarrative();
}, 6000);