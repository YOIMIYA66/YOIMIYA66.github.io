import * as THREE from 'three';

export class Light3DHero {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = canvasContainer.clientWidth || 320;
    this.height = canvasContainer.clientHeight || 320;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;

    this.init();
    this.createGeometry();
    this.addEvents();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 50);
    this.camera.position.set(0, 0, 7.5);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Warm, artistic studio lighting matching paper & ink
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.6);
    keyLight.position.set(6, 8, 8);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xc76f50, 2.5, 20);
    rimLight.position.set(-5, -4, 4);
    this.scene.add(rimLight);

    const coolFill = new THREE.PointLight(0x7dd3fc, 2.0, 20);
    coolFill.position.set(4, -5, -3);
    this.scene.add(coolFill);
  }

  createGeometry() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Artistic faceted geometric sculpture:
    // A stylized icosahedron cage + inner refractive glass gemstone + floating orbital rings
    const gemGeo = new THREE.IcosahedronGeometry(1.65, 0);

    // Physical refractive material with terracotta & amber rim dispersion
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.88,
      thickness: 1.2,
      ior: 1.52,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    this.gemMesh = new THREE.Mesh(gemGeo, gemMat);
    this.group.add(this.gemMesh);

    // Fine wireframe cage outline
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x2a3040,
      wireframe: true,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.4
    });
    this.wireMesh = new THREE.Mesh(gemGeo, wireMat);
    this.wireMesh.scale.set(1.02, 1.02, 1.02);
    this.group.add(this.wireMesh);

    // Inner glowing core kernel (representing model reasoning & evaluation anchor)
    const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc76f50,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    // Floating orbital coordinate ring
    const ringGeo = new THREE.TorusGeometry(2.35, 0.02, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x8da2b6,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.5
    });
    this.ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh1.rotation.x = Math.PI * 0.35;
    this.group.add(this.ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    this.ringMesh2 = new THREE.Mesh(ringGeo2, ringMat);
    this.ringMesh2.rotation.y = Math.PI * 0.45;
    this.group.add(this.ringMesh2);
  }

  addEvents() {
    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth || 320;
      this.height = this.container.clientHeight || 320;
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
  }

  setScrollProgress(progress) {
    this.scrollProgress = progress;
  }

  animate(time) {
    this.rafId = requestAnimationFrame(this.animate);
    const t = time * 0.001;

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // Subtle 3D kinetic rotation
    if (this.group) {
      this.group.rotation.y = t * 0.35 + this.mouse.x * 0.8;
      this.group.rotation.x = Math.sin(t * 0.4) * 0.15 + this.mouse.y * 0.6;
      this.group.rotation.z = Math.cos(t * 0.3) * 0.1;
      this.group.position.y = Math.sin(t * 1.2) * 0.12;

      // Inner core counters-rotates
      if (this.coreMesh) {
        this.coreMesh.rotation.y = -t * 0.7;
        this.coreMesh.rotation.x = t * 0.5;
      }

      // Orbital rings rotate
      if (this.ringMesh1) {
        this.ringMesh1.rotation.z = t * 0.2;
      }
      if (this.ringMesh2) {
        this.ringMesh2.rotation.z = -t * 0.25;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
