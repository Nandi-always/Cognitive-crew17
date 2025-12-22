'use client';

import { useEffect, useRef } from 'react';

export interface Score {
  spaceEfficiency: number;
  naturalLight: number;
  privacy: number;
  circulation: number;
  energy: number;
  overall: number;
}

export function calculateLayoutScore(
  rooms: Array<{ width: number; height: number; type: string; y: number }>,
  furniture: Array<{ type: string; x: number; y: number }>,
  totalArea: number
): Score {
  // Space efficiency: room usage
  const usedSpace = rooms.reduce((sum, room) => sum + room.width * room.height, 0);
  const spaceEfficiency = Math.min((usedSpace / totalArea) * 100, 100);

  // Natural light: rooms near windows (south-facing)
  const windowProximity = rooms.filter((r) => r.y < totalArea / 3).length;
  const naturalLight = (windowProximity / rooms.length) * 100;

  // Privacy: separated bedrooms
  const bedrooms = rooms.filter((r) => r.type === 'bedroom').length;
  const privacy = Math.min(bedrooms * 25, 100);

  // Circulation: furniture placement efficiency
  const furnitureCount = furniture.length;
  const circulation = Math.min((furnitureCount / rooms.length) * 50, 100);

  // Energy efficiency: compact layout
  const avgRoomSize = usedSpace / rooms.length;
  const energy = Math.min((avgRoomSize / 100) * 50, 100);

  // Overall score
  const overall =
    (spaceEfficiency + naturalLight + privacy + circulation + energy) / 5;

  return {
    spaceEfficiency: Math.round(spaceEfficiency),
    naturalLight: Math.round(naturalLight),
    privacy: Math.round(privacy),
    circulation: Math.round(circulation),
    energy: Math.round(energy),
    overall: Math.round(overall),
  };
}

export function generateLayoutVariants(
  bhk: number,
  area: number,
  style: string
): Array<{ id: string; name: string; rooms: any[] }> {
  const variants = [];

  // Generate 3 different layout variants
  for (let i = 0; i < 3; i++) {
    const roomSize = Math.sqrt((area / (bhk + 2)) * (0.8 + i * 0.1));
    const rooms = [
      {
        id: `living-${i}`,
        name: 'Living Room',
        type: 'living',
        width: roomSize * 1.2,
        height: roomSize,
        x: 10 + i * 50,
        y: 10,
      },
      {
        id: `kitchen-${i}`,
        name: 'Kitchen',
        type: 'kitchen',
        width: roomSize * 0.8,
        height: roomSize * 0.8,
        x: 10 + i * 50,
        y: 80,
      },
    ];

    for (let j = 0; j < bhk; j++) {
      rooms.push({
        id: `bedroom-${j}-${i}`,
        name: `Bedroom ${j + 1}`,
        type: 'bedroom',
        width: roomSize,
        height: roomSize,
        x: 200 + (j % 2) * 100 + i * 50,
        y: 10 + Math.floor(j / 2) * 100,
      });
    }

    variants.push({
      id: `variant-${i}`,
      name: `Layout ${i + 1}`,
      rooms,
    });
  }

  return variants;
}
