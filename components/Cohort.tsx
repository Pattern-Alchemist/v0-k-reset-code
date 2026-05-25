'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { pricing } from '../config/pricing';

export default function Cohort() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Elite Cohort Access
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join a high-performance group with guided mentorship and peer accountability
          </p>
        </motion.div>

        {/* Main Offer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-2">{pricing.cohort.name}</h3>
            <p className="text-gray-300 mb-4">{pricing.cohort.description}</p>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ₹{pricing.cohort.price}
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {pricing.cohort.features.map((feature, i) => (
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
                body: JSON.stringify({ amount: pricing.cohort.price, offer: 'cohort' }),
              });
              const order = await res.json();
              // Handle Razorpay checkout here
              console.log('Order:', order);
            }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Join the Cohort
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Secure payment powered by Razorpay
          </p>
        </motion.div>

        {/* Back to Reset */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/reset"
            className="text-gray-400 hover:text-white"
          >
            ← Back to 7-Day Reset Protocol
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
