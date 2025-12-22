'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Manage your home design projects</p>
          </div>
          <Link href="/workspace" className="inline-flex items-center px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">+ New Project</Link>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 lg:col-span-3 rounded-lg border-2 border-dashed border-slate-300 p-12 text-center"
          >
            <div className="text-4xl mb-4">📁</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No projects yet</h2>
            <p className="text-slate-600 mb-6">Create your first home design project to get started with AI-powered layouts</p>
            <Link href="/workspace" className="inline-flex items-center px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">Create First Project</Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
