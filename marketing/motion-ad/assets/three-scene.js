/* Optional 3D visual. Bundled only for scenes with data-motion-three.
   Three.js is MIT licensed; its license is preserved by the bundler. */
import { WebGLRenderer, Scene, PerspectiveCamera, Mesh, TorusKnotGeometry,
  MeshStandardMaterial, AmbientLight, DirectionalLight, Color } from "three";

window.MotionAd3D = {
  mount(stage) {
    const canvas = stage.querySelector("canvas[data-motion-three]");
    if (!canvas) return null;
    let renderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(1);
      renderer.setSize(640, 640, false);
      const scene = new Scene();
      const camera = new PerspectiveCamera(35, 1, 0.1, 100);
      const distance = Number(canvas.dataset.cameraDistance);
      camera.position.z = Number.isFinite(distance) && distance >= 4 && distance <= 20 ? distance : 5.5;
      const material = new MeshStandardMaterial({ color: new Color(getComputedStyle(stage).getPropertyValue("--accent").trim() || "#c2410c"), roughness: 0.35, metalness: 0.25 });
      const mesh = new Mesh(new TorusKnotGeometry(1, 0.32, 128, 20), material);
      scene.add(mesh, new AmbientLight(0xffffff, 1.5));
      const light = new DirectionalLight(0xffffff, 3);
      light.position.set(2, 3, 4);
      scene.add(light);
      canvas.dataset.threeStatus = "ready";
      canvas.addEventListener("webglcontextlost", () => { canvas.dataset.threeStatus = "unavailable"; });
      window.addEventListener("pagehide", () => { mesh.geometry.dispose(); material.dispose(); renderer.dispose(); }, { once: true });
      return {
        render(time, duration) {
          const progress = duration > 0 ? time / duration : 0;
          mesh.rotation.set(progress * Math.PI * 2, progress * Math.PI * 4, 0.2);
          renderer.render(scene, camera);
        },
      };
    } catch (error) {
      canvas.dataset.threeStatus = "unavailable";
      canvas.hidden = true;
      console.warn("motion-ad: 3D unavailable; showing the 2D field", error);
      return null;
    }
  },
};
