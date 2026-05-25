// lib/events.ts
import { logEvent } from './supabase';

export type EventType = 
  | 'page_view'
  | 'assessment_start'
  | 'assessment_complete'
  | 'offer_view'
  | 'payment_initiated'
  | 'payment_success'
  | 'payment_failed';

export async function trackEvent(
  type: EventType,
  userId?: string,
  data?: any
) {
  await logEvent({
    type,
    userId,
    data,
  });
}

export const AnalyticsEvents = {
  PAGE_VIEW: 'page_view',
  ASSESSMENT_START: 'assessment_start',
  ASSESSMENT_COMPLETE: 'assessment_complete',
  OFFER_VIEW: 'offer_view',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
};
