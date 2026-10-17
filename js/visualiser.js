/**
 * SSR Stratified Lattice Visualiser
 * Nested icosahedral shells for strata M0–M7
 * Guarded against missing THREE
 */

let scene, camera, renderer, shells = [], particles, rings = [];
let coreMesh, time = 0;
let visualiserReady = false;

function initVisualiser() {
  if (typeof THREE === "undefined") {
    if (typeof logEvent === "function") logEvent("THREE not available — visualiser skipped. Lattice remains functional.", "error");
    return;
  }
  const container = document.getElementById("canvas-container");
  if (!container) return;

  try {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.012);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 8, 22);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x1a2a40, 0.4));
    const dir = new THREE.DirectionalLight(0x00e5ff, 0.6);
    dir.position.set(10, 20, 10);
    scene.add(dir);
    const goldLight = new THREE.PointLight(0xffd700, 1.2, 40);
    goldLight.position.set(0, 0, 0);
    scene.add(goldLight);

    const coreGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.2
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    if (typeof STRATA !== "undefined") {
      STRATA.forEach((s, i) => {
        const radius = 2.2 + i * 1.35;
        const geo = new THREE.IcosahedronGeometry(radius, 1);
        const mat = new THREE.MeshBasicMaterial({
          color: s.color,
          wireframe: true,
          transparent: true,
          opacity: 0.18 + (i * 0.02)
        });
        const shell = new THREE.Mesh(geo, mat);
        shell.userData = { stratum: i, radius };
        shells.push(shell);
        scene.add(shell);

        const ringGeo = new THREE.TorusGeometry(radius * 0.85, 0.03, 8, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: 0.35
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        rings.push(ring);
        scene.add(ring);
      });
    }

    const pCount = 420;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = new THREE.Color(STRATA[Math.floor(Math.random() * 8)].color);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    window.addEventListener("resize", onResize);
    visualiserReady = true;
    animate();
  } catch (e) {
    if (typeof logEvent === "function") logEvent("Visualiser init failed safely: " + e.message, "error");
  }
}

function onResize() {
  if (!visualiserReady || !camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if (!visualiserReady) return;
  requestAnimationFrame(animate);
  time += 0.004;

  shells.forEach((sh, i) => {
    sh.rotation.y = time * (0.15 + i * 0.02);
    sh.rotation.x = Math.sin(time * 0.3 + i) * 0.1;
    const active = (typeof Matrix !== "undefined") && Matrix.currentStratum === i;
    sh.material.opacity = active ? 0.55 : 0.18 + (i * 0.015);
    sh.material.color.set(active ? 0xffd700 : STRATA[i].color);
  });

  rings.forEach((r, i) => {
    r.rotation.z = time * (0.4 + i * 0.05);
  });

  if (particles) {
    particles.rotation.y = time * 0.08;
  }

  if (coreMesh && typeof Matrix !== "undefined") {
    const scale = 1 + Matrix.coherence * 0.6 + Math.sin(time * 3) * 0.05;
    coreMesh.scale.setScalar(scale);
    coreMesh.material.emissiveIntensity = 0.6 + Matrix.coherence * 1.4;
    coreMesh.rotation.y = time * 0.5;
  }

  camera.position.x = Math.sin(time * 0.15) * 4;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

window.initVisualiser = initVisualiser;
