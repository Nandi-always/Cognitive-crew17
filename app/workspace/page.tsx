'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/stores/layout';

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('2d');
  const { rooms } = useLayoutStore();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-50">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white border-r border-slate-200 overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Project Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
              <input type="text" defaultValue="My Beautiful Home" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Total Area (sq ft)</label>
              <input type="number" defaultValue="900" className="input-field" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Rooms ({rooms.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rooms.length === 0 ? (
                  <p className="text-sm text-slate-500">No rooms added yet</p>
                ) : (
                  rooms.map((room) => (
                    <div key={room.id} className="p-3 rounded bg-slate-100 border border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{room.name}</p>
                      <p className="text-xs text-slate-600">{Math.round(room.width)} × {Math.round(room.height)} ft²</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">+ Add Room</Button>
          </div>
        </div>
      </motion.aside>

      {/* Center Canvas */}
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="2d">2D Layout</TabsTrigger>
              <TabsTrigger value="3d">3D View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Undo</Button>
            <Button variant="outline" size="sm">Redo</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">Generate Layout</Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          {activeTab === '2d' && (
            <div className="w-full h-full flex items-center justify-center bg-slate-300">
              <div className="text-center">
                <p className="text-slate-700 font-semibold">2D Floor Plan Canvas</p>
                <p className="text-slate-600 text-sm mt-1">Canvas rendering will load here</p>
              </div>
            </div>
          )}

          {activeTab === '3d' && (
            <div className="w-full h-full flex items-center justify-center bg-slate-400">
              <div className="text-center">
                <p className="text-white font-semibold">3D Interactive Model</p>
                <p className="text-slate-200 text-sm mt-1">3D viewer will load here</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="w-full h-full p-8">
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Layout Scores</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Space Efficiency', score: 82 },
                    { label: 'Natural Light', score: 75 },
                    { label: 'Privacy', score: 88 },
                    { label: 'Circulation', score: 70 },
                  ].map((metric) => (
                    <div key={metric.label} className="p-4 rounded-lg bg-white border border-slate-200">
                      <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-indigo-600">{metric.score}</span>
                        <span className="text-sm text-slate-600">/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.main>

      {/* Right Panel - AI Assistant */}
      <motion.aside initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">AI Assistant</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-lg bg-slate-100">
            <p className="text-sm text-slate-700">👋 Welcome to SmartHomeViz AI! Describe your home preferences and I'll help optimize your layout.</p>
          </div>
        </div>

        <div className="border-t border-slate-200 p-6">
          <div className="flex gap-2">
            <input type="text" placeholder="Describe your preferences..." className="input-field flex-1" />
            <Button className="bg-indigo-600 hover:bg-indigo-700" size="icon">✓</Button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
