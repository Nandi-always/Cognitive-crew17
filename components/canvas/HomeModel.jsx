'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLayoutStore } from '@/lib/stores/layout';

export function HomeModel() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const { rooms, furniture } = useLayoutStore();

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xccddee);
      sceneRef.current = scene;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(20, 15, 20);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(20, 30, 20);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.left = -100;
      directionalLight.shadow.camera.right = 100;
      directionalLight.shadow.camera.top = 100;
      directionalLight.shadow.camera.bottom = -100;
      scene.add(directionalLight);

      // Ground plane
      const groundGeometry = new THREE.PlaneGeometry(200, 200);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x90ee90,
        roughness: 0.8,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      ground.position.y = -0.1;
      scene.add(ground);

      // Group for rooms and furniture
      const objectsGroup = new THREE.Group();
      scene.add(objectsGroup);

      // Draw rooms as 3D boxes
      rooms.forEach((room, index) => {
        const geometry = new THREE.BoxGeometry(room.width, 3.5, room.height);
        const colors = [0x93c5fd, 0xfce7f3, 0xfef3c7, 0xc7d2fe, 0xd1fae5];
        const color = colors[index % colors.length];
        const material = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.1,
          roughness: 0.8,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(room.x + room.width / 2, 1.75, room.y + room.height / 2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        objectsGroup.add(mesh);

        // Add room name as text
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(room.name, 128, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const labelGeometry = new THREE.PlaneGeometry(room.width, 2);
        const labelMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(
          room.x + room.width / 2,
          3.6,
          room.y + room.height / 2
        );
        label.rotation.x = -Math.PI / 4;
        objectsGroup.add(label);
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
        objectsGroup.add(mesh);
      });

      // Mouse controls
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };
      let cameraRotation = { x: 0, y: 0 };

      const onMouseDown = (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove = (e) => {
        if (isDragging && cameraRef.current) {
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;

          cameraRotation.y += deltaX * 0.005;
          cameraRotation.x += deltaY * 0.005;

          // Limit vertical rotation
          cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));

          const radius = 30;
          cameraRef.current.position.x =
            Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x) * radius;
          cameraRef.current.position.y = Math.sin(cameraRotation.x) * radius + 10;
          cameraRef.current.position.z =
            Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x) * radius;

          cameraRef.current.lookAt(0, 5, 0);
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('mouseleave', onMouseUp);

      // Zoom with scroll
      const onWheel = (e) => {
        e.preventDefault();
        const cameraPos = cameraRef.current;
        const direction = new THREE.Vector3(
          cameraPos.position.x,
          cameraPos.position.y,
          cameraPos.position.z
        ).normalize();
        const distance = cameraPos.position.length();
        const newDistance = distance + (e.deltaY > 0 ? 2 : -2);
        const clampedDistance = Math.max(10, Math.min(80, newDistance));
        cameraPos.position.copy(direction.multiplyScalar(clampedDistance));
      };

      renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('mouseleave', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
        
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        
        renderer.dispose();
      };
    } catch (err) {
      console.error('3D viewer error:', err);
    }
  }, [rooms, furniture]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: 'relative', overflow: 'hidden' }}
    />
  );
}
