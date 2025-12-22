'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';

export function HomeModel() {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Auto-rotate
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Living Room */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 3, 5]} />
        <meshStandardMaterial color="#c7d2fe" />
      </mesh>

      {/* Kitchen */}
      <mesh position={[5, 0, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>

      {/* Bedroom */}
      <mesh position={[0, 0, 6]}>
        <boxGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color="#f3e8ff" />
      </mesh>

      {/* Simple furniture */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}
