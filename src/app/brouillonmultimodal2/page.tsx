'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Package, Printer, Play } from 'lucide-react';
import { useEditorCarousel } from '@/hooks/use-editor-carousel';
import { EditableImage } from '@/components/EditableImage';
import { EditableText } from '@/components/EditableText';
import { useEditor } from '@/components/EditorWrapper';

// ── Même slides que page.tsx ─────────────────────────────────
const fallbackCarouselItems = [
  { id: '1', imageUrl: '/image/selecta/hero/hero-01-collage.jpg', title: 'PLV, ILV & Packaging pour la pharmacie et la cosmétique', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 1, isActive: true, locale: 'fr' as const },
  { id: '2', imageUrl: '/image/selecta/hero/hero-02.jpg', title: "Un partenaire technique à l'écoute et réactif", ctaLink: '/simulateur', ctaText: 'Lancer Devis 3D Studio', order: 2, isActive: true, locale: 'fr' as const },
  { id: '3', imageUrl: '/image/selecta/hero/hero-03.jpg', title: 'Devis 3D Studio pour cadrer rapidement votre besoin', ctaLink: '/realisations', ctaText: 'Voir nos réalisations', order: 3, isActive: true, locale: 'fr' as const },
  { id: '4', imageUrl: '/image/selecta/hero/hero-04.jpg', title: 'PLV et présentoirs orientés performance en point de vente', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 4, isActive: true, locale: 'fr' as const },
  { id: '5', imageUrl: '/image/selecta/hero/hero-05.jpg', title: 'Fabrication série avec contrôle qualité et finitions premium', ctaLink: '/realisations', ctaText: 'Voir nos réalisations', order: 5, isActive: true, locale: 'fr' as const },
  { id: '6', imageUrl: '/image/selecta/hero/hero-06.png', title: 'Activation retail multi-formats', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 6, isActive: true, locale: 'fr' as const },
  { id: '7', imageUrl: '/image/selecta/hero/hero-07.png', title: 'Déploiement opérationnel de vos campagnes', ctaLink: '/contact', ctaText: 'Nous contacter', order: 7, isActive: true, locale: 'fr' as const },
];

// ── 4 catégories avec images générées par Imagen 4 ──────────
const CATEGORIES = [
  {
    id: 'plv',
    title: 'PLV',
    icon: Lightbulb,
    desc: 'PLV de comptoir et de sol — conception structurelle, prototypage et fabrication série.',
    link: '/solutions#plv',
    image: '/image/brouillon-ai/ai-plv.png',
    tags: ['Comptoir', 'Sol', 'Linéaire'],
  },
  {
    id: 'packaging',
    title: 'Packaging',
    icon: Package,
    desc: 'Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées.',
    link: '/solutions#packaging',
    image: '/image/brouillon-ai/ai-packaging.png',
    tags: ['Etuis', 'Coffrets', 'Calages'],
  },
  {
    id: 'print',
    title: 'Print',
    icon: Printer,
    desc: "Impression offset/numérique, dorure, vernis sélectif, gaufrage, découpe et façonnage.",
    link: '/solutions#print',
    image: '/image/brouillon-ai/ai-print.png',
    tags: ['Offset', 'Numérique', 'Finitions'],
  },
  {
    id: 'studio3d',
    title: 'Devis 3D Studio',
    icon: Play,
    desc: "Configuration 3D de votre projet et transmission directe au bureau d'études pour chiffrage.",
    link: '/simulateur',
    image: '/image/brouillon-ai/ai-studio3d.png',
    tags: ['Configuration', '3D', 'Devis'],
  },
];

function SlideDivider({ layoutKey, cardWidth, setHeroLayout }: {
  layoutKey: string; cardWidth: number; setHeroLayout: (k: string, w: number) => void;
}) {
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const [active, setActive] = useState(false);
  return (
    <div
      style={{ width: '14px', flexShrink: 0, alignSelf: 'stretch', cursor: 'ew-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 35, userSelect: 'none' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { startX: e.clientX, startW: cardWidth }; setActive(true); }}
      onPointerMove={(e) => { if (!dragRef.current) return; const delta = -(e.clientX - dragRef.current.startX); setHeroLayout(layoutKey, Math.max(234, Math.min(576, dragRef.current.startW + delta))); }}
      onPointerUp={() => { dragRef.current = null; setActive(false); }}
      onPointerLeave={() => { dragRef.current = null; setActive(false); }}
    >
      <div style={{ width: '4px', height: '52px', borderRadius: '4px', backgroundColor: active ? '#000B58' : 'rgba(0,11,88,0.3)', transition: 'all 0.15s' }} />
    </div>
  );
}

export default function BrouillonMultimodal2() {
  const [isScrolled, setIsScrolled] = useState(false);

  const { currentSlide, nextSlide, prevSlide, goToSlide, editorMode } = useEditorCarousel({
    totalSlides: fallbackCarouselItems.length,
    intervalMs: 5000,
  });
  const { heroLayouts, setHeroLayout } = useEditor();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── HERO (identique brouillon) ─────────────────────── */}
      <section className="relative mt-[5vh] h-[57vh] min-h-[308px] w-full overflow-hidden bg-white">
        {fallbackCarouselItems.map((item, index) => {
          const layoutKey = `bm-slide-layout-${index}`;
          const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 436;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 flex items-center px-4 md:px-9 py-3.5">
                <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                  <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                    <EditableImage
                      editorKey={`bm-hero-${index}`}
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover"
                    />
                  </div>
                  {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                  <div
                    className={`hidden md:flex flex-col shrink-0 transform transition-all duration-300 ease-out ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                    style={{ width: `${cardWidth}px` }}
                  >
                    <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                      <div className="flex flex-col h-full rounded-2xl border border-[#000B58]/15 bg-white/88 px-5 py-6 shadow-[0_20px_48px_-36px_rgba(0,11,88,0.55)] backdrop-blur-sm md:px-6 md:py-7 text-[#000B58]">
                        <EditableText
                          editorKey={`bm-hero-title-${index}`}
                          defaultValue={item.title}
                          as="h1"
                          className="text-3xl md:text-[2.4rem] md:leading-[1.05] font-bold mb-4 text-[#000B58]"
                        />
                        <div className="mt-auto">
                          <Link href={item.ctaLink} className="inline-flex rounded-lg border border-[#000B58] px-5 py-2.5 font-semibold text-sm text-[#000B58] hover:bg-[#000B58]/5 transition-colors">
                            {item.ctaText}
                          </Link>
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
          <button onClick={prevSlide} className="rounded-lg bg-white p-2 text-[#000B58] shadow-lg shadow-[#000B58]/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextSlide} className="rounded-lg bg-white p-2 text-[#000B58] shadow-lg shadow-[#000B58]/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="h-4 w-px bg-[#000B58]/20 mx-1" />
          {fallbackCarouselItems.map((_, index) => (
            <motion.button key={index} onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-[4px] ${index === currentSlide ? 'bg-[#000B58]' : 'bg-[#000B58]/25'}`}
              animate={{ scale: index === currentSlide ? 1.6 : 1 }}
              whileHover={{ scale: 1.25 }}
              layout transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            />
          ))}
        </div>
      </section>

      {/* ── NOS SAVOIR-FAIRE ─────────────────────────────────── */}
      <section style={{ backgroundColor: '#000B58' }} className="pt-3">

        {/* ── Titres catégories au-dessus des rectangles ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={`group relative flex flex-col items-center gap-3 py-5 px-6 text-center cursor-pointer
                  border-b-2 border-amber-400/40 hover:border-amber-400
                  transition-all duration-300 hover:-translate-y-0.5
                  ${i < 3 ? 'border-r border-white/10' : ''}`}
              >
                {/* Picto grand + mis en valeur */}
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 border border-amber-400/30 group-hover:border-amber-400/70 group-hover:bg-amber-400/10 transition-all duration-300 mb-1">
                  <Icon className="w-7 h-7 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
                </span>
                {/* Titre */}
                <span className="text-xs font-extrabold text-white/90 uppercase tracking-[0.22em] group-hover:text-white transition-colors">{cat.title}</span>
                {/* Triangle connexion vers image */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-amber-400/50 group-hover:border-t-amber-400 transition-colors duration-300" />
              </div>
            );
          })}
        </div>

        {/* ── 4 rectangles image plein cadre ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-3 pb-4 pt-2">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                className="group relative overflow-hidden cursor-pointer rounded-xl"
                style={{ aspectRatio: '3/4' }}
              >
                <Link href={cat.link} className="block w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={i < 2}
                  />
                  {/* Gradient navy en bas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000B58]/80 via-[#000B58]/20 to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#000B58]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Description au hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm text-white/85 leading-snug">{cat.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {cat.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-white/70 border border-white/25 rounded-full px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Séparateur vertical */}
                  {i < 3 && <div className="absolute top-0 right-0 bottom-0 w-px bg-white/10" />}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-white/20 py-2 tracking-widest uppercase">Images · Imagen 4 — Google AI</p>
      </section>

      {/* ── FOOTER BROUILLON ─────────────────────────────────── */}
      <footer className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon Multimodal — images générées par Imagen 4 (Google AI)</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillon" className="hover:text-white">← Brouillon 1</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </footer>

    </div>
  );
}
