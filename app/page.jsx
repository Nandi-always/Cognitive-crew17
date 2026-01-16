'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-900/30 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-white font-bold text-xl">SmartHomeViz AI</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="text-slate-200 hover:text-white transition">
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Design Your Intelligent{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              Digital Home Layout
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-300 mb-8"
          >
            Upload a sketch or describe your home to instantly see AI-generated layout options with
            real-time 3D visualization
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-lg"
            >
              Upload Floor Plan
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 text-lg"
            >
              Describe My Home
            </Link>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16"
          >
            {[
              { icon: '🧶', label: 'AI Layout Generation' },
              { icon: '◼️', label: 'Smart Zoning' },
              { icon: '🧩', label: '3D Walkthrough' },
              { icon: '💡', label: 'Energy Efficient' },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                whileHover={{ y: -5 }}
                className="p-4 rounded-lg bg-slate-800/40 backdrop-blur border border-slate-700 text-center"
              >
                <span className="text-3xl mb-2">{feature.icon}</span>
                <p className="text-slate-300">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Powerful Features for Smart Home Design
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '2D Floor Plan Editor',
                description:
                  'Drag-and-drop tools to draw rooms, walls, doors, and windows with snap-to-grid precision',
              },
              {
                title: '3D Interactive Visualization',
                description:
                  'Orbit, zoom, and pan through a fully interactive 3D model of your home design',
              },
              {
                title: 'AI-Powered Suggestions',
                description:
                  'Get intelligent recommendations for furniture placement and room optimization',
              },
              {
                title: 'Smart Device Simulation',
                description:
                  'Place IoT devices and simulate their coverage and communication patterns',
              },
              {
                title: 'Export & Share',
                description:
                  'Export as PDF, PNG, or JSON for sharing with architects and contractors',
              },
              {
                title: 'Multi-Language Support',
                description: 'Available in English, Hindi, and Kannada for broader accessibility',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-slate-800/40 backdrop-blur border border-slate-700"
              >
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Design Your Smart Home?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start creating your ideal home layout with AI assistance today
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-white hover:bg-slate-50 text-indigo-600 font-bold text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">SmartHomeViz AI</h4>
              <p className="text-slate-400 text-sm">
                Intelligent digital home layout visualization
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="/" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="/" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link href="/" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2024 SmartHomeViz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
