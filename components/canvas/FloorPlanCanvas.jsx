'use client';

import { useRef, useEffect, useState } from 'react';
import { useLayoutStore } from '@/lib/stores/layout';

export function FloorPlanCanvas() {
  const canvasRef = useRef(null);
  const { rooms, furniture, updateRoom, updateFurniture } = useLayoutStore();
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Get item at coordinates
  const getItemAtCoords = (x, y) => {
    // Check furniture first (on top)
    for (let item of furniture) {
      const itemX = item.x * scale + 50;
      const itemY = item.y * scale + 50;
      const width = item.width * scale;
      const height = item.height * scale;
      if (x >= itemX && x <= itemX + width && y >= itemY && y <= itemY + height) {
        return { type: 'furniture', item, itemX, itemY, width, height };
      }
    }
    
    // Then check rooms
    for (let room of rooms) {
      const roomX = room.x * scale + 50;
      const roomY = room.y * scale + 50;
      const width = room.width * scale;
      const height = room.height * scale;
      if (x >= roomX && x <= roomX + width && y >= roomY && y <= roomY + height) {
        return { type: 'room', item: room, itemX: roomX, itemY: roomY, width, height };
      }
    }
    return null;
  };

  // Mouse down
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const found = getItemAtCoords(x, y);
    if (found) {
      setIsDragging(true);
      setDraggedItem(found);
      setDragOffset({
        x: x - found.itemX,
        y: y - found.itemY,
      });
    }
  };

  // Mouse move
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && draggedItem) {
      const newX = (x - dragOffset.x - 50) / scale;
      const newY = (y - dragOffset.y - 50) / scale;

      if (draggedItem.type === 'room') {
        updateRoom(draggedItem.item.id, { x: newX, y: newY });
      } else {
        updateFurniture(draggedItem.item.id, { x: newX, y: newY });
      }

      setDraggedItem({
        ...draggedItem,
        itemX: x - dragOffset.x,
        itemY: y - dragOffset.y,
      });
    } else {
      // Change cursor on hover
      const found = getItemAtCoords(x, y);
      canvas.style.cursor = found ? 'grab' : 'crosshair';
    }
  };

  // Mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw rooms
    rooms.forEach((room) => {
      const x = room.x * scale + 50;
      const y = room.y * scale + 50;
      const width = room.width * scale;
      const height = room.height * scale;

      // Room fill
      ctx.fillStyle = room.color || '#dbeafe';
      ctx.fillRect(x, y, width, height);

      // Room border
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Room label
      ctx.fillStyle = '#0c4a6e';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(room.name, x + width / 2, y + height / 2);
    });

    // Draw furniture
    furniture.forEach((item) => {
      const x = item.x * scale + 50;
      const y = item.y * scale + 50;
      const width = item.width * scale;
      const height = item.height * scale;

      // Furniture fill
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x, y, width, height);

      // Furniture border
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);

      // Furniture label
      ctx.fillStyle = '#78350f';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.name, x + width / 2, y + height / 2);
    });

    // Draw border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [rooms, furniture, scale]);

  const handleZoom = (direction) => {
    setScale((prev) => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(newScale, 3));
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      <div className="p-4 border-b border-slate-200 flex gap-2 items-center">
        <button
          onClick={() => handleZoom('out')}
          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm font-medium"
        >
          −
        </button>
        <span className="px-3 py-1 text-sm font-medium">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => handleZoom('in')}
          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm font-medium"
        >
          +
        </button>
        <div className="flex-1" />
        <span className="text-xs text-slate-600">💡 Drag items to move them</span>
      </div>
      <canvas
        ref={canvasRef}
        className="flex-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ backgroundColor: '#f8fafc' }}
      />
    </div>
  );
}
