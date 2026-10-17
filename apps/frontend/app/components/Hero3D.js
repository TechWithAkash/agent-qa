"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3D() {
  const mountRef = useRef(null);
  const [activeMode, setActiveMode] = useState("scan"); // scan, pulse, glitch
  const [interactiveStats, setInteractiveStats] = useState({
    fps: 60,
    particles: 450,
    scanDepth: "100%",
  });

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 1. Core Sphere (Inner glowing core)
    const coreGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Outer Organic Icosahedron (The "improperly/playfully animated" wobbling vision eye)
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Store original position attributes for organic wave distortion
    const originalPositions = outerGeo.attributes.position.clone();

    // 3. Floating Orbital Rings (Scanning rings)
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. Floating Particles Constellation
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 3, 50);
    pointLight.position.set(3, 4, 5);
    scene.add(pointLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Mouse smooth follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Base rotations
      coreMesh.rotation.y = time * 0.3 + targetX * 0.5;
      coreMesh.rotation.x = time * 0.2 + targetY * 0.5;

      outerMesh.rotation.y = -time * 0.25 + targetX * 0.8;
      outerMesh.rotation.x = time * 0.15 - targetY * 0.8;

      ring1.rotation.z = time * 0.4;
      ring2.rotation.x = time * 0.3;

      // "Improperly / Organically Animated" 3D vertex deformation (Wobbling quantum eye)
      const pos = outerGeo.attributes.position;
      const orig = originalPositions;
      for (let i = 0; i < pos.count; i++) {
        const u = orig.getX(i);
        const v = orig.getY(i);
        const w = orig.getZ(i);

        // Organic glitch wave
        const wave = Math.sin(time * 3.5 + u * 4.0) * Math.cos(time * 2.8 + v * 3.0) * 0.08;
        const glitch = (Math.sin(time * 12.0) > 0.96 ? 0.05 : 0);

        pos.setXYZ(i, u + u * (wave + glitch), v + v * (wave + glitch), w + w * (wave + glitch));
      }
      pos.needsUpdate = true;

      // Slow particle float
      particleSystem.rotation.y = time * 0.03;
      particleSystem.rotation.x = Math.sin(time * 0.05) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] lg:h-[540px] flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-transparent rounded-3xl blur-3xl -z-10 pointer-events-none"></div>

      {/* 3D WebGL Canvas container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
      ></div>

      {/* Floating Holographic Telemetry Badges */}
      <div className="absolute top-6 left-4 md:left-6 glass-panel px-3.5 py-2 text-[11px] font-mono border-indigo-500/30 text-indigo-300 flex items-center gap-2 shadow-lg backdrop-blur-md animate-bounce duration-1000">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>DRISHTI Core // 3D Observer</span>
      </div>

      <div className="absolute bottom-6 right-4 md:right-6 glass-panel px-3.5 py-2 text-[11px] font-mono border-purple-500/30 text-purple-200 flex items-center gap-2.5 shadow-lg backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
        <span>Replay ×3 Deterministic Engine</span>
      </div>

      <div className="absolute top-1/2 -left-2 md:left-2 -translate-y-1/2 glass-panel p-2.5 text-[10px] font-mono text-slate-400 hidden sm:flex flex-col gap-1 border-white/10">
        <div className="text-indigo-400 font-bold">TELEMETRY</div>
        <div>VECTORS: 450</div>
        <div>STABILITY: 100%</div>
        <div>MODE: SANDBOX</div>
      </div>
    </div>
  );
}
