'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-slate-800/50 backdrop-blur border border-slate-700 p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
      <p className="text-slate-400 mb-8">Sign up to start designing your smart home</p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <Button
          onClick={() => setLoading(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-sm text-slate-400">OR</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      <Button variant="outline" className="w-full border-slate-600 text-slate-300">
        <span className="mr-2">🔵</span> Sign up with Google
      </Button>

      <p className="text-center text-slate-400 mt-8">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
