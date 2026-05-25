'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { pricing } from '../config/pricing';
import { useAssessmentStore } from '../store/assessmentStore';
import { getTierDescription } from '../lib/scoring';

export default function ResetOffer() {
  const { score, tier } = useAssessmentStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for effect
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!tier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting...</div>
      </div>
    );
  }

  const tierInfo = getTierDescription(tier);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Analyzing your results...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Mental State: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{tierInfo.title}</span>
          </h1>
          {score !== null && (
            <p className="text-2xl text-gray-300">Score: {score}/100</p>
          )}
        </motion.div>

        {/* Tier Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{tierInfo.description}</h2>
          <p className="text-gray-300 text-lg">{tierInfo.recommendation}</p>
        </motion.div>

        {/* Offer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">{pricing.reset.name}</h3>
            <p className="text-gray-300 mb-4">{pricing.reset.description}</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ₹{pricing.reset.price}
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {pricing.reset.features.map((feature, i) => (
              <li key={i} className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={async () => {
              const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount: pricing.reset.price, offer: 'reset' }),
              });
              const order = await res.json();
              // Handle Razorpay checkout here
              console.log('Order:', order);
            }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Get Started Now
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Secure payment powered by Razorpay
          </p>
        </motion.div>

        {/* Alternative Offer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 mb-4">Looking for more intensive support?</p>
          <Link
            href="/cohort"
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            Explore Elite Cohort →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
