'use client';

// ── BROUILLON 4 ─────────────────────────────────────────────
// = Brouillon 3 MAIS avec header bleu marine (#000B58)
// Logo : logo-blanc-transparent.png (blanc sur bleu)
// Textes nav en blanc/gris clair

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Package, Printer, Play, ArrowUpRight, Menu, X } from 'lucide-react';
import { useEditorCarousel } from '@/hooks/use-editor-carousel';
import { EditableImage } from '@/components/EditableImage';
import { EditableText } from '@/components/EditableText';
import { useEditor } from '@/components/EditorWrapper';

const fallbackCarouselItems = [
  { id: '1', imageUrl: '/image/selecta/hero/hero-01-collage.jpg', title: 'PLV, ILV & Packaging pour la pharmacie et la cosmétique', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 1, isActive: true, locale: 'fr' as const },
  { id: '2', imageUrl: '/image/selecta/hero/hero-02.jpg', title: "Un partenaire technique à l'écoute et réactif", ctaLink: '/simulateur', ctaText: 'Lancer Devis 3D Studio', order: 2, isActive: true, locale: 'fr' as const },
  { id: '3', imageUrl: '/image/selecta/hero/hero-03.jpg', title: 'Devis 3D Studio pour cadrer rapidement votre besoin', ctaLink: '/realisations', ctaText: 'Voir nos réalisations', order: 3, isActive: true, locale: 'fr' as const },
  { id: '4', imageUrl: '/image/selecta/hero/hero-04.jpg', title: 'PLV et présentoirs orientés performance en point de vente', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 4, isActive: true, locale: 'fr' as const },
  { id: '5', imageUrl: '/image/selecta/hero/hero-05.jpg', title: 'Fabrication série avec contrôle qualité et finitions premium', ctaLink: '/realisations', ctaText: 'Voir nos réalisations', order: 5, isActive: true, locale: 'fr' as const },
  { id: '6', imageUrl: '/image/selecta/hero/hero-06.png', title: 'Activation retail multi-formats', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 6, isActive: true, locale: 'fr' as const },
  { id: '7', imageUrl: '/image/selecta/hero/hero-07.png', title: 'Déploiement opérationnel de vos campagnes', ctaLink: '/contact', ctaText: 'Nous contacter', order: 7, isActive: true, locale: 'fr' as const },
];

const CATEGORIES = [
  { n: '01', id: 'plv', title: 'PLV', icon: Lightbulb, link: '/solutions#plv', image: '/image/brouillon-ai/ai-plv.png', desc: 'PLV de comptoir et de sol — conception structurelle, prototypage et fabrication série.', tags: ['Comptoir', 'Sol', 'Linéaire'] },
  { n: '02', id: 'packaging', title: 'Packaging', icon: Package, link: '/solutions#packaging', image: '/image/brouillon-ai/ai-packaging.png', desc: "Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées.", tags: ['Etuis', 'Coffrets', 'Calages'] },
  { n: '03', id: 'print', title: 'Print', icon: Printer, link: '/solutions#print', image: '/image/brouillon-ai/ai-print.png', desc: "Offset, numérique, dorure à chaud, vernis sélectif, gaufrage et façonnage.", tags: ['Offset', 'Numérique', 'Finitions'] },
  { n: '04', id: 'studio3d', title: 'Devis 3D Studio', icon: Play, link: '/simulateur', image: '/image/brouillon-ai/ai-studio3d.png', desc: "Configuration 3D et transmission directe au bureau d'études pour chiffrage.", tags: ['Config', '3D', 'Devis'] },
];

const NAV_LINKS = [
  { href: '/solutions', label: 'Solutions' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/apropos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/simulateur', label: 'Devis 3D' },
];

function SlideDivider({ layoutKey, cardWidth, setHeroLayout }: { layoutKey: string; cardWidth: number; setHeroLayout: (k: string, w: number) => void }) {
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const [active, setActive] = useState(false);
  return (
    <div style={{ width: '14px', flexShrink: 0, alignSelf: 'stretch', cursor: 'ew-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 35, userSelect: 'none' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { startX: e.clientX, startW: cardWidth }; setActive(true); }}
      onPointerMove={(e) => { if (!dragRef.current) return; const delta = -(e.clientX - dragRef.current.startX); setHeroLayout(layoutKey, Math.max(234, Math.min(576, dragRef.current.startW + delta))); }}
      onPointerUp={() => { dragRef.current = null; setActive(false); }}
      onPointerLeave={() => { dragRef.current = null; setActive(false); }}>
      <div style={{ width: '4px', height: '52px', borderRadius: '4px', backgroundColor: active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', transition: 'all 0.15s' }} />
    </div>
  );
}

export default function Brouillon4() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentSlide, nextSlide, prevSlide, goToSlide, editorMode } = useEditorCarousel({ totalSlides: fallbackCarouselItems.length, intervalMs: 5000 });
  const { heroLayouts, setHeroLayout } = useEditor();

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── HEADER BLEU ─────────────────────────────────────── */}
      <header style={{ backgroundColor: '#021035' }} className={`fixed top-0 left-0 w-full z-[99999] transition-shadow duration-300 ${isScrolled ? 'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]' : ''}`}>
        <div className="flex items-stretch h-[5.5rem] md:h-[6rem] gap-4 md:gap-6">

          {/* Logo — pleine hauteur bord à bord */}
          <div className="relative self-center h-[83px] md:h-[91px] w-[202px] md:w-[260px] shrink-0" style={{ backgroundColor: '#021035' }}>
            {!editorMode && <Link href="/" className="absolute inset-0 z-20" aria-label="Accueil" />}
            <EditableImage editorKey="b4-logo" src="/image/selecta/logo/logo fon bleu.jpg" alt="Multi-Pôles" fill className="object-cover object-center" priority />
          </div>

          {/* Slogan */}
          <div className="hidden md:flex flex-col justify-center shrink-0 mr-1 pl-2">
            <EditableText editorKey="b4-slogan-1" defaultValue="IMPRIMEUR" as="span" className="text-base font-black tracking-[0.18em] text-white leading-none" />
            <EditableText editorKey="b4-slogan-2" defaultValue="CARTONNIER VOLUMISTE" as="span" className="text-[11px] font-bold tracking-[0.08em] text-white leading-none mt-1" />
            <EditableText editorKey="b4-slogan-3" defaultValue="depuis 1995" as="span" className="text-[10px] font-bold tracking-[0.28em] text-white/70 mt-1.5" />
          </div>

          <span className="hidden md:block h-8 w-px bg-white/15 shrink-0 self-center" />

          {/* Nav centre + Téléphone */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6">
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
            <a
              href="tel:+33143911771"
              className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-white hover:border-white/50 hover:bg-white/10 transition-colors no-underline shrink-0 h-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
              </svg>
              <span className="text-base font-bold tracking-wide">01 43 91 17 71</span>
            </a>
          </div>

          {/* Mobile burger */}
          <div className="ml-auto flex items-center pr-4 md:pr-10">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ backgroundColor: '#021035', borderTop: '1px solid rgba(255,255,255,0.1)' }}
              className="overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO cadré ───────────────────────────────────────── */}
      <div className="mt-[5.5rem] md:mt-[6rem] pt-4 px-4 md:px-8">
        <section
          className="relative h-[48vh] min-h-[280px] w-full overflow-hidden rounded-2xl"
          style={{ boxShadow: '0 8px 40px -8px rgba(0,11,88,0.18)', outline: '1px solid rgba(0,11,88,0.08)' }}
        >
          {fallbackCarouselItems.map((item, index) => {
            const layoutKey = `b4h-slide-${index}`;
            const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 420;
            return (
              <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="absolute inset-0 flex items-center px-4 md:px-7 py-3">
                  <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                    <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                      <EditableImage editorKey={`b4h-hero-${index}`} src={item.imageUrl} alt={item.title} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
                    </div>
                    {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                    <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`} style={{ width: `${cardWidth}px` }}>
                      <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div className="flex flex-col h-full rounded-xl border border-[#000B58]/12 bg-white/92 px-5 py-5 shadow-[0_12px_32px_-20px_rgba(0,11,88,0.45)] backdrop-blur-sm text-[#000B58]">
                          <EditableText editorKey={`b4h-hero-title-${index}`} defaultValue={item.title} as="h1" className="text-2xl md:text-[2.1rem] md:leading-[1.08] font-bold mb-4 text-[#000B58]" />
                          <div className="mt-auto">
                            <Link href={item.ctaLink} className="inline-flex rounded-lg border border-[#000B58] px-4 py-2 font-semibold text-sm text-[#000B58] hover:bg-[#000B58]/5 transition-colors">{item.ctaText}</Link>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className={`absolute bottom-4 left-4 md:left-8 z-30 flex items-center gap-2.5 transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <button onClick={prevSlide} className="rounded-lg bg-white/90 p-1.5 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={nextSlide} className="rounded-lg bg-white/90 p-1.5 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            <span className="h-3.5 w-px bg-[#000B58]/20 mx-0.5" />
            {fallbackCarouselItems.map((_, index) => (
              <motion.button key={index} onClick={() => goToSlide(index)} className={`h-2.5 w-2.5 rounded-[3px] ${index === currentSlide ? 'bg-[#000B58]' : 'bg-[#000B58]/25'}`} animate={{ scale: index === currentSlide ? 1.5 : 1 }} whileHover={{ scale: 1.2 }} layout transition={{ type: 'spring', stiffness: 400, damping: 28 }} />
            ))}
          </div>
        </section>
      </div>

      {/* ── NOS SAVOIR-FAIRE — fond blanc, titres visibles ──── */}
      <section className="bg-white px-4 md:px-8 pt-5 pb-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <EditableText editorKey="b4-section-label" defaultValue="Multi-Pôles" as="p" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#000B58]/35 mb-1" />
            <EditableText editorKey="b4-section-title" defaultValue="Nos savoir-faire" as="h2" className="text-2xl md:text-3xl font-extrabold text-[#000B58] tracking-tight" />
          </div>
          <Link href="/solutions" className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#000B58]/50 hover:text-[#000B58] transition-colors">
            Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                style={{ aspectRatio: '3/4', boxShadow: '0 4px 24px -6px rgba(0,11,88,0.15)' }}
              >
                {!editorMode && <Link href={cat.link} className="absolute inset-0 z-20" aria-label={cat.title} />}
                <EditableImage editorKey={`b4-cat-img-${cat.id}`} src={cat.image} alt={cat.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority={i < 2} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#000B58]/65 via-transparent to-[#000B58]/70" />

                {/* Titre haut — toujours visible */}
                <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-3 z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-white" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-white/45 uppercase tracking-[0.2em] leading-none">{cat.n}</p>
                      <EditableText editorKey={`b4-cat-title-${cat.id}`} defaultValue={cat.title} as="h3" className="text-sm font-extrabold text-white uppercase tracking-[0.12em] leading-tight mt-0.5" />
                    </div>
                  </div>
                </div>

                {/* Contenu bas */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 z-10">
                  <EditableText editorKey={`b4-cat-desc-${cat.id}`} defaultValue={cat.desc} as="p" className="text-xs text-white/75 leading-relaxed mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  <div className="flex flex-wrap gap-1">
                    {cat.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-white/65 border border-white/20 rounded-full px-2 py-0.5 backdrop-blur-sm">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    <span className="text-xs font-semibold text-white/80">Découvrir</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 4 — Header bleu · Logo blanc · Hero cadré</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillon3" className="hover:text-white">← B3</Link>
          <Link href="/brouillon2" className="hover:text-white">B2</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </div>
    </div>
  );
}
