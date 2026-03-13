'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EditableImage } from '@/components/EditableImage';
import { useEditor } from '@/components/EditorWrapper';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { editorMode } = useEditor();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Brouillons using the global header keep it always visible (no hide-on-scroll)
  const alwaysVisible = pathname.startsWith('/brouillon');

  const lastScrollY = useRef(0);
  const scrollRevealTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 10);

      if (alwaysVisible) {
        lastScrollY.current = currentY;
        return;
      }

      const isNearTop = currentY < 80;
      const isScrollingDown = currentY > lastScrollY.current + 2;

      if (scrollRevealTimeout.current) {
        clearTimeout(scrollRevealTimeout.current);
      }

      if (isMobileMenuOpen) {
        setIsHidden(false);
        lastScrollY.current = currentY;
        return;
      }

      if (isScrollingDown && !isNearTop) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      scrollRevealTimeout.current = setTimeout(() => {
        if (!isMobileMenuOpen) {
          setIsHidden(false);
        }
      }, 240);

      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true } as EventListenerOptions);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRevealTimeout.current) {
        clearTimeout(scrollRevealTimeout.current);
      }
    };
  }, [isMobileMenuOpen, alwaysVisible]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsHidden(false);
      if (scrollRevealTimeout.current) {
        clearTimeout(scrollRevealTimeout.current);
      }
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      setIsHidden(false);
    }
  };

  return (
    <header
      className={`fixed w-full z-[9999] top-0 left-0 transform transition-transform duration-500 ease-out ${isHidden ? '-translate-y-full pointer-events-none' : 'translate-y-0'
        }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        className={`w-full border-b border-[#000B58]/10 bg-white px-4 md:px-10 transition-all duration-300 ${isScrolled ? 'shadow-md backdrop-blur-md' : 'shadow-sm'
          }`}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.15,
                staggerChildren: 0.07,
              },
            },
          }}
          className="flex w-full items-center h-[5.5rem] md:h-[6rem] gap-4 md:gap-6"
        >
          {/* ── Logo ── */}
          <motion.div variants={{ hidden: { y: -12, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="flex items-center shrink-0">
            <div className="relative flex h-[5.5rem] w-40 md:h-24 md:w-52 items-center justify-center">
              {!editorMode && <Link href="/" className="absolute inset-0 z-20" aria-label="Accueil" />}
              <EditableImage
                editorKey="header-logo"
                src="/image/selecta/logo/logo-final.png"
                alt="Multi-Pôles"
                fill
                compact
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* ── Slogan Pyramide ── */}
          <motion.div
            variants={{ hidden: { y: -12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="hidden md:flex flex-col items-center justify-center shrink-0 ml-3 mr-1"
          >
            <span className="text-lg font-black tracking-[0.18em] text-[#000B58] leading-none">IMPRIMEUR</span>
            <span className="text-xs font-semibold tracking-[0.08em] text-[#000B58]/65 leading-none mt-1">CARTONNIER VOLUMISTE</span>
            <span className="text-[11px] font-bold tracking-[0.32em] mt-1.5" style={{background: 'linear-gradient(135deg, #6B7A8D 0%, #8C96A4 35%, #4A5568 70%, #7B8794 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '0.32em'}}>depuis 1995</span>
          </motion.div>

          <span className="hidden md:block h-8 w-px bg-[#000B58]/15 shrink-0" aria-hidden="true" />

          {/* ── Nav centre + Téléphone ── */}
          <motion.div
            variants={{ hidden: { y: -12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="hidden md:flex flex-1 items-center justify-center gap-6 pointer-events-auto"
          >
            <NavigationMenuDemo />
            <a
              href="tel:+33143911771"
              className="flex items-center gap-2 rounded-full border border-[#000B58]/20 px-4 py-2 text-[#000B58] hover:border-[#000B58]/40 transition-colors no-underline shrink-0 h-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              <span className="text-base font-bold tracking-wide">01 43 91 17 71</span>
            </a>
          </motion.div>

          {/* ── CTA Simulateur ── */}
          <motion.div
            variants={{ hidden: { y: -12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="hidden md:flex items-center shrink-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="outline" className="border-[#000B58] text-[#000B58] hover:bg-[#000B58]/10 hover:text-[#000B58] bg-transparent">
                <Link href="/simulateur">Simulateur</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.button
            variants={{ hidden: { y: -12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
            className="md:hidden text-[#000B58] focus:outline-none ml-auto"
            onClick={toggleMobileMenu}
            aria-label="Ouvrir le menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="relative">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <Link href="/" className="text-[#000B58] hover:text-[#000B58]/70 transition-colors font-medium">
                Accueil
              </Link>
              <Link href="/solutions" className="text-[#000B58] hover:text-[#000B58]/70 transition-colors font-medium">
                Solutions
              </Link>
              <Link href="/realisations" className="text-[#000B58] hover:text-[#000B58]/70 transition-colors font-medium">
                Réalisations
              </Link>
              <Link href="/apropos" className="text-[#000B58] hover:text-[#000B58]/70 transition-colors font-medium">
                À propos
              </Link>
              <Link href="/blog" className="text-[#000B58] hover:text-[#000B58]/70 transition-colors font-medium">
                Blog
              </Link>
              <Link href="/contact" className="text-[#000B58] hover:text-[#000B58]/70 transition-colors font-medium">
                Contact
              </Link>
              <Link
                href="/simulateur"
                className="border border-[#000B58] text-[#000B58] font-semibold px-5 py-2 rounded-md hover:bg-[#000B58]/10 transition-colors text-center"
              >
                Simulateur
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
  ;

export default Header;

function NavigationMenuDemo() {
  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Réalisations', href: '/realisations' },
    { label: 'À propos', href: '/apropos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ] as const;

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap gap-2">
        {navLinks.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} !bg-transparent`}>
              <Link href={item.href}>{item.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
