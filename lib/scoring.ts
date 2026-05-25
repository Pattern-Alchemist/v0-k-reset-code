// lib/scoring.ts
export function calculateScore(answers: Record<string, number>) {
  let score = 0;
  score += (answers.discipline || 0) * 2;
  score += (answers.pressure || 0) * 1.5;
  score += (answers.recovery || 0) * 1.2;
  score += (answers.consistency || 0) * 2;
  return Math.round((score / 40) * 100);
}

export function getTier(score: number) {
  if (score < 35) return "FRAGMENTED";
  if (score < 50) return "UNSTABLE";
  if (score < 65) return "STABILIZING";
  if (score < 80) return "ADAPTING";
  return "OPERATIONAL";
}

export function getTierDescription(tier: string) {
  const descriptions: Record<string, { title: string; description: string; recommendation: string }> = {
    FRAGMENTED: {
      title: "Fragmented State",
      description: "Your mental systems are highly disorganized. Immediate intervention needed.",
      recommendation: "Start with the 7-Day Reset Protocol to establish basic stability.",
    },
    UNSTABLE: {
      title: "Unstable Pattern",
      description: "You have some structure but inconsistency is holding you back.",
      recommendation: "The Reset Protocol will help solidify your foundations.",
    },
    STABILIZING: {
      title: "Stabilizing Progress",
      description: "You're building momentum but need structured support to advance.",
      recommendation: "Consider the Elite Cohort for accelerated growth.",
    },
    ADAPTING: {
      title: "Adapting Well",
      description: "Strong systems in place with room for optimization.",
      recommendation: "The Cohort will help you reach operational excellence.",
    },
    OPERATIONAL: {
      title: "Operational Excellence",
      description: "High-performance systems functioning effectively.",
      recommendation: "Join the Cohort to maintain and scale your performance.",
    },
  };
  return descriptions[tier] || descriptions.FRAGMENTED;
}
