import React from 'react';
import { Button } from '@/components/ui/button';

interface CanvasToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onAddRoom: () => void;
  onDeleteRoom: () => void;
  canDelete: boolean;
}

export function CanvasToolbar({
  selectedTool,
  onToolSelect,
  onAddRoom,
  onDeleteRoom,
  canDelete,
}: CanvasToolbarProps) {
  const tools = [
    { id: 'select', label: '🔖 Select', icon: '📌' },
    { id: 'draw', label: '✏️ Draw Room', icon: '📝' },
    { id: 'wall', label: '🧱 Wall', icon: '🧱' },
    { id: 'door', label: '🚪 Door', icon: '🚪' },
    { id: 'window', label: '🪟 Window', icon: '🪟' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 border-b border-slate-200">
      {/* Tool buttons */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`px-3 py-2 rounded text-sm font-medium transition ${
              selectedTool === tool.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="h-6 border-l border-slate-300" />

      {/* Room actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddRoom}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          + Add Room
        </Button>
        <Button
          onClick={onDeleteRoom}
          disabled={!canDelete}
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          🗑️ Delete
        </Button>
      </div>

      {/* Info text */}
      <div className="ml-auto text-xs text-slate-600">
        <span>💡 Tip: Hold Shift to snap to grid</span>
      </div>
    </div>
  );
}
