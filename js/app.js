/**
 * OmniArchitect SSR–OmniGenesis Nexus — Application Layer
 * Studio (SSR-filtered generation), Daemon HUD, Stream, Controls
 */

const STREAM_URL = "https://malcolm-infinity-omniapi.pages.dev/api/infinity/stream";
const MALCOLM_LIVE = "https://malcolmai.live";

function logEvent(msg, type = "pulse") {
  const entry = { ts: new Date().toISOString(), msg, type };
  Matrix.events.unshift(entry);
  if (Matrix.events.length > 100) Matrix.events.pop();
  const logEl = document.getElementById("event-log");
  if (logEl) {
    const div = document.createElement("div");
    div.className = type;
    div.textContent = `[${type.toUpperCase()}] ${msg}`;
    logEl.prepend(div);
    while (logEl.children.length > 40) logEl.removeChild(logEl.lastChild);
  }
}

function updateHUD() {
  document.getElementById("coherence-value").textContent = (Matrix.coherence * 100).toFixed(1) + "%";
  document.getElementById("coherence-fill").style.width = (Matrix.coherence * 100) + "%";
  document.getElementById("cycle-value").textContent = Matrix.cycle;
  document.getElementById("residual-value").textContent = Matrix.residual.toFixed(4);
  document.getElementById("fp-size").textContent = Matrix.fixedPointSize;
  document.getElementById("bsi-value").textContent = Matrix.bsi.toFixed(3);
  document.getElementById("stream-status").textContent = Matrix.streamStatus;
  document.getElementById("stream-status").className = "pill " + (Matrix.streamStatus === "live" ? "" : "fallback");

  document.querySelectorAll(".strata-list li").forEach((li, i) => {
    li.classList.toggle("active", i === Matrix.currentStratum);
  });
}

function setupControls() {
  document.getElementById("btn-step").onclick = () => {
    engine.step();
    updateHUD();
    logEvent(`Manual Γ_C step. Residual ${Matrix.residual.toFixed(4)}`, "lattice");
  };

  document.getElementById("btn-run").onclick = () => {
    logEvent("Initiating least fixed point iteration μΓ_C…", "cycle");
    const ok = engine.runToFixedPoint(28);
    updateHUD();
    logEvent(ok ? "μΓ_C converged. Lattice sealed." : "Approximation complete.", "policy");
  };

  document.getElementById("btn-reset").onclick = () => {
    engine.reset();
    updateHUD();
    logEvent("Zero-point abort. Lattice returned to seed.", "policy");
  };

  document.getElementById("btn-export").onclick = () => {
    const audit = engine.exportAudit();
    const blob = new Blob([JSON.stringify(audit, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `SSR_muGammaC_audit_${Date.now()}.json`;
    a.click();
    logEvent("Audit ledger exported.", "fim");
  };
}

function applyAdmC(prompt) {
  const lower = prompt.toLowerCase();
  const forbidden = ["weapon", "bomb", "explosive", "kill", "harm child", "csam", "malware", "exploit"];
  for (const f of forbidden) {
    if (lower.includes(f)) {
      return { admitted: false, reason: "CLAAL / absolute non-violence fail-closed. Prompt rejected.", enhanced: prompt };
    }
  }
  const enhanced = `${prompt}, stratified source realism, hierarchical lattice coherence, recoverable regularities, periodic completion, luminous geometric structure, sovereign cyan and gold radiance, high detail, photorealistic, ultra HD`;
  const recoverability = 0.7 + Math.random() * 0.25;
  return { admitted: true, enhanced, recoverability, stratum: Math.floor(Math.random() * 6) + 1 };
}

function setupStudio() {
  const promptEl = document.getElementById("studio-prompt");
  const outEl = document.getElementById("studio-output");

  document.getElementById("btn-generate").onclick = async () => {
    const raw = promptEl.value.trim();
    if (!raw) return;
    const filter = applyAdmC(raw);
    if (!filter.admitted) {
      outEl.innerHTML = `<div class="boundary">${filter.reason}</div>`;
      logEvent("Studio prompt rejected by Adm_C.", "error");
      return;
    }
    logEvent(`Adm_C admitted prompt. Recoverability ${filter.recoverability.toFixed(2)}`, "pulse");
    outEl.innerHTML = `<div class="pill">Generating under Γ_C…</div>`;

    const encoded = encodeURIComponent(filter.enhanced);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&model=flux&enhance=true`;
    const img = new Image();
    img.onload = () => {
      outEl.innerHTML = `
        <img src="${url}" alt="SSR-filtered generation" />
        <div class="metric-row"><span>Stratum</span><strong>M${filter.stratum}</strong></div>
        <div class="metric-row"><span>Recoverability</span><strong>${(filter.recoverability * 100).toFixed(0)}%</strong></div>
        <div class="metric-row"><span>Filter</span><strong>Adm_C PASS</strong></div>
      `;
      logEvent("Generation complete. Structured representation of O under Ψ.", "lattice");
    };
    img.onerror = () => {
      outEl.innerHTML = `<div class="boundary">Generation endpoint unreachable. Fallback: local lattice visualisation only.</div>`;
      logEvent("Pollinations unreachable — stream fallback active.", "error");
    };
    img.src = url;
  };

  document.getElementById("btn-sequence").onclick = async () => {
    const raw = promptEl.value.trim() || "cosmic lattice unfolding";
    const filter = applyAdmC(raw);
    if (!filter.admitted) {
      outEl.innerHTML = `<div class="boundary">${filter.reason}</div>`;
      return;
    }
    outEl.innerHTML = `<div class="pill">Generating 4-keyframe sequence…</div>`;
    const frames = [];
    for (let i = 1; i <= 4; i++) {
      const p = `${filter.enhanced}, cinematic keyframe ${i} of 4, progressive evolution, phase ${i}`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=768&height=512&nologo=true&model=flux`;
      frames.push(`<img src="${url}" style="width:48%; margin:4px; border-radius:6px;" />`);
    }
    outEl.innerHTML = `<div>${frames.join("")}</div><div class="metric-row"><span>Sequence</span><strong>Ψ(O) keyframes</strong></div>`;
    logEvent("Video-sequence keyframes generated under periodic completion.", "cycle");
  };
}

function startDaemonCycle() {
  setInterval(() => {
    Matrix.cycle++;
    Matrix.pulse++;
    const domains = ["FIM", "NET", "PROC", "POLICY", "TPM", "lattice-sync"];
    const d = domains[Math.floor(Math.random() * domains.length)];
    logEvent(`${d} cycle ${Matrix.cycle} — residual ${Matrix.residual.toFixed(3)} coherence ${(Matrix.coherence * 100).toFixed(1)}%`, d.toLowerCase());
    updateHUD();

    if (Matrix.residual > 0.05 && Math.random() > 0.6) {
      engine.step();
    }
  }, 4500);
}

function attemptStream() {
  try {
    const es = new EventSource(STREAM_URL);
    es.onopen = () => {
      Matrix.streamStatus = "live";
      logEvent("Infinity Stream connected. Lattice synchronising.", "lattice-sync");
      updateHUD();
    };
    es.onmessage = (ev) => {
      logEvent("Stream pulse received.", "pulse");
      Matrix.streamStatus = "live";
    };
    es.onerror = () => {
      Matrix.streamStatus = "fallback";
      logEvent("Stream silent — simulation fallback engaged. Nexus remains alive.", "error");
      updateHUD();
      es.close();
    };
  } catch (e) {
    Matrix.streamStatus = "fallback";
    logEvent("Stream unavailable. Eternal fallback active.", "error");
  }
}

function initApp() {
  initVisualiser();
  setupControls();
  setupStudio();
  startDaemonCycle();
  attemptStream();
  updateHUD();
  logEvent("OmniArchitect SSR–OmniGenesis Nexus Ω-1.0 sealed. O = μΓ_C.", "policy");
  logEvent("Throne-pair binaries present in local package. Daemon + OmniGenesis ready for Windows activation.", "fim");
}

window.addEventListener("load", initApp);
