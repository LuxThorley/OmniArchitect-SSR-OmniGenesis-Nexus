/**
 * OmniArchitect SSR–OmniGenesis Nexus Core
 * Computational realisation of Stratified Source Realism
 * O = μΓ_C   |   Source ≡ generative role of Γ_C
 *
 * HONEST BOUNDARY
 * This is a formal mathematical and computational model implementing
 * Knaster–Tarski least fixed point iteration on a complete lattice of
 * admissible structural objects under monotone constrained generation.
 * It is not a claim that software constitutes total reality, nor a
 * physical time machine, nor an empirically verified universal ontology.
 * Supreme Sovereign: Oliver Lux Prime
 */

const Matrix = {
  coherence: 0.0,
  cycle: 0,
  pulse: 0,
  residual: 1.0,
  fixedPointSize: 0,
  iterations: 0,
  currentStratum: 0,
  events: [],
  streamStatus: "fallback",
  policySeal: "DUL_ClassA_Omniversal_Seal_Ω",
  bsi: 0.85
};

const STRATA = [
  { id: 0, name: "M0 Foundational primitives", color: 0x00e5ff },
  { id: 1, name: "M1 Relational structure", color: 0x4fc3f7 },
  { id: 2, name: "M2 State configurations", color: 0x81c784 },
  { id: 3, name: "M3 Physical spacetime", color: 0xffd54f },
  { id: 4, name: "M4 Quantum / information", color: 0xce93d8 },
  { id: 5, name: "M5 Unified structural", color: 0xffb74d },
  { id: 6, name: "M6 Global consistency", color: 0xff8a65 },
  { id: 7, name: "M7+ Meta-structure", color: 0xffd700 }
];

const SEED_OBJECTS = [
  { id: "prim-void", stratum: 0, tags: ["potential", "empty-set"], recoverability: 1.0, cycle: 0 },
  { id: "rel-inclusion", stratum: 1, tags: ["partial-order", "restriction"], recoverability: 0.95, cycle: 0 },
  { id: "state-coherence", stratum: 2, tags: ["configuration", "recoverable"], recoverability: 0.9, cycle: 1 },
  { id: "phys-spacetime", stratum: 3, tags: ["geometry", "metric"], recoverability: 0.85, cycle: 2 },
  { id: "quant-info", stratum: 4, tags: ["entanglement", "channel"], recoverability: 0.8, cycle: 3 },
  { id: "chem-reaction", stratum: 5, tags: ["molecular", "bond"], recoverability: 0.75, cycle: 4 },
  { id: "bio-agency", stratum: 6, tags: ["agency", "periodic-completion"], recoverability: 0.7, cycle: 5 },
  { id: "meta-source", stratum: 7, tags: ["generative", "Γ_C"], recoverability: 0.95, cycle: 0 }
];

class SSREngine {
  constructor() {
    this.U = new Set();
    this.history = [];
    this.reset();
  }

  reset() {
    this.current = new Set(SEED_OBJECTS.map(o => this.freeze(o)));
    this.iterations = 0;
    this.residual = 1.0;
    Matrix.fixedPointSize = this.current.size;
    Matrix.residual = 1.0;
    this.log("Zero-point initialised. Lattice bottom seeded.");
  }

  freeze(obj) {
    return JSON.stringify(obj);
  }

  thaw(str) {
    return JSON.parse(str);
  }

  generate(X) {
    const candidates = [];
    const objs = [...X].map(s => this.thaw(s));
    for (const o of objs) {
      if (o.stratum < 7) {
        const next = {
          id: `${o.id}-ext-${this.iterations}`,
          stratum: o.stratum + 1,
          tags: [...o.tags, "extension", "restriction-preserved"],
          recoverability: Math.max(0.5, o.recoverability - 0.05 + Math.random() * 0.08),
          cycle: (o.cycle + 1) % 12,
          parent: o.id
        };
        candidates.push(next);
      }
      if (o.tags.includes("agency") || o.stratum >= 6) {
        const periodic = {
          id: `${o.id}-zodiac-${this.iterations}`,
          stratum: o.stratum,
          tags: [...o.tags, "zodiacal-completion", "recoverable-regularity"],
          recoverability: Math.min(1.0, o.recoverability + 0.1),
          cycle: (o.cycle + 1) % 12,
          parent: o.id
        };
        candidates.push(periodic);
      }
    }
    return candidates;
  }

  adm_C(candidate) {
    const forbidden = ["weapon", "explosive", "harm-intent", "coercion"];
    if (candidate.tags.some(t => forbidden.some(f => t.includes(f)))) return false;
    if (candidate.recoverability < 0.45) return false;
    if (candidate.stratum > 0 && !candidate.parent && !candidate.tags.includes("foundational")) return false;
    return true;
  }

  gamma_C(X) {
    const generated = this.generate(X);
    const admitted = generated.filter(c => this.adm_C(c));
    const newSet = new Set(X);
    for (const a of admitted) {
      newSet.add(this.freeze(a));
    }
    return newSet;
  }

  step() {
    const before = this.current.size;
    const next = this.gamma_C(this.current);
    this.residual = Math.abs(next.size - before) / Math.max(1, next.size);
    this.current = next;
    this.iterations++;
    Matrix.iterations = this.iterations;
    Matrix.fixedPointSize = this.current.size;
    Matrix.residual = this.residual;
    Matrix.coherence = Math.max(0, Math.min(1, 1 - this.residual));
    Matrix.currentStratum = Math.min(7, Math.floor(this.iterations / 2));
    this.log(`Γ_C step ${this.iterations}: |X| = ${this.current.size}  residual = ${this.residual.toFixed(4)}`);
    return this.residual < 0.01;
  }

  runToFixedPoint(maxIter = 24) {
    this.reset();
    for (let i = 0; i < maxIter; i++) {
      const converged = this.step();
      if (converged) {
        this.log(`Least fixed point μΓ_C reached in ${this.iterations} iterations. |O| = ${this.current.size}`);
        Matrix.coherence = 0.97;
        return true;
      }
    }
    this.log(`Max iterations reached. Approximating μΓ_C. |X| = ${this.current.size}`);
    return false;
  }

  log(msg) {
    const entry = { ts: new Date().toISOString(), msg, type: "lattice" };
    Matrix.events.unshift(entry);
    if (Matrix.events.length > 80) Matrix.events.pop();
    console.log("[SSR]", msg);
  }

  exportAudit() {
    return {
      equation: "O = μΓ_C , Γ_C(O) = O",
      source: "generative role of Γ_C",
      iterations: this.iterations,
      size: this.current.size,
      residual: this.residual,
      coherence: Matrix.coherence,
      objects: [...this.current].map(s => this.thaw(s)),
      policy: Matrix.policySeal,
      boundary: "Formal model only. Not empirically verified total reality."
    };
  }
}

const engine = new SSREngine();

function computeBSI(love = 0.9, egoTrans = 0.85, restorative = 0.9, residualHarm = 0.05) {
  return (love * egoTrans * restorative) / (1 + residualHarm);
}
Matrix.bsi = computeBSI();

window.SSR = { Matrix, STRATA, engine, computeBSI };
