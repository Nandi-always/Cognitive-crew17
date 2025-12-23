'use client';

import React, { useEffect, useRef } from 'react';
import { Group } from 'three';

export function HomeModel() {
  const groupRef = useRef<Group | null>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.005;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return React.createElement(
    'group' as any,
    { ref: groupRef },
    React.createElement(
      'mesh' as any,
      { position: [0, 0, 0] },
      React.createElement('boxGeometry' as any, { args: [4, 3, 5] }),
      React.createElement('meshStandardMaterial' as any, { color: '#c7d2fe' })
    ),
    React.createElement(
      'mesh' as any,
      { position: [5, 0, 0] },
      React.createElement('boxGeometry' as any, { args: [3, 3, 3] }),
      React.createElement('meshStandardMaterial' as any, { color: '#dbeafe' })
    ),
    React.createElement(
      'mesh' as any,
      { position: [0, 0, 6] },
      React.createElement('boxGeometry' as any, { args: [3, 3, 4] }),
      React.createElement('meshStandardMaterial' as any, { color: '#f3e8ff' })
    ),
    React.createElement(
      'mesh' as any,
      { position: [0, 1, 0] },
      React.createElement('boxGeometry' as any, { args: [2, 0.5, 1] }),
      React.createElement('meshStandardMaterial' as any, { color: '#fbbf24' })
    )
  );
}
