'use client';

import { useCallback, useState } from 'react';

export function usePhysics() {
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const applyForce = useCallback((force, mass = 1) => {
    setVelocity((v) => ({
      x: v.x + force.x / mass,
      y: v.y + force.y / mass,
    }));
  }, []);

  const applyDamping = useCallback((damping = 0.95) => {
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

export function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

export function snapToGrid(value, gridSize = 20) {
  return Math.round(value / gridSize) * gridSize;
}
