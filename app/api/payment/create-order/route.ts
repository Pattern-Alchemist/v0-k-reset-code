import { NextResponse } from 'next/server';
import { createOrder } from '../../../../lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, offer } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const order = await createOrder(amount);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
