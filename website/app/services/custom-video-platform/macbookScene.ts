import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { prepareMacbook14 } from "./prepareMacbook14";
import { createMacbookCameraFitter } from "./fitMacbookCamera";

export type MacbookSceneControls = {
  dispose: () => void;
  setScrollProgress: (progress: number, exitProgress: number) => void;
};

// A low product-photography viewpoint keeps the keyboard almost edge-on.
// Perspective adds depth cues without changing focal length during the turn.
const INITIAL_YAW = THREE.MathUtils.degToRad(-38);
// A long lens keeps the near chassis edge close to the screen's apparent width.
const CAMERA_FOV = 8;
const CAMERA_HEIGHT = 1.15;
// Retain the existing framing margins to keep the laptop at its current size.
const FRAMING_YAW_MARGIN = THREE.MathUtils.degToRad(2.5);
const FRAMING_PITCH_MARGIN = THREE.MathUtils.degToRad(0.6);

function fitDemoToDisplay(texture: THREE.Texture) {
  // The 1,200px capture was padded to 1,316px with 58px white side gutters.
  // Cover the display uniformly, retaining the white top inset for the notch.
  const visibleFraction = 1200 / 1316;
  texture.repeat.set(visibleFraction, visibleFraction);
  texture.offset.set((1 - visibleFraction) / 2, 1 - visibleFraction);
}

/** An upright MacBook with a scroll-driven orbit and closing lid. */
export function mountMacbookScene(
  host: HTMLElement,
  video: HTMLVideoElement,
  onReady: (ready: boolean) => void,
): MacbookSceneControls {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    onReady(false);
    return { dispose() {}, setScrollProgress() {} };
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(width < 500px)");
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1.62, 0.1, 1000);
  const cameraTarget = new THREE.Vector3(0, 3.55, -0.75);
  const fitPoints: THREE.Vector3[] = [];
  let scrollProgress = 0;
  let exitProgress = 0;
  let cameraDistance = 24;
  let compactDistances: number[] = [];
  let cameraFitter: ReturnType<typeof createMacbookCameraFitter> | undefined;
  let lidHinge: THREE.Group | undefined;
  let openHingeAngle = 0;
  let uprightHingeAngle = 0;
  let closedHingeAngle = 0;

  function updateLid() {
    const viewingAngle = THREE.MathUtils.lerp(openHingeAngle, uprightHingeAngle, scrollProgress);
    if (lidHinge) lidHinge.rotation.x = THREE.MathUtils.lerp(
      reducedMotion.matches ? uprightHingeAngle : viewingAngle,
      closedHingeAngle,
      reducedMotion.matches ? 0 : exitProgress,
    );
  }

  function positionCamera(yaw: number, distance: number) {
    camera.position.set(
      cameraTarget.x + Math.sin(yaw) * distance,
      CAMERA_HEIGHT,
      cameraTarget.z + Math.cos(yaw) * distance,
    );
    camera.lookAt(cameraTarget);
    camera.updateMatrixWorld(true);
  }

  function updateCamera() {
    const progress = reducedMotion.matches ? 1 : scrollProgress;
    const yaw = INITIAL_YAW * (1 - progress);
    let distance = cameraDistance;
    if (compactViewport.matches && compactDistances.length) {
      const sample = progress * (compactDistances.length - 1);
      const index = Math.floor(sample);
      distance = THREE.MathUtils.lerp(
        compactDistances[index],
        compactDistances[Math.min(index + 1, compactDistances.length - 1)],
        sample - index,
      );
    }
    positionCamera(yaw, distance);
  }

  function fitCamera() {
    if (!cameraFitter) return;
    const findDistance = (yaws: number[], horizontalLimit: number) =>
      cameraFitter!.findDistance(yaws, horizontalLimit, camera.aspect);

    if (compactViewport.matches) {
      // On phones, move closer as the turn narrows instead of reserving the
      // widest diagonal for every pose. Keep the lens and closing scale fixed.
      compactDistances = Array.from({ length: 17 }, (_, step) => {
        const yaw = INITIAL_YAW * (1 - step / 16);
        return findDistance([yaw - FRAMING_YAW_MARGIN, yaw, yaw + FRAMING_YAW_MARGIN], 0.97);
      });
    } else {
      compactDistances = [];
      // Preserve the existing fixed desktop framing for the complete turn.
      cameraDistance = findDistance(Array.from({ length: 9 }, (_, step) =>
        THREE.MathUtils.lerp(INITIAL_YAW - FRAMING_YAW_MARGIN, FRAMING_YAW_MARGIN, step / 8),
      ), 0.92);
    }
    updateCamera();
  }
  updateCamera();
  scene.add(new THREE.HemisphereLight(0xf4f6ff, 0x25272c, 0.45));
  const key = new THREE.DirectionalLight(0xfffaf3, 1.7);
  key.position.set(-8, 10, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe3eaff, 0.55);
  fill.position.set(8, 4, 6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xe8efff, 1.8);
  rim.position.set(3, 8, -10);
  scene.add(rim);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.flipY = true;
  fitDemoToDisplay(videoTexture);
  textures.add(videoTexture);
  let environment: THREE.WebGLRenderTarget | undefined;
  let display: THREE.MeshBasicMaterial | undefined;
  let disposed = false;
  let loaded = false;
  let warming = false;
  let warmupGeneration = 0;
  let visible = false;
  let contextLost = false;
  let frame = 0;
  let videoFrame: number | undefined;
  const hasVideoFrameCallback = typeof video.requestVideoFrameCallback === "function";

  function rememberResources(object: THREE.Object3D) {
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      geometries.add(child.geometry);
      for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) textures.add(value);
        }
      }
    });
  }

  function disposeResources() {
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    textures.forEach((texture) => texture.dispose());
    geometries.clear();
    materials.clear();
    textures.clear();
    environment?.dispose();
    environment = undefined;
  }

  function createEnvironment() {
    environment?.dispose();
    // Broad, restrained studio softboxes reveal the black anodized metal
    // without the hot frontal panel that made the old finish look silver.
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0x303238);
    const panels: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
    const softbox = (width: number, height: number, position: THREE.Vector3, strength: number) => {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff).multiplyScalar(strength), side: THREE.DoubleSide }),
      );
      panel.position.copy(position);
      panel.lookAt(0, 3, 0);
      studio.add(panel);
      panels.push(panel);
    };
    softbox(12, 18, new THREE.Vector3(-14, 10, 12), 5);
    softbox(5, 16, new THREE.Vector3(14, 6, 4), 3);
    softbox(16, 10, new THREE.Vector3(0, 16, -2), 4);
    softbox(12, 5, new THREE.Vector3(1, 7, -16), 6);
    const pmrem = new THREE.PMREMGenerator(renderer);
    try {
      environment = pmrem.fromScene(studio, 0.08);
      scene.environment = environment.texture;
      scene.environmentIntensity = 1;
    } finally {
      panels.forEach((panel) => { panel.geometry.dispose(); panel.material.dispose(); });
      pmrem.dispose();
    }
  }

  function requestRender() {
    if (!frame && loaded && !warming && visible && !document.hidden && !contextLost && !disposed) {
      frame = window.requestAnimationFrame(render);
    }
  }

  function render() {
    frame = 0;
    if (disposed || !loaded || warming || !visible || document.hidden || contextLost) return;
    updateLid();
    updateCamera();
    renderer.render(scene, camera);
    if (!hasVideoFrameCallback && !video.paused) requestRender();
  }

  function queueVideoFrame() {
    if (warming || !hasVideoFrameCallback || videoFrame !== undefined || video.paused || !visible || document.hidden || disposed || contextLost) return;
    videoFrame = video.requestVideoFrameCallback(() => {
      videoFrame = undefined;
      showVideo();
      requestRender();
      queueVideoFrame();
    });
  }

  function cancelVideoFrame() {
    if (videoFrame !== undefined) video.cancelVideoFrameCallback(videoFrame);
    videoFrame = undefined;
  }

  function showVideo() {
    if (!warming && display && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && display.map !== videoTexture) {
      display.map = videoTexture;
      display.needsUpdate = true;
    }
  }

  function syncVisibility() {
    if (document.hidden || !visible) {
      cancelVideoFrame();
      return;
    }
    showVideo();
    queueVideoFrame();
    requestRender();
  }

  function onVideoChange() {
    showVideo();
    if (video.paused) cancelVideoFrame();
    else queueVideoFrame();
    requestRender();
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fitCamera();
    renderer.setSize(width, height, false);
    requestRender();
  }

  function onMotionChange() {
    updateCamera();
    requestRender();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    contextLost = true;
    warmupGeneration++;
    cancelVideoFrame();
    onReady(false);
  }

  function onContextRestored() {
    contextLost = false;
    if (!loaded) return;
    void warmAndReveal().catch(() => { if (!disposed) onReady(false); });
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncVisibility();
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
  visibilityObserver.observe(host);
  window.addEventListener("resize", syncVisibility);
  document.addEventListener("visibilitychange", syncVisibility);
  reducedMotion.addEventListener("change", onMotionChange);
  for (const event of ["loadeddata", "play", "pause", "seeked"]) video.addEventListener(event, onVideoChange);
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);
  resize();

  async function loadModel() {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const [modelResult, posterResult] = await Promise.allSettled([
      loader.loadAsync("/models/macbook/macbook-pro-14.ccd3d18d.glb"),
      new THREE.TextureLoader().loadAsync("/video-platform/platform-tour-poster.webp"),
    ]);
    if (modelResult.status === "fulfilled") rememberResources(modelResult.value.scene);
    if (posterResult.status === "fulfilled") textures.add(posterResult.value);
    if (disposed || modelResult.status === "rejected" || posterResult.status === "rejected") {
      disposeResources();
      if (!disposed) onReady(false);
      return;
    }
    const prepared = prepareMacbook14(modelResult.value.scene);
    const { model, screen } = prepared;
    lidHinge = prepared.hinge;
    openHingeAngle = prepared.openHingeAngle;
    uprightHingeAngle = prepared.uprightHingeAngle;
    closedHingeAngle = prepared.closedHingeAngle;
    videoTexture.flipY = prepared.flipY;
    // Include any cloned display geometry/materials created by the preparation helper.
    rememberResources(model);

    const poster = posterResult.value;
    poster.colorSpace = THREE.SRGBColorSpace;
    poster.flipY = prepared.flipY;
    fitDemoToDisplay(poster);
    poster.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    display = new THREE.MeshBasicMaterial({ map: poster, toneMapped: false });
    materials.add(display);
    screen.material = display;
    // Collect the complete 100°→90° hinge motion for the viewport's framing.
    // Closing reuses the upright distance so the chassis never shrinks away.
    for (const progress of [0, 0.5, 1]) {
      lidHinge.rotation.x = THREE.MathUtils.lerp(openHingeAngle, uprightHingeAngle, progress);
      model.updateMatrixWorld(true);
      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.computeBoundingBox();
        const bounds = child.geometry.boundingBox;
        if (!bounds) return;
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              fitPoints.push(new THREE.Vector3(x, y, z).applyMatrix4(child.matrixWorld));
            }
          }
        }
      });
    }
    new THREE.Box3().setFromPoints(fitPoints).getCenter(cameraTarget);
    cameraFitter = createMacbookCameraFitter(fitPoints, cameraTarget, {
      fov: CAMERA_FOV, cameraHeight: CAMERA_HEIGHT, maxPitch: FRAMING_PITCH_MARGIN,
      near: camera.near, far: camera.far,
    });
    // The real closed lid fits inside the chassis footprint and existing
    // padding. Preserve the entry framing: rotated local AABB corners contain
    // empty space below the floor and would unnecessarily shrink the laptop.
    updateLid();
    fitCamera();
    scene.add(model);
    loaded = true;
    if (!contextLost) await warmAndReveal();
  }

  // Yield between GPU setup phases so loading does not monopolize the first
  // scroll. Compile both screen variants: VideoTexture uses a different shader
  // from the poster even though both occupy the same display material.
  const yieldToBrowser = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0));

  async function warmAndReveal() {
    const generation = ++warmupGeneration;
    const isCurrent = () => !disposed && !contextLost && generation === warmupGeneration;
    try {
      warming = true;
      cancelVideoFrame();
      window.cancelAnimationFrame(frame);
      frame = 0;
      await yieldToBrowser();
      if (!isCurrent()) return;
      createEnvironment();
      await yieldToBrowser();
      if (!isCurrent()) return;
      await renderer.compileAsync(scene, camera);
      if (!isCurrent() || !display) return;
      const initialMap = display.map;
      let videoCompilation: Promise<THREE.Object3D>;
      try {
        display.map = videoTexture;
        display.needsUpdate = true;
        videoCompilation = renderer.compileAsync(scene, camera);
      } finally {
        // Preserve the poster even if context loss interrupts compilation.
        display.map = initialMap;
        display.needsUpdate = true;
      }
      await videoCompilation;
      if (!isCurrent()) return;

      // Upload only textures used by the prepared model, not superseded materials.
      const activeTextures = new Set<THREE.Texture>();
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
          for (const value of Object.values(material)) {
            if (value instanceof THREE.Texture && !(value instanceof THREE.VideoTexture)) activeTextures.add(value);
          }
        }
      });
      let batchStarted = performance.now();
      for (const texture of activeTextures) {
        renderer.initTexture(texture);
        if (performance.now() - batchStarted > 6) {
          await yieldToBrowser();
          if (!isCurrent()) return;
          batchStarted = performance.now();
        }
      }
      await yieldToBrowser();
      if (!isCurrent()) return;
      // Reveal only the finished real model, already in its current scroll pose.
      updateLid();
      updateCamera();
      renderer.render(scene, camera);
      warming = false;
      syncVisibility();
      onReady(true);
    } catch (error) {
      // A restored context owns newer resources; stale work must not dispose it.
      if (isCurrent()) throw error;
    }
  }

  void loadModel().catch(() => {
    loaded = false;
    cancelVideoFrame();
    disposeResources();
    if (!disposed) onReady(false);
  });

  return {
    setScrollProgress(progress, exit) {
      scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
      exitProgress = THREE.MathUtils.clamp(exit, 0, 1);
      requestRender();
    },
    dispose() {
      disposed = true;
      warmupGeneration++;
      window.cancelAnimationFrame(frame);
      cancelVideoFrame();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("resize", syncVisibility);
      document.removeEventListener("visibilitychange", syncVisibility);
      reducedMotion.removeEventListener("change", onMotionChange);
      for (const event of ["loadeddata", "play", "pause", "seeked"]) video.removeEventListener(event, onVideoChange);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      disposeResources();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
