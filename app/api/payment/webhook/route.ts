import { NextResponse } from 'next/server';
import { verifySignature } from '../../../../lib/razorpay';
import { logEvent } from '../../../../lib/supabase';
import { sendWhatsAppMessage, getFollowUpMessage } from '../../../../lib/whatsapp';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    
    // Verify webhook signature
    const isValid = verifySignature(
      body,
      signature,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      
      // Log successful payment
      await logEvent({
        type: 'payment_success',
        userId: payment.notes?.userId,
        data: {
          orderId: payment.order_id,
          amount: payment.amount,
          currency: payment.currency,
        },
      });

      // Send WhatsApp follow-up
      const offer = payment.notes?.offer || 'reset';
      const tier = payment.notes?.tier || 'STABILIZING';
      const message = getFollowUpMessage(tier, offer);
      
      if (payment.notes?.phone) {
        await sendWhatsAppMessage(payment.notes.phone, message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
