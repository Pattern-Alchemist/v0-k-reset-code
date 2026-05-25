// lib/brain.ts
import { generateInsight } from './openai';

export interface BrainAnalysis {
  score: number;
  tier: string;
  insight: string;
  recommendedOffer: 'reset' | 'cohort';
}

export async function analyzeAssessment(
  answers: Record<string, number>,
  score: number,
  tier: string
): Promise<BrainAnalysis> {
  const insight = await generateInsight(score, tier, answers);
  
  // Determine recommended offer based on tier
  const recommendedOffer: 'reset' | 'cohort' = 
    tier === 'FRAGMENTED' || tier === 'UNSTABLE' ? 'reset' : 'cohort';
  
  return {
    score,
    tier,
    insight,
    recommendedOffer,
  };
}

export function getOfferByTier(tier: string): 'reset' | 'cohort' {
  if (tier === 'FRAGMENTED' || tier === 'UNSTABLE') {
    return 'reset';
  }
  return 'cohort';
}
