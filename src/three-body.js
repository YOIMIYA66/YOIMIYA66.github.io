import * as THREE from 'three';

export class ThreeBodyAstrolabe {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = canvasContainer.clientWidth || 380;
    this.height = canvasContainer.clientHeight || 380;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.timeScale = 1.0;

    this.init();
    this.createThreeBodySystem();
    this.createArmillaryRings();
    this.createStarField();
    this.addEvents();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 8.5);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // Warm atmospheric lighting
    const ambient = new THREE.AmbientLight(0xfff8ee, 1.2);
    this.scene.add(ambient);
  }

  createThreeBodySystem() {
    this.systemGroup = new THREE.Group();
    this.scene.add(this.systemGroup);

    // Three Sun Bodies Configuration
    // Body 1: Terracotta / Crimson Star (Massive Alpha)
    // Body 2: Cyan Azure Star (Swift Beta)
    // Body 3: Luminous Golden / Pearl Star (Gamma)
    this.bodies = [
      {
        pos: new THREE.Vector3(1.6, 0.5, 0.0),
        vel: new THREE.Vector3(0.0, 1.1, 0.5),
        mass: 1.8,
        color: 0xc76f50,
        lightColor: 0xff7b54,
        size: 0.24,
        trail: []
      },
      {
        pos: new THREE.Vector3(-1.5, -0.6, 0.4),
        vel: new THREE.Vector3(0.4, -0.9, -0.6),
        mass: 1.5,
        color: 0x0ea5e9,
        lightColor: 0x38bdf8,
        size: 0.20,
        trail: []
      },
      {
        pos: new THREE.Vector3(0.1, 1.4, -0.5),
        vel: new THREE.Vector3(-0.9, 0.2, 0.2),
        mass: 1.3,
        color: 0xd97706,
        lightColor: 0xfbbf24,
        size: 0.18,
        trail: []
      }
    ];

    this.bodyMeshes = [];
    this.trailLines = [];
    this.maxTrailLength = 120;

    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

    this.bodies.forEach((body) => {
      // Core glowing star
      const starMat = new THREE.MeshBasicMaterial({
        color: body.lightColor
      });
      const starMesh = new THREE.Mesh(sphereGeo, starMat);
      starMesh.scale.setScalar(body.size);

      // Corona glow aura
      const auraGeo = new THREE.SphereGeometry(1, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: body.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      auraMesh.scale.setScalar(body.size * 2.2);
      starMesh.add(auraMesh);

      // PointLight emitted by star
      const pLight = new THREE.PointLight(body.lightColor, 2.5, 12);
      starMesh.add(pLight);

      this.systemGroup.add(starMesh);
      this.bodyMeshes.push(starMesh);

      // Orbital Trail Ribbon
      const trailPositions = new Float32Array(this.maxTrailLength * 3);
      const trailColors = new Float32Array(this.maxTrailLength * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

      const trailMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        linewidth: 1.5
      });

      const trailLine = new THREE.Line(trailGeo, trailMat);
      this.systemGroup.add(trailLine);
      this.trailLines.push({
        line: trailLine,
        geo: trailGeo,
        color: new THREE.Color(body.color)
      });
    });

    // Gravitational center marker / Syzygy indicator
    const barycenterGeo = new THREE.RingGeometry(0.04, 0.08, 16);
    const barycenterMat = new THREE.MeshBasicMaterial({
      color: 0x8da2b6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    this.barycenter = new THREE.Mesh(barycenterGeo, barycenterMat);
    this.systemGroup.add(this.barycenter);
  }

  createArmillaryRings() {
    this.astrolabeRings = new THREE.Group();
    this.scene.add(this.astrolabeRings);

    // Ecliptic coordinate ring (三体黄道观测环)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x2a3040,
      metalness: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.4
    });
    const ringGeo1 = new THREE.TorusGeometry(3.0, 0.018, 16, 120);
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI * 0.4;
    this.astrolabeRings.add(this.ring1);

    // Celestial Meridian Ring (子午仪环)
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xc76f50,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.35
    });
    const ringGeo2 = new THREE.TorusGeometry(3.2, 0.014, 16, 120);
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI * 0.35;
    this.astrolabeRings.add(this.ring2);

    // Equatorial Ring (赤道环带刻度)
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x8da2b6,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const ringGeo3 = new THREE.TorusGeometry(2.6, 0.04, 6, 80);
    this.ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    this.ring3.rotation.x = Math.PI * 0.15;
    this.astrolabeRings.add(this.ring3);
  }

  createStarField() {
    const starCount = 90;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 3.6 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.sin(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.05,
      transparent: true,
      opacity: 0.5
    });
    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth || 380;
      this.height = this.container.clientHeight || 380;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - centerX) / (window.innerWidth * 0.5);
      this.mouse.targetY = -(e.clientY - centerY) / (window.innerHeight * 0.5);
    });

    // Interactive gravitational pulse on click!
    this.container.addEventListener('click', () => {
      this.bodies.forEach(b => {
        b.vel.x += (Math.random() - 0.5) * 0.8;
        b.vel.y += (Math.random() - 0.5) * 0.8;
        b.vel.z += (Math.random() - 0.5) * 0.8;
      });
    });
  }

  // Symplectic gravitational physics update for the 3 bodies
  updatePhysics(dt) {
    const G = 2.2;
    const softening = 0.45; // Prevents slingshot singularity
    const maxBound = 2.8;

    // Calculate pairwise Newtonian forces
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        const bi = this.bodies[i];
        const bj = this.bodies[j];

        const diff = new THREE.Vector3().subVectors(bj.pos, bi.pos);
        const distSq = diff.lengthSq() + softening * softening;
        const dist = Math.sqrt(distSq);
        const forceMag = (G * bi.mass * bj.mass) / (distSq * dist);

        const force = diff.multiplyScalar(forceMag);

        bi.vel.addScaledVector(force, dt / bi.mass);
        bj.vel.addScaledVector(force, -dt / bj.mass);
      }
    }

    // Soft restorative bounding potential to keep the chaotic dance visible in frame
    this.bodies.forEach((b) => {
      const distFromCenter = b.pos.length();
      if (distFromCenter > maxBound) {
        const pull = b.pos.clone().negate().normalize().multiplyScalar((distFromCenter - maxBound) * 2.5);
        b.vel.addScaledVector(pull, dt);
      }
      // Velocity damping for perpetual aesthetic flow
      b.vel.multiplyScalar(0.999);
      b.pos.addScaledVector(b.vel, dt);
    });

    // Calculate Barycenter
    let totalMass = 0;
    const center = new THREE.Vector3();
    this.bodies.forEach(b => {
      center.addScaledVector(b.pos, b.mass);
      totalMass += b.mass;
    });
    center.divideScalar(totalMass);
    if (this.barycenter) {
      this.barycenter.position.copy(center);
    }
  }

  animate(time) {
    this.rafId = requestAnimationFrame(this.animate);
    const dt = 0.014;

    // Run physics step
    this.updatePhysics(dt);

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Update body meshes & trails
    this.bodies.forEach((b, idx) => {
      const mesh = this.bodyMeshes[idx];
      mesh.position.copy(b.pos);

      // Record trail point
      b.trail.unshift(b.pos.clone());
      if (b.trail.length > this.maxTrailLength) {
        b.trail.pop();
      }

      // Update trail geometry buffer
      const trailData = this.trailLines[idx];
      const positions = trailData.geo.attributes.position.array;
      const colors = trailData.geo.attributes.color.array;

      for (let i = 0; i < this.maxTrailLength; i++) {
        if (i < b.trail.length) {
          positions[i * 3] = b.trail[i].x;
          positions[i * 3 + 1] = b.trail[i].y;
          positions[i * 3 + 2] = b.trail[i].z;

          // Fade out towards tail
          const alpha = Math.pow(1 - i / this.maxTrailLength, 1.8);
          colors[i * 3] = trailData.color.r * alpha;
          colors[i * 3 + 1] = trailData.color.g * alpha;
          colors[i * 3 + 2] = trailData.color.b * alpha;
        } else if (b.trail.length > 0) {
          const last = b.trail[b.trail.length - 1];
          positions[i * 3] = last.x;
          positions[i * 3 + 1] = last.y;
          positions[i * 3 + 2] = last.z;
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 0;
          colors[i * 3 + 2] = 0;
        }
      }

      trailData.geo.attributes.position.needsUpdate = true;
      trailData.geo.attributes.color.needsUpdate = true;
    });

    // Slow celestial rotation + responsive tilt
    const t = time * 0.0006;
    this.systemGroup.rotation.y = t * 0.3 + this.mouse.x * 0.5;
    this.systemGroup.rotation.x = Math.sin(t * 0.5) * 0.15 + this.mouse.y * 0.4;

    if (this.astrolabeRings) {
      this.astrolabeRings.rotation.y = -t * 0.2 + this.mouse.x * 0.25;
      this.astrolabeRings.rotation.z = Math.cos(t * 0.4) * 0.1;
      this.ring1.rotation.z = t * 0.4;
      this.ring2.rotation.x = -t * 0.3;
    }

    if (this.stars) {
      this.stars.rotation.y = t * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
