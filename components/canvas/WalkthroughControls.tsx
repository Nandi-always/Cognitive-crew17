import React from 'react';
import { Button } from '@/components/ui/button';

interface WalkthroughControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function WalkthroughControls({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  speed,
  onSpeedChange,
}: WalkthroughControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 flex items-center gap-4">
      {/* Play/Pause Button */}
      <Button
        onClick={isPlaying ? onPause : onPlay}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
        size="sm"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </Button>

      {/* Stop Button */}
      <Button onClick={onStop} variant="outline" size="sm">
        ⏹ Stop
      </Button>

      {/* Speed Control */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-700">Speed:</label>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="px-2 py-1 rounded border border-slate-300 text-xs bg-white hover:bg-slate-50"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1.0x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2.0x</option>
        </select>
      </div>

      {/* Info Text */}
      <div className="text-xs text-slate-600">
        {isPlaying ? '🎬 Walkthrough in progress...' : '💡 Click play to start walkthrough'}
      </div>
    </div>
  );
}
