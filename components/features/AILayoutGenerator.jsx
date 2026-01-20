'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/stores/layout';

export function AILayoutGenerator({ onClose, onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState('balanced');
  const { addRoom } = useLayoutStore();

  const layouts = {
    balanced: [
      { name: 'Living Room', type: 'living', width: 16, height: 14, color: '#fce7f3' },
      { name: 'Kitchen', type: 'kitchen', width: 12, height: 10, color: '#fef3c7' },
      { name: 'Master Bedroom', type: 'bedroom', width: 14, height: 12, color: '#dbeafe' },
      { name: 'Bathroom', type: 'bathroom', width: 8, height: 8, color: '#e0e7ff' },
    ],
    open: [
      { name: 'Open Living Space', type: 'living', width: 20, height: 18, color: '#fce7f3' },
      { name: 'Kitchen Island', type: 'kitchen', width: 14, height: 12, color: '#fef3c7' },
      { name: 'Master Suite', type: 'bedroom', width: 16, height: 14, color: '#dbeafe' },
    ],
    compact: [
      { name: 'Studio', type: 'living', width: 14, height: 12, color: '#fce7f3' },
      { name: 'Kitchenette', type: 'kitchen', width: 8, height: 8, color: '#fef3c7' },
      { name: 'Sleeping Area', type: 'bedroom', width: 10, height: 10, color: '#dbeafe' },
      { name: 'Bathroom', type: 'bathroom', width: 6, height: 6, color: '#e0e7ff' },
    ],
    spacious: [
      { name: 'Grand Living Room', type: 'living', width: 20, height: 16, color: '#fce7f3' },
      { name: 'Chef\'s Kitchen', type: 'kitchen', width: 16, height: 14, color: '#fef3c7' },
      { name: 'Master Bedroom', type: 'bedroom', width: 16, height: 14, color: '#dbeafe' },
      { name: 'Guest Bedroom', type: 'bedroom', width: 12, height: 12, color: '#dbeafe' },
      { name: 'Home Office', type: 'office', width: 12, height: 12, color: '#d1fae5' },
      { name: 'Master Bath', type: 'bathroom', width: 10, height: 10, color: '#e0e7ff' },
    ],
  };

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const selectedLayout = layouts[preference];
    selectedLayout.forEach((room, index) => {
      const newRoom = {
        id: `room-${Date.now()}-${index}`,
        ...room,
        x: 10 + (index % 2) * 30,
        y: 10 + Math.floor(index / 2) * 30,
      };
      addRoom(newRoom);
    });

    setLoading(false);
    onGenerated(`✨ ${preference.toUpperCase()} layout generated with ${selectedLayout.length} rooms!`);
    onClose();
  };

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
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="text-xl font-bold text-slate-900">AI Layout Generator</h3>
            <p className="text-sm text-slate-600">Create optimized layouts instantly</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium text-slate-700">Select layout preference:</p>
          {Object.entries(layouts).map(([key, layout]) => (
            <button
              key={key}
              onClick={() => setPreference(key)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                preference === key
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <p className="font-medium text-slate-900 capitalize">{key} Layout</p>
              <p className="text-sm text-slate-600">{layout.length} rooms</p>
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
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Layout'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
