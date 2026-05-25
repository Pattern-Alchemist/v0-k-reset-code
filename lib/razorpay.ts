// lib/razorpay.ts
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(amount: number, currency: string = 'INR') {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      payment_capture: 1,
    });
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
}

export function verifySignature(orderId: string, signature: string, secret: string) {
  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(orderId)
    .digest('hex');
  return generatedSignature === signature;
}
