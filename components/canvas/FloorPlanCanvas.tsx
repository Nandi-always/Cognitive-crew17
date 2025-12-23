'use client';

import { useLayoutStore } from '@/lib/stores/layout';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useState } from 'react';

export function FloorPlanCanvas() {
  const { rooms, furniture, selectedRoomId, selectRoom } = useLayoutStore();
  const [scale, setScale] = useState(1);

  return (
    <Stage
      width={window.innerWidth - 360 - 320}
      height={window.innerHeight - 56}
      scale={{ x: scale, y: scale }}
      draggable
      onWheel={(e) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const newScale = e.evt.deltaY > 0 ? scale / scaleBy : scale * scaleBy;
        setScale(Math.max(0.5, Math.min(newScale, 3)));
      }}
    >
      <Layer>
        {/* Grid background */}
        {Array.from({ length: 50 }).map((_, i) => (
          <Line
            key={`v-${i}`}
            points={[i * 40, 0, i * 40, 2000]}
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <Line
            key={`h-${i}`}
            points={[0, i * 40, 2000, i * 40]}
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        ))}

        {/* Rooms */}
        {rooms.map((room) => (
          <Rect
            key={room.id}
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            fill={room.color || '#e0e7ff'}
            stroke={selectedRoomId === room.id ? '#4f46e5' : '#cbd5e1'}
            strokeWidth={selectedRoomId === room.id ? 3 : 1}
            onClick={() => selectRoom(room.id)}
            draggable
          />
        ))}

        {/* Furniture */}
        {furniture.map((item) => (
          <Rect
            key={item.id}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth={1}
            draggable
          />
        ))}
      </Layer>
    </Stage>
  );
}
