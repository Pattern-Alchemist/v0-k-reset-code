import { NextResponse } from 'next/server';
import { logEvent } from '../../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, userId, data } = body;

    if (!type) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 });
    }

    await logEvent({
      type,
      userId,
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
