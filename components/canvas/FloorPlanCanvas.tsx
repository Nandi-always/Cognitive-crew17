'use client';

import { useLayoutStore } from '@/lib/stores/layout';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import { useState } from 'react';

const GRID_SIZE = 40; // Grid cell size in pixels

function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function FloorPlanCanvas() {
  const { rooms, furniture, selectedRoomId, selectRoom, updateRoom } = useLayoutStore();
  const [scale, setScale] = useState(1);
  const [draggedRoomId, setDraggedRoomId] = useState<string | null>(null);

  const handleRoomDragEnd = (roomId: string, e: any) => {
    const snappedX = snapToGrid(e.target.x(), GRID_SIZE);
    const snappedY = snapToGrid(e.target.y(), GRID_SIZE);

    updateRoom(roomId, {
      x: snappedX,
      y: snappedY,
    });
    setDraggedRoomId(null);
  };

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
            points={[i * GRID_SIZE, 0, i * GRID_SIZE, 2000]}
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <Line
            key={`h-${i}`}
            points={[0, i * GRID_SIZE, 2000, i * GRID_SIZE]}
            stroke="#e2e8f0"
            strokeWidth={0.5}
          />
        ))}

        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id}>
            <Rect
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill={room.color || '#e0e7ff'}
              stroke={selectedRoomId === room.id ? '#4f46e5' : '#cbd5e1'}
              strokeWidth={selectedRoomId === room.id ? 3 : 1}
              onClick={() => selectRoom(room.id)}
              draggable
              onDragStart={() => setDraggedRoomId(room.id)}
              onDragEnd={(e) => handleRoomDragEnd(room.id, e)}
            />
            {/* Room label */}
            <Text
              x={room.x + 5}
              y={room.y + 5}
              text={room.name}
              fontSize={12}
              fill={room.color === '#e0e7ff' ? '#334155' : '#1e293b'}
              pointerEvents="none"
            />
            {/* Room dimensions */}
            <Text
              x={room.x + 5}
              y={room.y + room.height - 20}
              text={`${Math.round(room.width / GRID_SIZE)} × ${Math.round(room.height / GRID_SIZE)} units`}
              fontSize={10}
              fill="#64748b"
              pointerEvents="none"
            />
          </g>
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

        {/* Alignment guides (when dragging) */}
        {draggedRoomId && (
          <>
            {/* Vertical guide lines from other rooms */}
            {rooms
              .filter((r) => r.id !== draggedRoomId)
              .map((r) => [
                <Line
                  key={`v-guide-${r.id}-left`}
                  points={[r.x, 0, r.x, 2000]}
                  stroke="#ef4444"
                  strokeWidth={1}
                  dash={[5, 5]}
                />,
                <Line
                  key={`v-guide-${r.id}-right`}
                  points={[r.x + r.width, 0, r.x + r.width, 2000]}
                  stroke="#ef4444"
                  strokeWidth={1}
                  dash={[5, 5]}
                />,
              ])}
            {/* Horizontal guide lines from other rooms */}
            {rooms
              .filter((r) => r.id !== draggedRoomId)
              .map((r) => [
                <Line
                  key={`h-guide-${r.id}-top`}
                  points={[0, r.y, 2000, r.y]}
                  stroke="#ef4444"
                  strokeWidth={1}
                  dash={[5, 5]}
                />,
                <Line
                  key={`h-guide-${r.id}-bottom`}
                  points={[0, r.y + r.height, 2000, r.y + r.height]}
                  stroke="#ef4444"
                  strokeWidth={1}
                  dash={[5, 5]}
                />,
              ])}
          </>
        )}
      </Layer>
    </Stage>
  );
}
