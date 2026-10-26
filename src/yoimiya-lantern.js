import * as THREE from 'three';

export class YoimiyaLanternScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 380;
    this.height = container.clientHeight || 380;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.burstSparks = [];

    this.init();
    this.createLantern();
    this.createFireworksSparks();
    this.addEvents();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.2, 7.8);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);

    // Warm summer festival night lighting
    const ambient = new THREE.AmbientLight(0xffeedd, 0.9);
    this.scene.add(ambient);

    // Candle flame core light
    this.candleLight = new THREE.PointLight(0xffa149, 3.2, 12, 1.2);
    this.candleLight.position.set(0, 0, 0);
    this.scene.add(this.candleLight);

    // Subtle moonlit rim light
    const moonLight = new THREE.DirectionalLight(0x7dd3fc, 1.4);
    moonLight.position.set(-6, 8, -4);
    this.scene.add(moonLight);
  }

  createWashiTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Washi paper cream base
    ctx.fillStyle = '#faf5e8';
    ctx.fillRect(0, 0, size, size);

    // Washi fiber noise
    ctx.fillStyle = 'rgba(217, 119, 6, 0.05)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * size, Math.random() * size, Math.random() * 4, Math.random() * 2);
    }

    // Calligraphy Character: "宵" (Yoimiya) and "榮" (Bingrong)
    ctx.font = 'bold 220px "Noto Serif SC", "Songti SC", serif';
    ctx.fillStyle = '#1c1917';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('宵', size / 2, size / 2 - 20);

    // Vermilion Seal Stamp (朱文角印)
    ctx.strokeStyle = '#c83e2d';
    ctx.lineWidth = 6;
    ctx.strokeRect(size / 2 - 40, size - 110, 80, 80);
    ctx.font = 'bold 44px serif';
    ctx.fillStyle = '#c83e2d';
    ctx.fillText('栄', size / 2, size - 70);

    return new THREE.CanvasTexture(canvas);
  }

  createLantern() {
    this.lanternGroup = new THREE.Group();
    this.scene.add(this.lanternGroup);

    const washiTex = this.createWashiTexture();

    // 1. Hexagonal Washi Paper Core Body
    const radius = 1.3;
    const height = 2.4;
    const bodyGeo = new THREE.CylinderGeometry(radius, radius * 0.9, height, 6, 1, true);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: washiTex,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.45
    });
    this.lanternBody = new THREE.Mesh(bodyGeo, bodyMat);
    this.lanternGroup.add(this.lanternBody);

    // 2. Dark Hinoki Cypress Wooden Frame (桧木骨架)
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x1f1610,
      roughness: 0.5,
      metalness: 0.2
    });

    // Top and Bottom wooden rims
    const topRimGeo = new THREE.CylinderGeometry(radius * 1.15, radius * 1.05, 0.15, 6);
    const topRim = new THREE.Mesh(topRimGeo, woodMat);
    topRim.position.y = height / 2 + 0.075;
    this.lanternGroup.add(topRim);

    const btmRimGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 1.05, 0.15, 6);
    const btmRim = new THREE.Mesh(btmRimGeo, woodMat);
    btmRim.position.y = -height / 2 - 0.075;
    this.lanternGroup.add(btmRim);

    // Top pagoda eaves cap (和风行灯檐顶)
    const capGeo = new THREE.ConeGeometry(radius * 1.35, 0.55, 6);
    const cap = new THREE.Mesh(capGeo, woodMat);
    cap.position.y = height / 2 + 0.4;
    this.lanternGroup.add(cap);

    // Bottom decorative wooden base legs
    const baseGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.85, 0.35, 6);
    const base = new THREE.Mesh(baseGeo, woodMat);
    base.position.y = -height / 2 - 0.32;
    this.lanternGroup.add(base);

    // 6 Vertical Wooden Ribs (六棱立柱)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const ribGeo = new THREE.CylinderGeometry(0.035, 0.035, height, 8);
      const rib = new THREE.Mesh(ribGeo, woodMat);
      rib.position.x = Math.sin(angle) * (radius * 1.01);
      rib.position.z = Math.cos(angle) * (radius * 1.01);
      this.lanternGroup.add(rib);
    }

    // Top Brass Hanging Ring (铜提环)
    const ringGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 32);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.25
    });
    const hangRing = new THREE.Mesh(ringGeo, brassMat);
    hangRing.position.y = height / 2 + 0.85;
    this.lanternGroup.add(hangRing);

    // Red Silk Tassel (朱红流苏)
    const tasselGeo = new THREE.ConeGeometry(0.08, 0.8, 8);
    const tasselMat = new THREE.MeshStandardMaterial({
      color: 0xc83e2d,
      roughness: 0.7
    });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.y = -height / 2 - 0.7;
    tassel.rotation.x = Math.PI;
    this.lanternGroup.add(tassel);
  }

  createFireworksSparks() {
    this.sparkCount = 180;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(this.sparkCount * 3);
    const colors = new Float32Array(this.sparkCount * 3);
    this.sparkData = [];

    const gold = new THREE.Color(0xfbbf24);
    const crimson = new THREE.Color(0xf43f5e);
    const amber = new THREE.Color(0xf97316);

    for (let i = 0; i < this.sparkCount; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 5.5,
        (Math.random() - 0.5) * 5.5 - 0.5,
        (Math.random() - 0.5) * 3.5
      );
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;

      // Palette mix
      const col = Math.random() > 0.6 ? gold : (Math.random() > 0.5 ? crimson : amber);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      this.sparkData.push({
        origPos: p.clone(),
        speedY: 0.008 + Math.random() * 0.015,
        speedX: (Math.random() - 0.5) * 0.006,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 1 + Math.random() * 2
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.sparkPoints = new THREE.Points(geo, mat);
    this.scene.add(this.sparkPoints);
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
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - cx) / (window.innerWidth * 0.5);
      this.mouse.targetY = -(e.clientY - cy) / (window.innerHeight * 0.5);
    });

    // Click to release a flurry of golden festival sparks!
    this.container.addEventListener('click', () => {
      this.triggerSparkBurst();
    });
  }

  triggerSparkBurst() {
    // Pulse light
    if (this.candleLight) {
      this.candleLight.intensity = 5.5;
      setTimeout(() => { if (this.candleLight) this.candleLight.intensity = 3.2; }, 300);
    }

    // Spin lantern slightly
    if (this.lanternGroup) {
      this.lanternGroup.rotation.y += 0.8;
    }
  }

  animate(time) {
    this.rafId = requestAnimationFrame(this.animate);
    const t = time * 0.001;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Gentle floating bob & sway (如水面微漾、夏夜微风拂过提灯)
    if (this.lanternGroup) {
      this.lanternGroup.position.y = Math.sin(t * 1.5) * 0.12;
      this.lanternGroup.rotation.y = t * 0.45 + this.mouse.x * 0.6;
      this.lanternGroup.rotation.z = Math.sin(t * 1.2) * 0.04 + this.mouse.x * 0.08;
      this.lanternGroup.rotation.x = Math.cos(t * 1.1) * 0.03 + this.mouse.y * 0.15;
    }

    // Candle flame natural flicker
    if (this.candleLight) {
      this.candleLight.intensity = 3.0 + Math.sin(t * 12) * 0.25 + Math.cos(t * 22) * 0.15;
    }

    // Drifting sparks upward
    if (this.sparkPoints) {
      const pos = this.sparkPoints.geometry.attributes.position.array;
      for (let i = 0; i < this.sparkCount; i++) {
        const d = this.sparkData[i];
        pos[i * 3 + 1] += d.speedY; // Upward drift
        pos[i * 3] += Math.sin(t * d.swaySpeed + d.swayOffset) * 0.004 + d.speedX;

        // Reset if drifted too high
        if (pos[i * 3 + 1] > 3.2) {
          pos[i * 3 + 1] = -2.8;
          pos[i * 3] = d.origPos.x + (Math.random() - 0.5) * 1.2;
        }
      }
      this.sparkPoints.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
