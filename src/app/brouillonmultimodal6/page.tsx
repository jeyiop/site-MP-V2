'use client';

// ── BROUILLON 6 — Claude Design 2 : Bento Grid asymétrique premium ──
// Concept : grille asymétrique style magazine/bento.
// PLV : grande carte portrait gauche (span 2 rows)
// Packaging + Print : 2 cartes côte à côte à droite
// Studio 3D : bande large en bas
// Chaque carte : image full, overlay glass au hover avec contenu.

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Package, Printer, Play, ArrowUpRight } from 'lucide-react';
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

type BentoCardProps = {
  n: string; title: string; desc: string; image: string; link: string;
  icon: React.ElementType; delay?: number; className?: string;
};

function BentoCard({ n, title, desc, image, link, icon: Icon, delay = 0, className = '' }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
    >
      <Link href={link} className="block w-full h-full">
        {/* Image de fond */}
        <Image src={image} alt={title} fill sizes="50vw" className="object-cover transition-transform duration-700 group-hover:scale-108" />

        {/* Overlay permanent bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000528]/90 via-[#000B58]/30 to-transparent" />

        {/* Contenu permanent */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">{n}</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mt-0.5">{title}</h3>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 group-hover:bg-white group-hover:border-white transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[#000B58] transition-colors duration-300" />
            </span>
          </div>
        </div>

        {/* Overlay hover — glassmorphism panel */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-5 md:px-6 pt-14
          opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0
          transition-all duration-400 ease-out
          bg-[#000B58]/80 backdrop-blur-sm"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 mb-4">
            <Icon className="w-6 h-6 text-white" />
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">{title}</h3>
          <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BrouillonMultimodal6() {
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
          const layoutKey = `b6-slide-${index}`;
          const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 436;
          return (
            <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="absolute inset-0 flex items-center px-4 md:px-9 py-3.5">
                <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                  <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                    <EditableImage editorKey={`b6-hero-${index}`} src={item.imageUrl} alt={item.title} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
                  </div>
                  {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                  <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`} style={{ width: `${cardWidth}px` }}>
                    <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                      <div className="flex flex-col h-full rounded-2xl border border-[#000B58]/15 bg-white/88 px-5 py-6 shadow-[0_20px_48px_-36px_rgba(0,11,88,0.55)] backdrop-blur-sm md:px-6 md:py-7 text-[#000B58]">
                        <EditableText editorKey={`b6-hero-title-${index}`} defaultValue={item.title} as="h1" className="text-3xl md:text-[2.4rem] md:leading-[1.05] font-bold mb-4 text-[#000B58]" />
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

      {/* ── BENTO GRID ────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#000B58' }} className="px-4 md:px-6 py-6 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Label */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">Nos savoir-faire</p>
            <p className="text-[10px] text-white/20 tracking-widest">Multi-Pôles · depuis 1996</p>
          </div>

          {/* Grille bento */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 auto-rows-[280px] md:auto-rows-[220px]">
            {/* PLV — grande carte portrait, col 1–5, rows 1–2 */}
            <BentoCard
              n="01" title="PLV" icon={Lightbulb} link="/solutions#plv"
              image="/image/brouillon-ai/ai-plv.png"
              desc="PLV de comptoir et de sol — conception structurelle, prototypage et fabrication série pour les marques exigeantes."
              delay={0}
              className="col-span-2 md:col-span-5 md:row-span-2"
            />
            {/* Packaging — col 6–9, row 1 */}
            <BentoCard
              n="02" title="Packaging" icon={Package} link="/solutions#packaging"
              image="/image/brouillon-ai/ai-packaging.png"
              desc="Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées."
              delay={0.1}
              className="col-span-1 md:col-span-4"
            />
            {/* Print — col 10–12, row 1 */}
            <BentoCard
              n="03" title="Print" icon={Printer} link="/solutions#print"
              image="/image/brouillon-ai/ai-print.png"
              desc="Offset, numérique, dorures et finitions premium pour tous vos supports."
              delay={0.15}
              className="col-span-1 md:col-span-3"
            />
            {/* Studio 3D — col 6–12, row 2 — large bannière */}
            <BentoCard
              n="04" title="Devis 3D Studio" icon={Play} link="/simulateur"
              image="/image/brouillon-ai/ai-studio3d.png"
              desc="Configuration 3D de votre projet et transmission directe au bureau d'études pour chiffrage immédiat."
              delay={0.2}
              className="col-span-2 md:col-span-7"
            />
          </div>
        </div>
      </section>

      <footer className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 6 — Claude Design 2 · Bento Grid asymétrique</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillonmultimodal5" className="hover:text-white">← B5</Link>
          <Link href="/brouillonmultimodal3" className="hover:text-white">B3</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </footer>
    </div>
  );
}
