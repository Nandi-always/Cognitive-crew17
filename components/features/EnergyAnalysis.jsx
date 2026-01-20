'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/stores/layout';

export function EnergyAnalysis({ onClose }) {
  const { rooms, furniture } = useLayoutStore();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate analysis
    setTimeout(() => {
      const totalArea = rooms.reduce((sum, r) => sum + r.width * r.height, 0);
      const avgCeiling = 9; // feet
      const volume = totalArea * avgCeiling;

      const heating = Math.round((volume / 100) * 5);
      const cooling = Math.round((volume / 100) * 4);
      const lighting = Math.round(totalArea * 0.15);
      const appliances = Math.round(totalArea / 50);

      const total = heating + cooling + lighting + appliances;

      setAnalysis({
        heating: { value: heating, label: 'Heating', percent: (heating / total) * 100 },
        cooling: { value: cooling, label: 'Cooling', percent: (cooling / total) * 100 },
        lighting: { value: lighting, label: 'Lighting', percent: (lighting / total) * 100 },
        appliances: { value: appliances, label: 'Appliances', percent: (appliances / total) * 100 },
        total,
        totalArea: Math.round(totalArea),
        recommendations: [
          '💡 Add skylights to reduce lighting consumption by 15%',
          '🪟 Install energy-efficient windows to reduce heating/cooling by 20%',
          '🌳 Plant shade trees to reduce cooling costs by 10%',
          '⚡ Use LED fixtures to save 75% on lighting energy',
          '🔄 Install programmable thermostat for 10% savings',
        ],
      });
      setLoading(false);
    }, 1500);
  }, [rooms]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Energy Efficiency Analysis</h3>
              <p className="text-sm text-slate-600">Optimize your home's energy consumption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
              <p className="text-slate-600 font-medium">Analyzing energy consumption...</p>
            </div>
          ) : analysis ? (
            <>
              {/* Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                  <p className="text-sm text-indigo-600 font-medium">Total Area</p>
                  <p className="text-3xl font-bold text-indigo-900 mt-2">
                    {analysis.totalArea} <span className="text-lg">sq ft</span>
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">Annual Estimate</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {analysis.total} <span className="text-lg">kWh</span>
                  </p>
                </div>
              </div>

              {/* Energy Breakdown */}
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Energy Breakdown</h4>
                <div className="space-y-4">
                  {[analysis.heating, analysis.cooling, analysis.lighting, analysis.appliances].map(
                    (item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-2">
                          <p className="font-medium text-slate-700">{item.label}</p>
                          <p className="text-sm text-slate-600">{item.value} kWh ({Math.round(item.percent)}%)</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-3 rounded-full"
                            style={{
                              backgroundColor: {
                                Heating: '#ff6b6b',
                                Cooling: '#4dabf7',
                                Lighting: '#ffd43b',
                                Appliances: '#b197fc',
                              }[item.label],
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-bold text-slate-900 mb-4">💡 Recommendations</h4>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 rounded-lg bg-green-50 border border-green-200"
                    >
                      <p className="text-sm text-green-900">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Efficiency Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-3">🎯 Quick Wins</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>✓ Optimize thermostat settings based on occupancy</li>
                  <li>✓ Seal air leaks around windows and doors</li>
                  <li>✓ Upgrade insulation in walls and attics</li>
                  <li>✓ Install motion-sensor lighting in low-traffic areas</li>
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
