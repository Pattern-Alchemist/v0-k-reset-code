'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { pricing } from '../config/pricing';

interface OfferProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}

export default function Offer({ title, price, description, features, cta, href, highlighted }: OfferProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl p-8 backdrop-blur-sm border ${
        highlighted
          ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
        ₹{price}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start text-gray-300">
            <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`block w-full py-4 rounded-full font-semibold text-lg text-center transition-all ${
          highlighted
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
        }`}
      >
        {cta}
      </Link>
    </motion.div>
  );
}
