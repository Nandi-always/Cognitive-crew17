'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useLayoutStore } from '@/lib/stores/layout';

export function WalkthroughViewer({ onClose }) {
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const { rooms, furniture } = useLayoutStore();

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xccddee);

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 1.7, 5);
      camera.lookAt(0, 1.5, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(20, 30, 20);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Ground
      const groundGeometry = new THREE.PlaneGeometry(200, 200);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x90ee90 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Draw rooms
      rooms.forEach((room, index) => {
        const geometry = new THREE.BoxGeometry(room.width, 3.5, room.height);
        const colors = [0x93c5fd, 0xfce7f3, 0xfef3c7, 0xc7d2fe, 0xd1fae5];
        const material = new THREE.MeshStandardMaterial({
          color: colors[index % colors.length],
          metalness: 0.1,
          roughness: 0.8,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(room.x + room.width / 2, 1.75, room.y + room.height / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      });

      // Draw furniture
      furniture.forEach((item) => {
        const geometry = new THREE.BoxGeometry(item.width, 1.5, item.height);
        const material = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.2,
          roughness: 0.7,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(item.x + item.width / 2, 0.75, item.y + item.height / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      });

      // Walkthrough keyframes
      const generateKeyframes = () => {
        const keyframes = [];
        keyframes.push({
          position: new THREE.Vector3(0, 1.7, 10),
          target: new THREE.Vector3(0, 1.5, 0),
          duration: 3000,
        });

        rooms.forEach((room, index) => {
          const centerX = room.x + room.width / 2;
          const centerZ = room.y + room.height / 2;
          keyframes.push({
            position: new THREE.Vector3(centerX, 1.7, centerZ + 8),
            target: new THREE.Vector3(centerX, 1.5, centerZ),
            duration: 4000,
          });
        });

        return keyframes;
      };

      const keyframes = generateKeyframes();
      let currentKeyframeIndex = 0;
      let keyframeProgress = 0;
      let totalTime = keyframes.reduce((sum, kf) => sum + kf.duration, 0);

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        if (playing && keyframes.length > 0) {
          keyframeProgress += 16;
          let elapsed = 0;
          currentKeyframeIndex = 0;

          for (let i = 0; i < keyframes.length; i++) {
            if (keyframeProgress >= elapsed && keyframeProgress < elapsed + keyframes[i].duration) {
              currentKeyframeIndex = i;
              const progress = (keyframeProgress - elapsed) / keyframes[i].duration;
              const current = keyframes[i];
              const next = keyframes[(i + 1) % keyframes.length];

              camera.position.lerpVectors(current.position, next.position, progress);
              const targetLerp = new THREE.Vector3();
              targetLerp.lerpVectors(current.target, next.target, progress);
              camera.lookAt(targetLerp);

              setProgress((keyframeProgress / totalTime) * 100);
              break;
            }
            elapsed += keyframes[i].duration;
          }

          if (keyframeProgress >= totalTime) {
            setPlaying(false);
            setProgress(0);
            keyframeProgress = 0;
          }
        }

        renderer.render(scene, camera);
      };
      animate();

      // Cleanup
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.error('Walkthrough viewer error:', err);
    }
  }, [rooms, furniture, playing]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full h-5/6 flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">3D Walkthrough</h3>
              <p className="text-sm text-slate-600">Navigate through your home</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div ref={containerRef} className="flex-1 bg-gradient-to-b from-blue-300 to-blue-200" />

        <div className="border-t border-slate-200 p-6 space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => setPlaying(!playing)}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setProgress(0);
              }}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
            >
              ⏹ Reset
            </button>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
