// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsight(score: number, tier: string, answers: Record<string, number>) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a performance coach. Provide concise, actionable insights based on assessment results.',
        },
        {
          role: 'user',
          content: `Score: ${score}, Tier: ${tier}. Answers: ${JSON.stringify(answers)}. Provide a 2-3 sentence insight.`,
        },
      ],
      max_tokens: 100,
    });

    return completion.choices[0]?.message?.content || 'Complete your assessment to receive personalized insights.';
  } catch (error) {
    console.error('OpenAI error:', error);
    return 'Based on your assessment, focus on building consistent daily routines to improve mental stability.';
  }
}
