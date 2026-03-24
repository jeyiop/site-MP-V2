'use client';

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header'), { ssr: false });

export function ClientHeader() {
  return <Header />;
}
// force rebuild 1774367248
// force rebuild 1774377085
// rebuild 1774377387
