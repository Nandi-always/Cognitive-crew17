'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/stores/layout';

export function SmartZoning({ onClose, onApplied }) {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState('functional');
  const { rooms, furniture, addFurniture } = useLayoutStore();

  const strategies = {
    functional: {
      name: 'Functional Zoning',
      icon: '⚙️',
      desc: 'Organize by activity type',
      rules: [
        'Bedrooms: Private zones away from living areas',
        'Kitchen: Central to dining/living areas',
        'Bathrooms: Private zones',
      ],
    },
    workflow: {
      name: 'Workflow Zoning',
      icon: '🔄',
      desc: 'Optimize movement patterns',
      rules: [
        'Kitchen work triangle setup',
        'Minimal crossing paths',
        'Service areas efficiently placed',
      ],
    },
    social: {
      name: 'Social Zoning',
      icon: '👥',
      desc: 'Group gathering spaces',
      rules: [
        'Living areas clustered together',
        'Kitchen open to entertaining spaces',
        'Private zones separated',
      ],
    },
  };

  const handleApply = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add zoning furniture/markers
    rooms.forEach((room, index) => {
      const zoneColor = ['zone-red', 'zone-blue', 'zone-green', 'zone-yellow'][index % 4];
      addFurniture({
        id: `zone-${Date.now()}-${index}`,
        name: `${strategy.toUpperCase()} Zone`,
        type: 'zone-marker',
        x: room.x + 1,
        y: room.y + 1,
        width: 2,
        height: 2,
        roomId: room.id,
        zone: strategy,
        color: zoneColor,
      });
    });

    setLoading(false);
    onApplied(`✅ ${strategies[strategy].name} applied to layout!`);
    onClose();
  };

  const current = strategies[strategy];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{current.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Smart Zoning</h3>
            <p className="text-sm text-slate-600">Optimize space organization</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {Object.entries(strategies).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setStrategy(key)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                strategy === key
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <p className="font-medium text-slate-900">{data.name}</p>
              <p className="text-sm text-slate-600 mb-2">{data.desc}</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {data.rules.slice(0, 2).map((rule, i) => (
                  <li key={i}>• {rule}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={loading || rooms.length === 0}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply Zoning'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
