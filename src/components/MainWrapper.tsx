'use client';
import { usePathname } from 'next/navigation';

// Retire le padding-top du header global sur les pages /brouillon*
export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBrouillon = pathname.startsWith('/brouillon');
  return (
    <main className={isBrouillon
      ? 'min-h-screen'
      : 'min-h-screen pt-[5.5rem] md:pt-[6rem] scroll-mt-[5.5rem] md:scroll-mt-[6rem]'
    }>
      {children}
    </main>
  );
}
