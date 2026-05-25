'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicUI() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    const trackPageView = async () => {
      await fetch('/api/events/track', {
        method: 'POST',
        body: JSON.stringify({ type: 'page_view', data: { path: pathname } }),
      });
    };

    trackPageView();
  }, [pathname]);

  return null;
}
