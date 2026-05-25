import { NextResponse } from 'next/server';
import { analyzeAssessment } from '../../../lib/brain';
import { calculateScore, getTier } from '../../../lib/scoring';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    const score = calculateScore(answers);
    const tier = getTier(score);
    const analysis = await analyzeAssessment(answers, score, tier);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Brain analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze assessment' }, { status: 500 });
  }
}
