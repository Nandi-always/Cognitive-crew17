'use client';

// Temporarily commented out for dev server startup
// import React, { useEffect, useRef, useState } from 'react';
// import { useThree, useFrame } from '@react-three/fiber';
// import { Group, Camera, Vector3 } from 'three';
// import { useLayoutStore, Room } from '@/lib/stores/layout';

/**
 * Convert 2D layout to 3D geometry
 * Each room becomes a 3D box based on its width, height, and a fixed room height
 */
function Room3D({ room, isSelected }: { room: Room; isSelected: boolean }) {
  const meshRef = useRef<any>(null);

  return (
    <mesh
      ref={meshRef}
      position={[
        room.x / 40, // Convert pixels to 3D units
        1.5, // Mid-height of room
        room.y / 40, // Convert pixels to 3D units
      ]}
      onClick={() => console.log('Selected room:', room.id)}
    >
      <boxGeometry args={[room.width / 40, 3, room.height / 40]} />
      <meshStandardMaterial
        color={isSelected ? '#4f46e5' : room.color || '#e0e7ff'}
        metalness={0.3}
        roughness={0.8}
      />
      {/* Room label on top */}
      <sprite position={[0, 2, 0]}>
        <spriteMaterial attach="material" />
      </sprite>
    </mesh>
  );
}

/**
 * Camera controller with orbit, pan, and walkthrough modes
 */
function CameraController({
  mode = 'orbit',
  autoRotate = true,
}: {
  mode?: 'orbit' | 'pan' | 'walkthrough';
  autoRotate?: boolean;
}) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());

  useEffect(() => {
    // Reset camera to default position
    camera.position.set(5, 5, 8);
    camera.lookAt(0, 0, 0);
  }, [camera, mode]);

  useFrame(() => {
    if (mode === 'orbit' && autoRotate) {
      // Auto-rotate around center
      const angle = Date.now() * 0.0005;
      camera.position.x = Math.cos(angle) * 8;
      camera.position.z = Math.sin(angle) * 8;
      camera.lookAt(0, 1, 0);
    } else if (mode === 'walkthrough') {
      // Simple walkthrough mode (placeholder)
      camera.position.y = 1.7; // Eye level
      camera.lookAt(0, 1, 0);
    }
  });

  return null;
}

/**
 * Main 3D home model component
 * Converts 2D layout to 3D and provides interactive visualization
 */
export function HomeModel({ mode = 'orbit' }: { mode?: 'orbit' | 'pan' | 'walkthrough' }) {
  const { rooms } = useLayoutStore();
  const groupRef = useRef<Group | null>(null);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.4} />

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Rooms from 2D layout */}
      <group ref={groupRef}>
        {rooms.length > 0 ? (
          rooms.map((room) => <Room3D key={room.id} room={room} isSelected={false} />)
        ) : (
          // Default demo rooms
          <>
            <mesh position={[2, 1.5, 2]}>
              <boxGeometry args={[4, 3, 3]} />
              <meshStandardMaterial color="#c7d2fe" />
            </mesh>
            <mesh position={[6, 1.5, 2]}>
              <boxGeometry args={[3, 3, 3]} />
              <meshStandardMaterial color="#dbeafe" />
            </mesh>
            <mesh position={[2, 1.5, 6]}>
              <boxGeometry args={[3, 3, 4]} />
              <meshStandardMaterial color="#f3e8ff" />
            </mesh>
          </>
        )}
      </group>

      {/* Camera controller */}
      <CameraController mode={mode} autoRotate={true} />
    </>
  );
}

// Export minimal stub to prevent import errors
export default HomeModel;
