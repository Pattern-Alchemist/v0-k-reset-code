import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import Offer from '../components/Offer';
import { pricing } from '../config/pricing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Assessment', desc: 'Answer 4 questions about your mental patterns' },
              { step: '02', title: 'Analysis', desc: 'Get your tier score and personalized insights' },
              { step: '03', title: 'Action', desc: 'Choose the right program for your transformation' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-purple-500/30 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Preview */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Choose Your Path
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Based on your assessment results, we'll recommend the right program for your current state
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Offer
              title={pricing.reset.name}
              price={pricing.reset.price}
              description={pricing.reset.description}
              features={pricing.reset.features}
              cta="Start Assessment"
              href="/assessment"
            />
            <Offer
              title={pricing.cohort.name}
              price={pricing.cohort.price}
              description={pricing.cohort.description}
              features={pricing.cohort.features}
              cta="Learn More"
              href="/cohort"
              highlighted
            />
          </div>
        </div>
      </section>

      <FAQ />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} K7 Chaos. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
