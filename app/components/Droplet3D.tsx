"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** A morphing, glossy serum droplet with orbiting micro-beads. Spins with scroll, leans toward the pointer. */
export default function Droplet3D({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Blob: indexed icosphere (shared vertices → smooth normals) displaced by layered sines every frame.
    const ico = new THREE.IcosahedronGeometry(1.6, 30);
    ico.deleteAttribute("normal");
    ico.deleteAttribute("uv");
    const blobGeo = mergeVertices(ico);
    ico.dispose();
    const basePositions = Float32Array.from(blobGeo.attributes.position.array as Float32Array);
    const blobMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e0313c"),
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      iridescence: 0.35,
      iridescenceIOR: 1.3,
      sheen: 0.6,
      sheenColor: new THREE.Color("#ffc2c6"),
    });
    const blob = new THREE.Mesh(blobGeo, blobMat);

    const root = new THREE.Group();
    root.add(blob);
    scene.add(root);

    const beadGeo = new THREE.SphereGeometry(1, 32, 32);
    const beadMat = new THREE.MeshPhysicalMaterial({ color: "#fff3ef", roughness: 0.2, clearcoat: 1 });
    const orbit = new THREE.Group();
    const beads: { mesh: THREE.Mesh; r: number; speed: number; tilt: number; phase: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const mesh = new THREE.Mesh(beadGeo, i % 3 === 0 ? blobMat : beadMat);
      mesh.scale.setScalar(THREE.MathUtils.randFloat(0.07, 0.18));
      orbit.add(mesh);
      beads.push({
        mesh,
        r: THREE.MathUtils.randFloat(2.3, 3.2),
        speed: THREE.MathUtils.randFloat(0.25, 0.6) * (i % 2 ? 1 : -1),
        tilt: THREE.MathUtils.randFloatSpread(1.2),
        phase: Math.random() * Math.PI * 2,
      });
    }
    root.add(orbit);

    const rim = new THREE.DirectionalLight("#ffd0d4", 2.2);
    rim.position.set(-5, 3, -4);
    const key = new THREE.DirectionalLight("#ffffff", 1.4);
    key.position.set(4, 5, 6);
    scene.add(rim, key);

    const spin = { y: 0, cur: 0 };
    const st = gsap.to(spin, {
      y: Math.PI * 2,
      ease: "none",
      scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: true },
    });

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

    const pos = blobGeo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = reduced ? 0 : clock.getElapsedTime();

      for (let i = 0; i < pos.count; i++) {
        v.set(basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]);
        const n =
          Math.sin(v.x * 1.7 + t * 1.1) * 0.06 +
          Math.sin(v.y * 2.3 + t * 0.9) * 0.05 +
          Math.sin(v.z * 1.9 + t * 1.3) * 0.05;
        // Teardrop: stretch the top half upward.
        const drop = v.y > 0 ? 1 + (v.y / 1.6) ** 2 * 0.35 : 1;
        v.multiplyScalar(1 + n);
        pos.setXYZ(i, v.x * (v.y > 0 ? 1 - (v.y / 1.6) * 0.18 : 1), v.y * drop, v.z * (v.y > 0 ? 1 - (v.y / 1.6) * 0.18 : 1));
      }
      pos.needsUpdate = true;
      blobGeo.computeVertexNormals();

      beads.forEach((b) => {
        const a = t * b.speed + b.phase;
        b.mesh.position.set(Math.cos(a) * b.r, Math.sin(a * 1.3) * b.tilt, Math.sin(a) * b.r);
      });

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      spin.cur += (spin.y - spin.cur) * 0.08;
      root.rotation.y = spin.cur + pointer.x * 0.4;
      root.rotation.x = pointer.y * 0.2;
      root.position.y = Math.sin(t * 0.8) * 0.12;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      st.scrollTrigger?.kill();
      st.kill();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      blobGeo.dispose();
      blobMat.dispose();
      beadGeo.dispose();
      beadMat.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={className} />;
}
