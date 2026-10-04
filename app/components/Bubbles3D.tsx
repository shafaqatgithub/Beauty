"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = {
  count?: number;
  className?: string;
  /** World units the camera travels while the parent section scrolls past; near droplets move faster than far ones. */
  depth?: number;
};

/** Floating glossy serum droplets (instanced, one draw call per colour) with scroll + pointer parallax. */
export default function Bubbles3D({ count = 34, className = "", depth = 7 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = host.closest("section, footer") as HTMLElement | null;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const geometry = new THREE.SphereGeometry(1, 40, 40);
    const materials = [
      new THREE.MeshStandardMaterial({ color: "#d3202c", roughness: 0.14, metalness: 0, envMapIntensity: 1.3 }),
      new THREE.MeshStandardMaterial({ color: "#fff1ec", roughness: 0.22, metalness: 0, envMapIntensity: 1.1 }),
    ];

    type Drop = { mesh: number; idx: number; s: number; speed: number; phase: number; x: number; y: number; z: number };
    const drops: Drop[] = [];
    const perMesh = [0, 0];
    for (let i = 0; i < count; i++) {
      const mesh = i % 5 === 0 ? 1 : 0;
      drops.push({
        mesh,
        idx: perMesh[mesh]++,
        s: THREE.MathUtils.randFloat(0.08, 0.4) * (i % 7 === 0 ? 1.8 : 1),
        speed: THREE.MathUtils.randFloat(0.12, 0.4),
        phase: Math.random() * Math.PI * 2,
        x: THREE.MathUtils.randFloatSpread(16),
        y: THREE.MathUtils.randFloatSpread(14),
        z: THREE.MathUtils.randFloat(-7, 5),
      });
    }
    const instanced = materials.map((m, i) => {
      const im = new THREE.InstancedMesh(geometry, m, Math.max(perMesh[i], 1));
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.frustumCulled = false;
      scene.add(im);
      return im;
    });

    const key = new THREE.DirectionalLight("#ffffff", 1.6);
    key.position.set(4, 6, 8);
    scene.add(key, new THREE.AmbientLight("#ffd6d9", 0.5));

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    const clock = new THREE.Clock();
    let camY = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = reduced ? 0 : clock.getElapsedTime();

      // Scroll progress through the parent section drives the camera — perspective does the parallax.
      if (section) {
        const r = section.getBoundingClientRect();
        const p = THREE.MathUtils.clamp(-r.top / Math.max(r.height - window.innerHeight, 1), 0, 1);
        camY += (-p * depth - camY) * 0.12;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      camera.position.set(pointer.x * 1.2, camY - pointer.y * 0.8, 14);
      camera.lookAt(0, camY, 0);

      for (const d of drops) {
        const range = 14 + depth;
        const y = ((((d.y + t * d.speed + range / 2) % range) + range) % range) - range / 2 - depth / 2;
        pos.set(d.x + Math.sin(t * 0.6 + d.phase) * 0.35, y, d.z);
        scl.set(d.s, d.s * (1 + Math.sin(t * 2 + d.phase) * 0.04), d.s);
        m4.compose(pos, q, scl);
        instanced[d.mesh].setMatrixAt(d.idx, m4);
      }
      instanced.forEach((im) => (im.instanceMatrix.needsUpdate = true));
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      instanced.forEach((im) => im.dispose());
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count, depth]);

  return <div ref={hostRef} aria-hidden className={`pointer-events-none ${className}`} />;
}
