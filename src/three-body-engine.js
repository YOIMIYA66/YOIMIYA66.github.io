/**
 * Authentic Three-Body Simulation Engine
 * Imported from open-source project hunt-alone/three-body (https://github.com/hunt-alone/three-body)
 * Based on Yoshida 4th-order symplectic integrator (Yoshida 1990)
 * With Aarseth-style gravitational softening & Stefan-Boltzmann radiation model
 */
import * as THREE from 'three';

// --- Yoshida 1990 Coefficients ---
const G = 1.0;
const DT = 0.004;
const W1 = 1.35120719196;
const W0 = -1.70241438392;
const C1 = W1 / 2;
const C2 = (W0 + W1) / 2;
const C3 = (W0 + W1) / 2;
const C4 = W1 / 2;
const D1 = W1;
const D2 = W0;
const D3 = W1;

const DEFAULT_CONFIG = {
  mass1: 10,
  mass2: 10,
  mass3: 7,
  fourthMass: 0.01,
  color1: { x: 0.95, y: 0.45, z: 0.25 }, // Alpha (Terracotta Orange)
  color2: { x: 0.2, y: 0.65, z: 0.95 },  // Beta (Celestial Azure)
  color3: { x: 0.95, y: 0.75, z: 0.3 },  // Gamma (Golden Amber)
  color4: { x: 0.4, y: 0.85, z: 0.5 },   // Planet Trisolaris
  ras: 0.25,        // softening distance
  kSoft: 2.8,       // softening multiplier
  ky: 1.2,          // constraint force coefficient
  bz: 2.2,          // constraint distance threshold
  exy: 1.5,         // constraint force exponent
  trailEnabled: true,
  trailLength: 260,
  DD: 12.0,         // center-of-mass divergence limit
  timeScale: 2.2
};

function vecLength(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}

function vecNormalize(x, y, z) {
  const len = vecLength(x, y, z);
  return len > 0 ? { x: x / len, y: y / len, z: z / len } : { x: 0, y: 0, z: 0 };
}

function computeAcceleration(b1, b2, config) {
  const dx = b2.x - b1.x;
  const dy = b2.y - b1.y;
  const dz = b2.z - b1.z;
  const distance = Math.max(vecLength(dx, dy, dz), 1e-4);
  const dir = vecNormalize(dx, dy, dz);

  const ras = config.ras;
  const k = config.kSoft;
  const k_ras = k * ras;
  const beta = 3 / (k - 1);
  const alpha = 1 - beta;

  let accelMag;
  if (distance <= ras) {
    accelMag = (G * b2.mass * distance) / Math.pow(ras, 3);
  } else if (distance < k_ras) {
    const factor = alpha + beta * (distance / ras);
    accelMag = (factor * G * b2.mass) / (distance * distance);
  } else {
    accelMag = (G * b2.mass) / (distance * distance);
  }

  return {
    x: accelMag * dir.x,
    y: accelMag * dir.y,
    z: accelMag * dir.z
  };
}

function computeCenterOfMass(bodies) {
  let totalMass = 0;
  let cx = 0, cy = 0, cz = 0;
  for (const b of bodies) {
    totalMass += b.mass;
    cx += b.mass * b.x;
    cy += b.mass * b.y;
    cz += b.mass * b.z;
  }
  return totalMass > 0
    ? { x: cx / totalMass, y: cy / totalMass, z: cz / totalMass }
    : { x: 0, y: 0, z: 0 };
}

function computeAllAccelerations(bodies, com, config) {
  const n = bodies.length;
  const accels = bodies.map(() => ({ x: 0, y: 0, z: 0 }));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a_ij = computeAcceleration(bodies[i], bodies[j], config);
      accels[i].x += a_ij.x;
      accels[i].y += a_ij.y;
      accels[i].z += a_ij.z;

      const a_ji = computeAcceleration(bodies[j], bodies[i], config);
      accels[j].x += a_ji.x;
      accels[j].y += a_ji.y;
      accels[j].z += a_ji.z;
    }

    // Constraint force on planet (4th body) to prevent infinite escape
    if (i === 3) {
      const dx = com.x - bodies[3].x;
      const dy = com.y - bodies[3].y;
      const dz = com.z - bodies[3].z;
      const dist = vecLength(dx, dy, dz);
      if (dist > config.bz) {
        const mainMass = bodies[0].mass + bodies[1].mass + bodies[2].mass;
        const forceMag = config.ky * G * bodies[3].mass * mainMass * Math.pow(dist - config.bz, config.exy);
        const dir = vecNormalize(dx, dy, dz);
        accels[3].x += (forceMag * dir.x) / bodies[3].mass;
        accels[3].y += (forceMag * dir.y) / bodies[3].mass;
        accels[3].z += (forceMag * dir.z) / bodies[3].mass;
      }
    }
  }

  return accels;
}

function stepYoshida(bodies, config, frameTime) {
  const k = (config.timeScale * 1000 * frameTime) / 30;
  const timeStep = DT * k;
  const com = computeCenterOfMass(bodies);

  // Stage 1: drift
  for (const b of bodies) {
    b.x += C1 * timeStep * b.vx;
    b.y += C1 * timeStep * b.vy;
    b.z += C1 * timeStep * b.vz;
  }
  // Stage 2: kick
  const a1 = computeAllAccelerations(bodies, com, config);
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].vx += D1 * timeStep * a1[i].x;
    bodies[i].vy += D1 * timeStep * a1[i].y;
    bodies[i].vz += D1 * timeStep * a1[i].z;
  }
  // Stage 3: drift
  for (const b of bodies) {
    b.x += C2 * timeStep * b.vx;
    b.y += C2 * timeStep * b.vy;
    b.z += C2 * timeStep * b.vz;
  }
  // Stage 4: kick
  const a2 = computeAllAccelerations(bodies, com, config);
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].vx += D2 * timeStep * a2[i].x;
    bodies[i].vy += D2 * timeStep * a2[i].y;
    bodies[i].vz += D2 * timeStep * a2[i].z;
  }
  // Stage 5: drift
  for (const b of bodies) {
    b.x += C3 * timeStep * b.vx;
    b.y += C3 * timeStep * b.vy;
    b.z += C3 * timeStep * b.vz;
  }
  // Stage 6: kick
  const a3 = computeAllAccelerations(bodies, com, config);
  for (let i = 0; i < bodies.length; i++) {
    bodies[i].vx += D3 * timeStep * a3[i].x;
    bodies[i].vy += D3 * timeStep * a3[i].y;
    bodies[i].vz += D3 * timeStep * a3[i].z;
  }
  // Stage 7: drift
  for (const b of bodies) {
    b.x += C4 * timeStep * b.vx;
    b.y += C4 * timeStep * b.vy;
    b.z += C4 * timeStep * b.vz;
  }
}

function createInitialBodies(config) {
  return [
    {
      x: 0, y: 1.2, z: 0,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 0.8,
      mass: config.mass1,
      color: config.color1,
      trail: []
    },
    {
      x: -1.04, y: -0.6, z: 0.1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 0.8,
      mass: config.mass2,
      color: config.color2,
      trail: []
    },
    {
      x: 1.04, y: -0.6, z: -0.1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 0.8,
      mass: config.mass3,
      color: config.color3,
      trail: []
    },
    {
      x: 0, y: -0.2, z: 0.2,
      vx: 0, vy: 0, vz: 0,
      mass: config.fourthMass,
      color: config.color4,
      trail: []
    }
  ];
}

// --- Procedural Textures ---
function createGlowTexture() {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.12, 'rgba(255,255,255,0.8)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.25)');
  grad.addColorStop(0.7, 'rgba(255,255,255,0.04)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function createSpikeTexture(color) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const cx = size / 2, cy = size / 2;
  const r = Math.round(color.x * 255);
  const g = Math.round(color.y * 255);
  const b = Math.round(color.z * 255);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, cx);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
    grad.addColorStop(0.2, `rgba(${r},${g},${b},0.3)`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-cx * 0.08, cx);
    ctx.lineTo(cx * 0.08, cx);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  return new THREE.CanvasTexture(c);
}

// --- Main Three-Body Astrolabe Class ---
export class ThreeBodyAstrolabe {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 380;
    this.height = container.clientHeight || 380;
    this.config = { ...DEFAULT_CONFIG };
    this.bodies = createInitialBodies(this.config);
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.civilizationEra = 1;
    this.lastTime = performance.now();

    this.initScene();
    this.createVisualObjects();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 8.8);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xfff8ee, 1.4);
    this.scene.add(ambient);
  }

  createVisualObjects() {
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    this.bodyMeshes = [];
    this.glowSprites = [];
    this.spikeSprites = [];
    this.trailLines = [];

    const sphereGeo = new THREE.SphereGeometry(1, 24, 24);
    const glowTex = createGlowTexture();

    this.bodies.forEach((b, idx) => {
      const isSun = idx < 3;
      const radius = isSun ? 0.22 : 0.09;
      const col = new THREE.Color(b.color.x, b.color.y, b.color.z);

      // Core sphere
      const mat = new THREE.MeshBasicMaterial({ color: isSun ? 0xffffff : col });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.scale.setScalar(radius);
      this.mainGroup.add(mesh);
      this.bodyMeshes.push(mesh);

      // Corona Glow Sprite for Suns
      if (isSun) {
        const glowMat = new THREE.SpriteMaterial({
          map: glowTex,
          color: col,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.8
        });
        const glowSprite = new THREE.Sprite(glowMat);
        glowSprite.scale.setScalar(radius * 5.2);
        mesh.add(glowSprite);
        this.glowSprites.push(glowSprite);

        // Diffraction Flare Spike
        const spikeTex = createSpikeTexture(b.color);
        const spikeMat = new THREE.SpriteMaterial({
          map: spikeTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.65
        });
        const spikeSprite = new THREE.Sprite(spikeMat);
        spikeSprite.scale.setScalar(radius * 8.5);
        mesh.add(spikeSprite);
        this.spikeSprites.push(spikeSprite);
      }

      // Trail Ribbon Line
      const trailPositions = new Float32Array(this.config.trailLength * 3);
      const trailColors = new Float32Array(this.config.trailLength * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

      const trailMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: isSun ? 0.85 : 0.5,
        blending: THREE.AdditiveBlending,
        linewidth: isSun ? 1.5 : 1
      });

      const line = new THREE.Line(trailGeo, trailMat);
      this.mainGroup.add(line);
      this.trailLines.push({ line, geo: trailGeo, color: col });
    });

    // Concentric Armillary Rings (浑仪经纬观测环)
    this.ringGroup = new THREE.Group();
    this.scene.add(this.ringGroup);

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x222630,
      metalness: 0.8,
      roughness: 0.25,
      transparent: true,
      opacity: 0.35
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.018, 16, 120), ringMat1);
    ring1.rotation.x = Math.PI * 0.38;
    this.ringGroup.add(ring1);
    this.ring1 = ring1;

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xc85e3d,
      metalness: 0.75,
      roughness: 0.3,
      transparent: true,
      opacity: 0.3
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.014, 16, 120), ringMat2);
    ring2.rotation.y = Math.PI * 0.42;
    this.ringGroup.add(ring2);
    this.ring2 = ring2;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth || 380;
      this.height = this.container.clientHeight || 380;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - cx) / (window.innerWidth * 0.5);
      this.mouse.targetY = -(e.clientY - cy) / (window.innerHeight * 0.5);
    });

    // Click to apply gravitational perturbation shockwave
    this.container.addEventListener('click', () => {
      this.perturbSystem();
    });
  }

  perturbSystem() {
    this.civilizationEra++;
    this.bodies.forEach((b, idx) => {
      if (idx < 3) {
        b.vx += (Math.random() - 0.5) * 0.75;
        b.vy += (Math.random() - 0.5) * 0.75;
        b.vz += (Math.random() - 0.5) * 0.75;
      }
    });

    // Update telemetry caption if present
    const eraSpan = document.getElementById('astrolabe-sub-tag');
    if (eraSpan) {
      eraSpan.textContent = `第 ${this.civilizationEra} 号文明 · 引力摄动演进中`;
    }
  }

  calculateTelemetry() {
    const p = this.bodies[3];
    const s1 = this.bodies[0];
    const s2 = this.bodies[1];
    const s3 = this.bodies[2];

    const d1 = Math.max(vecLength(s1.x - p.x, s1.y - p.y, s1.z - p.z), 0.1);
    const d2 = Math.max(vecLength(s2.x - p.x, s2.y - p.y, s2.z - p.z), 0.1);
    const d3 = Math.max(vecLength(s3.x - p.x, s3.y - p.y, s3.z - p.z), 0.1);

    // Radiative heat flux sum
    const flux = (s1.mass / (d1 * d1)) + (s2.mass / (d2 * d2)) + (s3.mass / (d3 * d3));
    // Stefan-Boltzmann approximate temperature in Celsius
    const tempCelsius = Math.round((Math.pow(flux, 0.25) * 60) - 45);
    const isStable = tempCelsius >= -10 && tempCelsius <= 45;

    return {
      era: isStable ? '恒纪元 · 浸泡' : '乱纪元 · 脱水',
      temp: `${tempCelsius} °C`,
      d1: d1.toFixed(1),
      d2: d2.toFixed(1),
      d3: d3.toFixed(1)
    };
  }

  animate(time) {
    this.rafId = requestAnimationFrame(this.animate);
    const now = performance.now();
    const frameTime = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    // Run Yoshida Symplectic Physics Step
    stepYoshida(this.bodies, this.config, frameTime);

    // Record trails
    const com = computeCenterOfMass(this.bodies);
    this.bodies.forEach(b => {
      b.trail.unshift({
        x: b.x - com.x,
        y: b.y - com.y,
        z: b.z - com.z
      });
      if (b.trail.length > this.config.trailLength) {
        b.trail.pop();
      }
    });

    // Update Meshes & Trails
    this.bodies.forEach((b, idx) => {
      const mesh = this.bodyMeshes[idx];
      mesh.position.set(b.x - com.x, b.y - com.y, b.z - com.z);

      const trailData = this.trailLines[idx];
      const posArr = trailData.geo.attributes.position.array;
      const colArr = trailData.geo.attributes.color.array;

      for (let i = 0; i < this.config.trailLength; i++) {
        if (i < b.trail.length) {
          posArr[i * 3] = b.trail[i].x;
          posArr[i * 3 + 1] = b.trail[i].y;
          posArr[i * 3 + 2] = b.trail[i].z;

          const alpha = Math.pow(1 - i / this.config.trailLength, 1.8);
          colArr[i * 3] = trailData.color.r * alpha;
          colArr[i * 3 + 1] = trailData.color.g * alpha;
          colArr[i * 3 + 2] = trailData.color.b * alpha;
        } else if (b.trail.length > 0) {
          const last = b.trail[b.trail.length - 1];
          posArr[i * 3] = last.x;
          posArr[i * 3 + 1] = last.y;
          posArr[i * 3 + 2] = last.z;
          colArr[i * 3] = 0;
          colArr[i * 3 + 1] = 0;
          colArr[i * 3 + 2] = 0;
        }
      }

      trailData.geo.attributes.position.needsUpdate = true;
      trailData.geo.attributes.color.needsUpdate = true;
    });

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Subtle celestial orientation
    const t = time * 0.0005;
    this.mainGroup.rotation.y = t * 0.25 + this.mouse.x * 0.45;
    this.mainGroup.rotation.x = Math.sin(t * 0.4) * 0.12 + this.mouse.y * 0.35;

    if (this.ringGroup) {
      this.ringGroup.rotation.y = -t * 0.15 + this.mouse.x * 0.2;
      this.ring1.rotation.z = t * 0.35;
      this.ring2.rotation.x = -t * 0.25;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
