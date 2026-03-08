'use client';

// ── BROUILLON 5 — Claude Design 1 : Strips horizontaux architecturaux ──
// Concept : 4 bandes pleine largeur empilées.
// Gauche (38%) : numéro géant + icône + titre + desc sur fond navy.
// Droite (62%) : image pleine hauteur.
// Hover : image se dilate légèrement + ligne lumineuse apparaît.

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Package, Printer, Play } from 'lucide-react';
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

const STRIPS = [
  { n: '01', id: 'plv', title: 'PLV', icon: Lightbulb, desc: 'PLV de comptoir et de sol — conception structurelle, prototypage et fabrication série pour la pharmacie et la cosmétique.', link: '/solutions#plv', image: '/image/brouillon-ai/ai-plv.png' },
  { n: '02', id: 'packaging', title: 'Packaging', icon: Package, desc: 'Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées dès la conception.', link: '/solutions#packaging', image: '/image/brouillon-ai/ai-packaging.png' },
  { n: '03', id: 'print', title: 'Print', icon: Printer, desc: "Offset, numérique, dorure à chaud, vernis sélectif, gaufrage — une maîtrise complète des finitions premium.", link: '/solutions#print', image: '/image/brouillon-ai/ai-print.png' },
  { n: '04', id: 'studio3d', title: 'Devis 3D Studio', icon: Play, desc: "Configuration 3D de votre projet et transmission directe au bureau d'études pour chiffrage immédiat.", link: '/simulateur', image: '/image/brouillon-ai/ai-studio3d.png' },
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
      <div style={{ width: '4px', height: '52px', borderRadius: '4px', backgroundColor: active ? '#000B58' : 'rgba(0,11,88,0.3)', transition: 'all 0.15s' }} />
    </div>
  );
}

export default function BrouillonMultimodal5() {
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
      {/* HERO */}
      <section className="relative mt-[5vh] h-[57vh] min-h-[308px] w-full overflow-hidden bg-white">
        {fallbackCarouselItems.map((item, index) => {
          const layoutKey = `b5-slide-${index}`;
          const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 436;
          return (
            <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="absolute inset-0 flex items-center px-4 md:px-9 py-3.5">
                <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                  <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                    <EditableImage editorKey={`b5-hero-${index}`} src={item.imageUrl} alt={item.title} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
                  </div>
                  {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                  <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`} style={{ width: `${cardWidth}px` }}>
                    <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                      <div className="flex flex-col h-full rounded-2xl border border-[#000B58]/15 bg-white/88 px-5 py-6 shadow-[0_20px_48px_-36px_rgba(0,11,88,0.55)] backdrop-blur-sm md:px-6 md:py-7 text-[#000B58]">
                        <EditableText editorKey={`b5-hero-title-${index}`} defaultValue={item.title} as="h1" className="text-3xl md:text-[2.4rem] md:leading-[1.05] font-bold mb-4 text-[#000B58]" />
                        <div className="mt-auto">
                          <Link href={item.ctaLink} className="inline-flex rounded-lg border border-[#000B58] px-5 py-2.5 font-semibold text-sm text-[#000B58] hover:bg-[#000B58]/5 transition-colors">{item.ctaText}</Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className={`absolute bottom-6 left-4 md:left-10 z-30 flex items-center gap-3 transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button onClick={prevSlide} className="rounded-lg bg-white p-2 shadow-lg shadow-[#000B58]/20"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
          <button onClick={nextSlide} className="rounded-lg bg-white p-2 shadow-lg shadow-[#000B58]/20"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
          <span className="h-4 w-px bg-[#000B58]/20 mx-1" />
          {fallbackCarouselItems.map((_, index) => (
            <motion.button key={index} onClick={() => goToSlide(index)} className={`h-3 w-3 rounded-[4px] ${index === currentSlide ? 'bg-[#000B58]' : 'bg-[#000B58]/25'}`} animate={{ scale: index === currentSlide ? 1.6 : 1 }} whileHover={{ scale: 1.25 }} layout transition={{ type: 'spring', stiffness: 400, damping: 28 }} />
          ))}
        </div>
      </section>

      {/* ── STRIPS HORIZONTAUX ────────────────────────────────── */}
      <section style={{ backgroundColor: '#000B58' }}>
        {/* Label section */}
        <div className="px-8 md:px-14 pt-8 pb-4 border-b border-white/8">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30">Nos savoir-faire — Multi-Pôles</p>
        </div>

        {STRIPS.map((strip, i) => {
          const Icon = strip.icon;
          return (
            <motion.div
              key={strip.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative flex border-b border-white/8 overflow-hidden cursor-pointer"
              style={{ minHeight: '180px' }}
            >
              <Link href={strip.link} className="flex w-full">
                {/* Colonne gauche — texte */}
                <div className="relative z-10 flex items-center gap-6 px-8 md:px-14 py-8 w-[42%] md:w-[38%] shrink-0">
                  {/* Numéro fantôme */}
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[7rem] font-black text-white/4 select-none leading-none pointer-events-none">{strip.n}</span>
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/6 group-hover:bg-white/12 group-hover:border-white/25 transition-all duration-300">
                        <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" />
                      </span>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-none tracking-tight">{strip.title}</h3>
                    </div>
                    <p className="text-sm text-white/45 leading-relaxed max-w-xs group-hover:text-white/65 transition-colors duration-300 hidden md:block">{strip.desc}</p>
                    <span className="text-xs font-semibold text-white/30 group-hover:text-white/60 transition-colors flex items-center gap-1.5">
                      Voir plus <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
                    </span>
                  </div>
                </div>

                {/* Ligne séparatrice lumineuse */}
                <div className="absolute left-[38%] md:left-[38%] top-0 bottom-0 w-px bg-white/8 group-hover:bg-white/20 transition-colors duration-300 z-20" />

                {/* Colonne droite — image */}
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src={strip.image}
                    alt={strip.title}
                    fill
                    sizes="62vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={i < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#000B58] via-[#000B58]/20 to-transparent" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <footer className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 5 — Claude Design 1 · Strips architecturaux</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillonmultimodal3" className="hover:text-white">← B3</Link>
          <Link href="/brouillonmultimodal" className="hover:text-white">B2</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </footer>
    </div>
  );
}
