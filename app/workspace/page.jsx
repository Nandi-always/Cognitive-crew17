'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useLayoutStore } from '@/lib/stores/layout';
import { useProjectManager } from '@/lib/hooks/useProjectManager';
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas';
import { HomeModel } from '@/components/canvas/HomeModel';
import { AILayoutGenerator } from '@/components/features/AILayoutGenerator';
import { SmartZoning } from '@/components/features/SmartZoning';
import { WalkthroughViewer } from '@/components/features/WalkthroughViewer';
import { EnergyAnalysis } from '@/components/features/EnergyAnalysis';

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('2d');
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('My Beautiful Home');
  const [projectArea, setProjectArea] = useState(900);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  // Feature modals
  const [showAILayout, setShowAILayout] = useState(false);
  const [showSmartZoning, setShowSmartZoning] = useState(false);
  const [show3DWalkthrough, setShow3DWalkthrough] = useState(false);
  const [showEnergyAnalysis, setShowEnergyAnalysis] = useState(false);

  const { rooms, furniture, addRoom, deleteRoom } = useLayoutStore();
  const { saveLayout, getLayout, loading: apiLoading } = useProjectManager();

  // Load layout from query params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('projectId');
    if (id) {
      setProjectId(id);
      loadProjectLayout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjectLayout = async (id) => {
    try {
      const data = await getLayout(id);
      if (data.layout) {
        console.log('Loaded layout:', data.layout);
      }
    } catch (err) {
      console.error('Failed to load layout:', err);
      setSaveMessage('Failed to load layout');
    }
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name: `Room ${rooms.length + 1}`,
      type: 'bedroom',
      width: 12,
      height: 12,
      x: 50 + rooms.length * 20,
      y: 50 + rooms.length * 20,
      color: '#dbeafe',
    };
    addRoom(newRoom);
    setSaveMessage('✅ Room added');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleSaveLayout = async () => {
    if (!projectId) {
      setSaveMessage('No project selected. Please create or load a project first.');
      return;
    }

    setIsSaving(true);
    setSaveMessage('Saving...');
    try {
      const layoutData = {
        rooms: rooms.map((r) => ({
          id: r.id,
          name: r.name,
          type: r.type,
          width: r.width,
          height: r.height,
          x: r.x,
          y: r.y,
          color: r.color,
        })),
        furniture: furniture.map((f) => ({
          id: f.id,
          name: f.name,
          type: f.type,
          width: f.width,
          height: f.height,
          x: f.x,
          y: f.y,
          roomId: f.roomId,
          rotation: f.rotation,
        })),
        walls: [],
      };

      await saveLayout(projectId, layoutData, true);
      setSaveMessage('✅ Layout saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('❌ Failed to save layout');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateLayout = async () => {
    setShowAILayout(true);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, { rooms, furniture }]);
      setUndoStack(undoStack.slice(0, -1));
      setSaveMessage('↶ Undo');
      setTimeout(() => setSaveMessage(''), 1500);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, { rooms, furniture }]);
      setRedoStack(redoStack.slice(0, -1));
      setSaveMessage('↷ Redo');
      setTimeout(() => setSaveMessage(''), 1500);
    }
  };

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
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total Area (sq ft)
              </label>
              <input
                type="number"
                value={projectArea}
                onChange={(e) => setProjectArea(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Rooms ({rooms.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rooms.length === 0 ? (
                  <p className="text-sm text-slate-500">No rooms added yet</p>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-3 rounded bg-slate-100 border border-slate-200 flex justify-between items-start"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{room.name}</p>
                        <p className="text-xs text-slate-600">
                          {Math.round(room.width)} × {Math.round(room.height)} ft²
                        </p>
                      </div>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button
              onClick={handleAddRoom}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              + Add Room
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Center Canvas */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col"
      >
        {/* Features Bar */}
        <div className="h-24 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 overflow-x-auto">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Smart Features</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAILayout(true)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🤖</span>
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">AI Layout</span>
            </button>
            <button
              onClick={() => setShowSmartZoning(true)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📦</span>
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">Smart Zoning</span>
            </button>
            <button
              onClick={() => setShow3DWalkthrough(true)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">3D Walkthrough</span>
            </button>
            <button
              onClick={() => setShowEnergyAnalysis(true)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">Energy Efficient</span>
            </button>
          </div>
        </div>

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
            <Button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              variant="outline"
              size="sm"
            >
              ↶ Undo
            </Button>
            <Button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              variant="outline"
              size="sm"
            >
              ↷ Redo
            </Button>
            <Button
              onClick={handleSaveLayout}
              disabled={isSaving || apiLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isSaving ? 'Saving...' : '💾 Save'}
            </Button>
          </div>
          {saveMessage && (
            <div className="ml-4 text-sm font-medium text-slate-700 animate-pulse">
              {saveMessage}
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          {activeTab === '2d' && <FloorPlanCanvas />}

          {activeTab === '3d' && <HomeModel />}

          {activeTab === 'analytics' && (
            <div className="w-full h-full p-8 overflow-y-auto">
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Layout Scores</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Space Efficiency', score: 82 },
                    { label: 'Natural Light', score: 75 },
                    { label: 'Privacy', score: 88 },
                    { label: 'Circulation', score: 70 },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="p-4 rounded-lg bg-white border border-slate-200"
                    >
                      <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-indigo-600">{metric.score}</span>
                        <span className="text-sm text-slate-600">/100</span>
                      </div>
                      <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium mb-2">💡 Recommendations</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Add windows to increase natural light in bedrooms</li>
                    <li>• Consider repositioning furniture for better traffic flow</li>
                    <li>• Utilize corner spaces for storage to improve efficiency</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.main>

      {/* Right Panel - AI Assistant */}
      <motion.aside
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">AI Assistant</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-lg bg-slate-100">
            <p className="text-sm text-slate-700">
              👋 Welcome to SmartHomeViz AI! Describe your home preferences and I'll help optimize
              your layout.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <p className="text-sm text-indigo-900">
              <strong>Tips:</strong>
              <br />• Add rooms first using the left panel
              <br />• Use 2D view to arrange furniture
              <br />• Check 3D view to visualize the space
              <br />• Generate layouts with AI
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 p-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Describe your preferences..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
            />
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" size="icon">
              ✓
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Feature Modals */}
      {showAILayout && (
        <AILayoutGenerator
          onClose={() => setShowAILayout(false)}
          onGenerated={(msg) => {
            setSaveMessage(msg);
            setTimeout(() => setSaveMessage(''), 3000);
          }}
        />
      )}
      {showSmartZoning && (
        <SmartZoning
          onClose={() => setShowSmartZoning(false)}
          onApplied={(msg) => {
            setSaveMessage(msg);
            setTimeout(() => setSaveMessage(''), 3000);
          }}
        />
      )}
      {show3DWalkthrough && <WalkthroughViewer onClose={() => setShow3DWalkthrough(false)} />}
      {showEnergyAnalysis && <EnergyAnalysis onClose={() => setShowEnergyAnalysis(false)} />}
    </div>
  );
}
