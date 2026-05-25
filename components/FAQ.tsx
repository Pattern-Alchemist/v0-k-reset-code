'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: "What is the 7-Day Reset Protocol?",
    answer: "A structured program designed to break through mental chaos and rebuild your foundational habits. You'll get daily action protocols, mental clarity exercises, and progress tracking.",
  },
  {
    question: "Who is this assessment for?",
    answer: "Anyone feeling overwhelmed, unfocused, or stuck in chaotic patterns. Whether you're struggling with consistency or want to optimize your mental performance.",
  },
  {
    question: "How long does the assessment take?",
    answer: "Just 4 minutes. Four targeted questions that reveal your current mental operating state.",
  },
  {
    question: "What happens after I pay?",
    answer: "You'll receive immediate access via email with login credentials and onboarding instructions. For the cohort, you'll also get an invitation to our private community.",
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with the program.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-slate-900/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <span className="text-white font-semibold">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-6 pb-6 text-gray-300"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
