'use client';

// ── BROUILLON 3 ─────────────────────────────────────────────
// Hero : cadré / réduit / espace pour les cartes dessous
// Section catégories : fond blanc, 4 cartes image avec titre
// TOUJOURS VISIBLE en haut de chaque image (pas juste au hover)

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

const CATEGORIES = [
  { n: '01', id: 'plv', title: 'PLV', icon: Lightbulb, link: '/solutions#plv', image: '/image/brouillon-ai/ai-plv.png', desc: 'PLV de comptoir et de sol — conception structurelle, prototypage et fabrication série.', tags: ['Comptoir', 'Sol', 'Linéaire'] },
  { n: '02', id: 'packaging', title: 'Packaging', icon: Package, link: '/solutions#packaging', image: '/image/brouillon-ai/ai-packaging.png', desc: "Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées.", tags: ['Etuis', 'Coffrets', 'Calages'] },
  { n: '03', id: 'print', title: 'Print', icon: Printer, link: '/solutions#print', image: '/image/brouillon-ai/ai-print.png', desc: "Offset, numérique, dorure à chaud, vernis sélectif, gaufrage et façonnage.", tags: ['Offset', 'Numérique', 'Finitions'] },
  { n: '04', id: 'studio3d', title: 'Devis 3D Studio', icon: Play, link: '/simulateur', image: '/image/brouillon-ai/ai-studio3d.png', desc: "Configuration 3D et transmission directe au bureau d'études pour chiffrage.", tags: ['Config', '3D', 'Devis'] },
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

export default function Brouillon3() {
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

      {/* ── HERO cadré + réduit ──────────────────────────────── */}
      <div className="mt-[5vh] px-4 md:px-8">
        <section
          className="relative h-[48vh] min-h-[280px] w-full overflow-hidden rounded-2xl"
          style={{ boxShadow: '0 8px 40px -8px rgba(0,11,88,0.18)', outline: '1px solid rgba(0,11,88,0.08)' }}
        >
          {fallbackCarouselItems.map((item, index) => {
            const layoutKey = `b3n-slide-${index}`;
            const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 420;
            return (
              <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="absolute inset-0 flex items-center px-4 md:px-7 py-3">
                  <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                    <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                      <EditableImage editorKey={`b3n-hero-${index}`} src={item.imageUrl} alt={item.title} fill priority={index === 0} sizes="(max-width: 768px) 100vw, 66vw" className="object-cover" />
                    </div>
                    {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                    <div className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`} style={{ width: `${cardWidth}px` }}>
                      <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <div className="flex flex-col h-full rounded-xl border border-[#000B58]/12 bg-white/90 px-5 py-5 shadow-[0_12px_32px_-20px_rgba(0,11,88,0.45)] backdrop-blur-sm text-[#000B58]">
                          <EditableText editorKey={`b3n-hero-title-${index}`} defaultValue={item.title} as="h1" className="text-2xl md:text-[2.1rem] md:leading-[1.08] font-bold mb-4 text-[#000B58]" />
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

          {/* Nav slides */}
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

        {/* En-tête section */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#000B58]/35 mb-1">Multi-Pôles</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#000B58] tracking-tight">Nos savoir-faire</h2>
          </div>
          <Link href="/solutions" className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#000B58]/50 hover:text-[#000B58] transition-colors">
            Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 cartes */}
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
                <Link href={cat.link} className="block w-full h-full">
                  {/* Image */}
                  <Image src={cat.image} alt={cat.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority={i < 2} />

                  {/* Gradient haut + bas */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#000B58]/65 via-transparent to-[#000B58]/70" />

                  {/* ── TITRE EN HAUT — toujours visible ── */}
                  <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-3 z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm">
                        <Icon className="w-4 h-4 text-white" />
                      </span>
                      <div>
                        <p className="text-[9px] font-bold text-white/45 uppercase tracking-[0.2em] leading-none">{cat.n}</p>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.12em] leading-tight mt-0.5">{cat.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* ── CONTENU BAS — visible + enrichi au hover ── */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 z-10">
                    {/* Description — apparaît au hover */}
                    <p className="text-xs text-white/75 leading-relaxed mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">{cat.desc}</p>
                    {/* Tags — toujours visibles */}
                    <div className="flex flex-wrap gap-1">
                      {cat.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-white/65 border border-white/20 rounded-full px-2 py-0.5 backdrop-blur-sm">{tag}</span>
                      ))}
                    </div>
                    {/* CTA arrow */}
                    <div className="mt-3 flex items-center gap-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      <span className="text-xs font-semibold text-white/80">Découvrir</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 3 — Hero cadré · Cartes structurées</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillon2" className="hover:text-white">← B2</Link>
          <Link href="/brouillon1" className="hover:text-white">B1</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </footer>
    </div>
  );
}
