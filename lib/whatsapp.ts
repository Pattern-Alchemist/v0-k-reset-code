// lib/whatsapp.ts
export async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    const response = await fetch(process.env.WHATSAPP_API_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        message,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return null;
  }
}

export function getFollowUpMessage(tier: string, purchasedOffer?: string) {
  if (purchasedOffer === 'reset') {
    return "Welcome to the 7-Day Reset Protocol! Your journey to mental clarity starts now. Check your email for access details.";
  }
  if (purchasedOffer === 'cohort') {
    return "Congratulations on joining the Elite Cohort! Get ready for transformative growth. Access details sent to your email.";
  }
  
  const messages: Record<string, string> = {
    FRAGMENTED: "Your assessment shows significant room for improvement. The 7-Day Reset Protocol can help you build a strong foundation.",
    UNSTABLE: "You're showing potential but need more consistency. Consider our Reset Protocol to stabilize your systems.",
    STABILIZING: "Good progress! The Elite Cohort can accelerate your growth with structured support.",
    ADAPTING: "Strong performance! Join the Cohort to reach operational excellence.",
    OPERATIONAL: "Excellent! Share your success and consider mentoring others in the Cohort.",
  };
  
  return messages[tier] || "Thanks for completing the assessment. Let us know how we can support your journey.";
}
