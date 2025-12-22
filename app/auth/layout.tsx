'use client';

import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-1 items-center justify-center p-12"
      >
        <div className="max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">SmartHomeViz AI</h1>
          <p className="text-slate-300 mb-8">
            Design your intelligent digital home layout with AI-powered suggestions and real-time 3D visualization.
          </p>

          <div className="space-y-4">
            {[
              '✔ AI-powered layout generation',
              '✔ Real-time 3D visualization',
              '✔ Smart furniture placement',
              '✔ Multi-user collaboration',
            ].map((feature) => (
              <p key={feature} className="text-slate-300">{feature}</p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md">{children}</div>
      </motion.div>
    </div>
  );
}
