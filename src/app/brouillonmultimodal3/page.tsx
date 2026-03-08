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
  {
    number: '01',
    id: 'plv',
    title: 'PLV',
    icon: Lightbulb,
    desc: "Conception et fabrication de dispositifs de vente impactants — PLV de comptoir, de sol, présentoirs et structures volumétriques pour capturer l'attention en point de vente.",
    link: '/solutions#plv',
    image: '/image/brouillon-ai/ai-plv.png',
    imageRight: true,
  },
  {
    number: '02',
    id: 'packaging',
    title: 'Packaging',
    icon: Package,
    desc: "Du design à la production série — étuis, coffrets, sleeves et calages qui racontent une histoire, protègent vos produits et renforcent l'identité de votre marque.",
    link: '/solutions#packaging',
    image: '/image/brouillon-ai/ai-packaging.png',
    imageRight: false,
  },
  {
    number: '03',
    id: 'print',
    title: 'Print',
    icon: Printer,
    desc: "Maîtrise de l'impression haut de gamme — offset, numérique, dorure à chaud, vernis sélectif, gaufrage et façonnage pour une qualité qui fait la différence.",
    link: '/solutions#print',
    image: '/image/brouillon-ai/ai-print.png',
    imageRight: true,
  },
  {
    number: '04',
    id: 'studio3d',
    title: 'Devis 3D Studio',
    icon: Play,
    desc: "Visualisez votre projet avant fabrication — configurez les volumes, matériaux et finitions en 3D, puis transmettez directement au bureau d'études pour chiffrage.",
    link: '/simulateur',
    image: '/image/brouillon-ai/ai-studio3d.png',
    imageRight: false,
  },
];

// ── Framer Motion variants (Gemini design) ──────────────────
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9], when: 'beforeChildren', staggerChildren: 0.2 },
  },
};
const numberVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -50 },
  visible: { opacity: 0.06, scale: 1, x: 0, transition: { duration: 1.2, ease: [0.6, 0.05, -0.01, 0.9] } },
};
const textBlockVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, 0.05, -0.01, 0.9] } },
};
const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.6, 0.05, -0.01, 0.9], delay: 0.1 } },
};

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

export default function BrouillonMultimodal3() {
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

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative mt-[5vh] h-[57vh] min-h-[308px] w-full overflow-hidden bg-white">
        {fallbackCarouselItems.map((item, index) => {
          const layoutKey = `b3-slide-layout-${index}`;
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
                      editorKey={`b3-hero-${index}`}
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
                          editorKey={`b3-hero-title-${index}`}
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

      {/* ── NOS SAVOIR-FAIRE — layout éditorial (Gemini design) ── */}
      <section style={{ backgroundColor: '#000B58' }} className="text-white py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Titre section */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.6, 0.05, -0.01, 0.9] }}
            className="mb-20 md:mb-28"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-3">Multipoles — Depuis 1996</p>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Nos savoir-faire
            </h2>
            <div className="mt-4 w-16 h-px bg-white/30" />
          </motion.div>

          {/* Items éditoriaux */}
          <div className="space-y-28 md:space-y-40">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  className={`flex flex-col relative gap-x-16 gap-y-10 items-center ${cat.imageRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={containerVariants}
                >
                  {/* Grand numéro décoratif */}
                  <motion.span
                    variants={numberVariants}
                    className={`absolute select-none pointer-events-none z-0 text-[9rem] md:text-[13rem] lg:text-[17rem] font-black text-white leading-none
                      ${cat.imageRight ? '-top-10 md:-left-6 lg:-left-10' : '-top-10 md:-right-6 lg:-right-10'}`}
                  >
                    {cat.number}
                  </motion.span>

                  {/* Bloc texte */}
                  <div className={`w-full md:w-1/2 relative z-10 ${cat.imageRight ? 'md:pr-10 lg:pr-20' : 'md:pl-10 lg:pl-20'}`}>
                    <motion.div variants={textBlockVariants} className="space-y-5">
                      {/* Icône */}
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/8">
                        <Icon className="w-7 h-7 text-white/80" />
                      </span>
                      {/* Numéro + titre */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">{cat.number}</span>
                        <h3 className="text-4xl lg:text-5xl font-extrabold text-white mt-1 leading-tight tracking-tight">
                          {cat.title}
                        </h3>
                      </div>
                      {/* Description */}
                      <p className="text-base lg:text-lg text-white/60 leading-relaxed max-w-md">
                        {cat.desc}
                      </p>
                      {/* CTA */}
                      <Link
                        href={cat.link}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 group"
                      >
                        <span>Découvrir</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Bloc image */}
                  <div className={`w-full md:w-1/2 relative z-10 ${cat.imageRight ? 'md:pl-6 lg:pl-12' : 'md:pr-6 lg:pr-12'}`}>
                    <motion.div
                      variants={imageVariants}
                      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                      className="relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
                      style={{ aspectRatio: '4/3' }}
                    >
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority={cat.id === 'plv'}
                      />
                      {/* Gradient subtil en bas */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000B58]/40 via-transparent to-transparent" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 3 — Design éditorial Gemini 2.5 — Images Imagen 4</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillonmultimodal" className="hover:text-white">← Brouillon 2</Link>
          <Link href="/brouillon" className="hover:text-white">Brouillon 1</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </footer>

    </div>
  );
}
