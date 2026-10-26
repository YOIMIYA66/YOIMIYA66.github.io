import * as THREE from 'three';

export class SculptureScene {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scrollProgress = 0;
    this.targetScroll = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.activeThemeColor = new THREE.Color(0x38bdf8);
    this.targetThemeColor = new THREE.Color(0x38bdf8);

    this.init();
    this.createSculpture();
    this.createBackgroundParticles();
    this.addEventListeners();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 16);

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

    // Dynamic studio lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.mainLight.position.set(10, 15, 12);
    this.scene.add(this.mainLight);

    this.accentLight1 = new THREE.PointLight(0x38bdf8, 3.5, 30);
    this.accentLight1.position.set(-8, 5, 6);
    this.scene.add(this.accentLight1);

    this.accentLight2 = new THREE.PointLight(0xf59e0b, 3.0, 30);
    this.accentLight2.position.set(8, -6, 4);
    this.scene.add(this.accentLight2);
  }

  createSculpture() {
    this.sculptureGroup = new THREE.Group();
    this.scene.add(this.sculptureGroup);

    // Shared high-refractive glass material
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.08,
      roughness: 0.12,
      transmission: 0.9,
      thickness: 1.8,
      ior: 1.55,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.92,
      wireframe: false
    });

    this.coreGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });

    this.facetsMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    // Spline curves forming a kinetic sculptural monogram:
    // Stroke 1: Left pillar / L stem with curved flare
    const curve1Points = [
      new THREE.Vector3(-3.2, 3.8, 0.4),
      new THREE.Vector3(-3.0, 1.2, -0.3),
      new THREE.Vector3(-2.8, -1.8, 0.2),
      new THREE.Vector3(-2.6, -3.2, -0.2),
      new THREE.Vector3(-0.8, -3.4, 0.5),
      new THREE.Vector3(1.2, -3.2, -0.4)
    ];

    // Stroke 2: Central elegant B loop and upper cusp
    const curve2Points = [
      new THREE.Vector3(-1.8, 3.6, -0.5),
      new THREE.Vector3(0.2, 3.8, 0.8),
      new THREE.Vector3(1.9, 2.2, 0.3),
      new THREE.Vector3(0.0, 0.4, -0.4),
      new THREE.Vector3(2.4, -0.8, 0.6),
      new THREE.Vector3(1.2, -2.8, -0.3),
      new THREE.Vector3(-1.4, -2.6, 0.4)
    ];

    // Stroke 3: Dynamic sweeping R wing / kinetic diagonal ribbon
    const curve3Points = [
      new THREE.Vector3(0.0, 0.5, 0.4),
      new THREE.Vector3(1.2, -0.2, -0.6),
      new THREE.Vector3(2.6, -1.8, 0.7),
      new THREE.Vector3(3.8, -3.5, -0.2)
    ];

    // Stroke 4: Prismatic halo ring orbiting the structure (representing benchmark boundary)
    const curve4Points = [];
    const ringRadius = 4.2;
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      curve4Points.push(
        new THREE.Vector3(
          Math.cos(angle) * ringRadius,
          Math.sin(angle) * (ringRadius * 0.75),
          Math.sin(angle * 2) * 1.2
        )
      );
    }

    this.parts = [];

    const curves = [
      { points: curve1Points, radius: 0.28, explode: new THREE.Vector3(-5.5, 3.0, -3.0), rot: new THREE.Vector3(0.6, -0.8, 0.4) },
      { points: curve2Points, radius: 0.32, explode: new THREE.Vector3(0.0, -4.5, 4.0), rot: new THREE.Vector3(-0.5, 0.7, -0.6) },
      { points: curve3Points, radius: 0.26, explode: new THREE.Vector3(6.0, 2.5, -3.5), rot: new THREE.Vector3(0.8, 0.5, -0.7) },
      { points: curve4Points, radius: 0.12, explode: new THREE.Vector3(0.0, 5.0, -6.0), rot: new THREE.Vector3(-1.0, 1.2, 0.8) }
    ];

    curves.forEach((cfg, idx) => {
      const curve = new THREE.CatmullRomCurve3(cfg.points, idx === 3);
      // Outer glass tube
      const tubeGeo = new THREE.TubeGeometry(curve, 90, cfg.radius, 20, idx === 3);
      const tubeMesh = new THREE.Mesh(tubeGeo, this.glassMaterial);

      // Inner luminous core filament
      const coreGeo = new THREE.TubeGeometry(curve, 90, cfg.radius * 0.3, 10, idx === 3);
      const coreMesh = new THREE.Mesh(coreGeo, this.coreGlowMaterial);

      // Geometric faceted cage rings along the spine
      const facetGeo = new THREE.TubeGeometry(curve, 36, cfg.radius * 1.45, 6, idx === 3);
      const facetMesh = new THREE.Mesh(facetGeo, this.facetsMaterial);

      const partGroup = new THREE.Group();
      partGroup.add(tubeMesh);
      partGroup.add(coreMesh);
      partGroup.add(facetMesh);

      this.sculptureGroup.add(partGroup);

      this.parts.push({
        group: partGroup,
        originPos: new THREE.Vector3(0, 0, 0),
        explodePos: cfg.explode,
        originRot: new THREE.Vector3(0, 0, 0),
        explodeRot: cfg.rot,
        baseScale: 1.0
      });
    });

    // Small floating crystalline benchmark nodes
    this.nodes = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.24, 0);
    for (let i = 0; i < 12; i++) {
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.1,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.3
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 12) * Math.PI * 2;
      const r = 3.6 + Math.sin(i) * 0.8;
      const initialPos = new THREE.Vector3(
        Math.cos(angle) * r,
        Math.sin(angle) * (r * 0.7),
        (Math.sin(i * 1.5)) * 1.5
      );
      node.position.copy(initialPos);
      this.sculptureGroup.add(node);

      this.nodes.push({
        mesh: node,
        initialPos,
        scatterVector: initialPos.clone().normalize().multiplyScalar(6.5 + (i % 3) * 2),
        speed: 0.8 + (i % 5) * 0.2
      });
    }

    // Initial entrance scale
    this.sculptureGroup.scale.set(0.01, 0.01, 0.01);
    this.entranceTime = 0;
  }

  createBackgroundParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
      scales[i] = Math.random() * 0.08 + 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.15,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / this.height - 0.5) * 2;
    });
  }

  setScrollProgress(progress) {
    this.targetScroll = Math.max(0, Math.min(1, progress));
  }

  setThemeColor(hexColor) {
    this.targetThemeColor.set(hexColor);
  }

  animate(time) {
    this.rafId = requestAnimationFrame(this.animate);

    const t = time * 0.001;

    // Smooth scroll interpolation
    this.scrollProgress += (this.targetScroll - this.scrollProgress) * 0.08;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth color shift
    this.activeThemeColor.lerp(this.targetThemeColor, 0.06);
    this.coreGlowMaterial.color.copy(this.activeThemeColor);
    this.accentLight1.color.copy(this.activeThemeColor);

    // Initial entrance animation
    if (this.entranceTime < 1) {
      this.entranceTime += 0.016;
      const ease = Math.min(1, Math.sin((this.entranceTime * Math.PI) / 2));
      const s = THREE.MathUtils.lerp(0.01, 1.0, ease);
      this.sculptureGroup.scale.set(s, s, s);
    }

    // Scroll deconstruction and reassembly formula:
    // progress 0.0 (Hero): fully assembled (factor 0)
    // progress 0.12 - 0.75 (Works / Archives / About): fully disassembled (factor up to 1.0)
    // progress 0.85 - 1.0 (Outro / Coda): converges back to 0 (fully reassembled at end!)
    let deconstructFactor = 0;
    if (this.scrollProgress < 0.15) {
      deconstructFactor = (this.scrollProgress / 0.15);
    } else if (this.scrollProgress >= 0.15 && this.scrollProgress < 0.80) {
      deconstructFactor = 1.0;
    } else {
      // Reassemble smoothly as user reaches the end
      const outroProgress = (this.scrollProgress - 0.80) / 0.20;
      deconstructFactor = Math.max(0, 1.0 - outroProgress);
    }

    // Apply smooth easing to deconstructFactor
    const df = deconstructFactor * deconstructFactor * (3 - 2 * deconstructFactor);

    // Base sculpture group hover rotation
    this.sculptureGroup.rotation.y = t * 0.25 + this.mouse.x * 0.4 + this.scrollProgress * Math.PI;
    this.sculptureGroup.rotation.x = Math.sin(t * 0.2) * 0.12 + this.mouse.y * 0.3;
    this.sculptureGroup.rotation.z = Math.cos(t * 0.18) * 0.08;

    // Responsive position shift
    this.sculptureGroup.position.y = Math.sin(t * 0.8) * 0.18;

    // Animate parts (disassemble -> reassemble)
    this.parts.forEach((part, i) => {
      // Position lerp
      part.group.position.x = THREE.MathUtils.lerp(part.originPos.x, part.explodePos.x, df);
      part.group.position.y = THREE.MathUtils.lerp(part.originPos.y, part.explodePos.y, df) + Math.sin(t * 1.2 + i) * 0.15 * df;
      part.group.position.z = THREE.MathUtils.lerp(part.originPos.z, part.explodePos.z, df);

      // Rotation lerp
      part.group.rotation.x = THREE.MathUtils.lerp(part.originRot.x, part.explodeRot.x + t * 0.3, df);
      part.group.rotation.y = THREE.MathUtils.lerp(part.originRot.y, part.explodeRot.y + t * 0.2, df);
      part.group.rotation.z = THREE.MathUtils.lerp(part.originRot.z, part.explodeRot.z, df);
    });

    // Animate benchmark nodes
    this.nodes.forEach((nodeItem, i) => {
      const curPos = new THREE.Vector3().lerpVectors(
        nodeItem.initialPos,
        nodeItem.scatterVector,
        df
      );
      curPos.y += Math.sin(t * nodeItem.speed + i) * 0.2;
      nodeItem.mesh.position.copy(curPos);
      nodeItem.mesh.rotation.x += 0.02;
      nodeItem.mesh.rotation.y += 0.03;
    });

    // Gently drift particles
    if (this.particles) {
      this.particles.rotation.y = -t * 0.04;
      this.particles.rotation.x = t * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
