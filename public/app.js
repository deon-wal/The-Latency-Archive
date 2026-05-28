
const socket = io();

/* ---------------- VIEW SWITCH ---------------- */

function view(v) {
  document.querySelectorAll(".panel-grid")
    .forEach(p => p.classList.add("hidden"));

  document.getElementById(v + "View")
    .classList.remove("hidden");
}

/* ---------------- WORLD ---------------- */

socket.on("world:update", w => {
  document.getElementById("world").innerText =
    JSON.stringify(w, null, 2);
});

/* ---------------- UI STATE SYSTEM ---------------- */

socket.on("ui:state", data => {
  document.body.className = "state-" + data.state;
});

/* ---------------- STREAM ---------------- */

socket.on("story:event", e => {
  const div = document.createElement("div");
  div.className = e.type;
  div.textContent = e.msg;

  const log = document.getElementById("log");
  log.appendChild(div);

  if (log.children.length > 120) {
    log.removeChild(log.firstChild);
  }

  log.scrollTop = log.scrollHeight;
});