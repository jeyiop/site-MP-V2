'use client';

// ── BROUILLON 4 — Gemini Design 2 : Glassmorphism 2×2 cards ──
// Concept Gemini: 4 cartes 450px en 2×2. Image pleine en fond + overlay sombre.
// Panel glass (bg-white/10 backdrop-blur-lg) en bas de chaque carte.
// Au hover : panel remonte de 80px (spring) révélant la description longue.

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

const CARDS = [
  { id: 'plv', n: '01', title: 'PLV', icon: Lightbulb, image: '/image/brouillon-ai/ai-plv.png', link: '/solutions#plv', short: 'Création et production de supports publicitaires percutants pour vos points de vente.', long: "De la conception à la livraison, nous réalisons des PLV de comptoir et de sol innovantes qui captent l'attention et dynamisent vos ventes en pharmacie et cosmétique." },
  { id: 'packaging', n: '02', title: 'Packaging', icon: Package, image: '/image/brouillon-ai/ai-packaging.png', link: '/solutions#packaging', short: "Conception d'emballages créatifs et fonctionnels qui subliment vos produits.", long: 'Nous transformons votre emballage en outil marketing — étuis, coffrets, sleeves, calages — en alliant esthétique premium et contraintes logistiques retail.' },
  { id: 'print', n: '03', title: 'Print', icon: Printer, image: '/image/brouillon-ai/ai-print.png', link: '/solutions#print', short: 'Impression haut de gamme pour tous vos supports de communication.', long: 'Offset, numérique, dorure à chaud, vernis sélectif, gaufrage — une maîtrise complète des finitions pour des supports qui font la différence.' },
  { id: 'studio3d', n: '04', title: 'Devis 3D Studio', icon: Play, image: '/image/brouillon-ai/ai-studio3d.png', link: '/simulateur', short: 'Visualisation 3D réaliste et devis précis pour vos projets.', long: "Configurez votre projet en 3D — volumes, matériaux, finitions — et transmettez directement au bureau d'études pour chiffrage immédiat." },
];

const glassPanelVariants = {
  rest: { y: 0, transition: { duration: 0.5, type: 'spring' as const, bounce: 0.3 } },
  hover: { y: -85, transition: { duration: 0.5, type: 'spring' as const, bounce: 0.3 } },
};
const longDescVariants = {
  rest: { opacity: 0, y: 16, transition: { duration: 0.25 } },
  hover: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.3 } },
};

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

export default function BrouillonMultimodal4() {
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
          const layoutKey = `b4-slide-${index}`;
          const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 436;
          return (
            <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="absolute inset-0 flex items-center px-4 md:px-9 py-3.5">
                <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                  <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                    <EditableImage editorKey={`b4-hero-${index}`} src={item.imageUrl} alt={item.title} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
                  </div>
                  {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                  <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`} style={{ width: `${cardWidth}px` }}>
                    <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                      <div className="flex flex-col h-full rounded-2xl border border-[#000B58]/15 bg-white/88 px-5 py-6 shadow-[0_20px_48px_-36px_rgba(0,11,88,0.55)] backdrop-blur-sm md:px-6 md:py-7 text-[#000B58]">
                        <EditableText editorKey={`b4-hero-title-${index}`} defaultValue={item.title} as="h1" className="text-3xl md:text-[2.4rem] md:leading-[1.05] font-bold mb-4 text-[#000B58]" />
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

      {/* ── GLASSMORPHISM 2×2 GRID ───────────────────────────── */}
      <section style={{ backgroundColor: '#000B58' }} className="py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">Nos savoir-faire</p>
            <p className="text-[10px] text-white/15 tracking-widest">Multi-Pôles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative h-[420px] md:h-[440px] overflow-hidden rounded-2xl cursor-pointer shadow-[0_20px_60px_-10px_rgba(0,0,5,0.5)]"
                >
                  <Link href={card.link} className="block w-full h-full">
                    {/* Image fond */}
                    <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 scale-100 hover:scale-105" priority={i < 2} />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10" />

                    {/* Description longue révélée */}
                    <motion.div
                      variants={longDescVariants}
                      className="absolute inset-x-0 top-0 z-20 flex items-center justify-center px-8 pt-10 pb-52 text-center"
                    >
                      <p className="text-base text-white/80 leading-relaxed max-w-sm">{card.long}</p>
                    </motion.div>

                    {/* Panel glass bas */}
                    <motion.div
                      variants={glassPanelVariants}
                      className="absolute inset-x-0 bottom-0 z-30 bg-white/10 backdrop-blur-lg rounded-b-2xl p-6 min-h-[160px] flex flex-col justify-end"
                    >
                      <span className="text-[10px] font-bold text-white/35 uppercase tracking-[0.25em] mb-1">{card.n}</span>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/12 border border-white/20">
                          <Icon className="w-5 h-5 text-white/80" />
                        </span>
                        <h3 className="text-2xl font-extrabold text-white tracking-tight">{card.title}</h3>
                      </div>
                      <p className="text-sm text-white/55 leading-snug">{card.short}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 4 — Gemini Design 2 · Glassmorphism 2×2</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillonmultimodal3" className="hover:text-white">← B3</Link>
          <Link href="/brouillonmultimodal5" className="hover:text-white">B5</Link>
          <Link href="/brouillonmultimodal6" className="hover:text-white">B6</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </footer>
    </div>
  );
}
