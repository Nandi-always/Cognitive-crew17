'use client';

import { useCallback, useState } from 'react';

export function usePhysics() {
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const applyForce = useCallback(
    (force: { x: number; y: number }, mass: number = 1) => {
      setVelocity((v) => ({
        x: v.x + force.x / mass,
        y: v.y + force.y / mass,
      }));
    },
    []
  );

  const applyDamping = useCallback((damping: number = 0.95) => {
    setVelocity((v) => ({
      x: v.x * damping,
      y: v.y * damping,
    }));
  }, []);

  const update = useCallback(() => {
    setPosition((p) => ({
      x: p.x + velocity.x,
      y: p.y + velocity.y,
    }));
  }, [velocity]);

  return {
    position,
    velocity,
    applyForce,
    applyDamping,
    update,
  };
}

export function checkCollision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

export function snapToGrid(value: number, gridSize: number = 20): number {
  return Math.round(value / gridSize) * gridSize;
}
