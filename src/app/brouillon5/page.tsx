'use client';

// ── BROUILLON 5 ─────────────────────────────────────────────
// = Header blanc (global) + Hero slide original (page.tsx)
// + Section "Nos savoir-faire" du brouillon 4 (cartes overlay)

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lightbulb, Package, Printer, Play, ArrowUpRight } from 'lucide-react';
import { EditableImage } from '@/components/EditableImage';
import { EditableText } from '@/components/EditableText';
import { useEditorCarousel } from '@/hooks/use-editor-carousel';
import { useEditor } from '@/components/EditorWrapper';

// ── Carousel data (identique page originale) ─────────────────
const fallbackCarouselItems = [
  { id: '1', imageUrl: '/image/selecta/hero/hero-01-collage.jpg', title: 'PLV, ILV & Packaging pour la pharmacie et la cosmétique', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 1, isActive: true, locale: 'fr' as const },
  { id: '2', imageUrl: '/image/selecta/hero/hero-02.jpg', title: "Un partenaire technique à l'écoute et réactif", ctaLink: '/simulateur', ctaText: 'Lancer Devis 3D Studio', order: 2, isActive: true, locale: 'fr' as const },
  { id: '3', imageUrl: '/image/selecta/hero/hero-03.jpg', title: 'Devis 3D Studio pour cadrer rapidement votre besoin', ctaLink: '/realisations', ctaText: 'Voir nos réalisations', order: 3, isActive: true, locale: 'fr' as const },
  { id: '4', imageUrl: '/image/selecta/hero/hero-04.jpg', title: 'PLV et présentoirs orientés performance en point de vente', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 4, isActive: true, locale: 'fr' as const },
  { id: '5', imageUrl: '/image/selecta/hero/hero-05.jpg', title: 'Fabrication série avec contrôle qualité et finitions premium', ctaLink: '/realisations', ctaText: 'Voir nos réalisations', order: 5, isActive: true, locale: 'fr' as const },
  { id: '6', imageUrl: '/image/selecta/hero/hero-06.png', title: 'Activation retail multi-formats', ctaLink: '/solutions', ctaText: 'Découvrir nos solutions', order: 6, isActive: true, locale: 'fr' as const },
  { id: '7', imageUrl: '/image/selecta/hero/hero-07.png', title: 'Déploiement opérationnel de vos campagnes', ctaLink: '/contact', ctaText: 'Nous contacter', order: 7, isActive: true, locale: 'fr' as const },
];

// ── Hero text groups (identique page originale) ─────────────
const heroPanelContent: Record<string, { badge: string; details: string; points: string[]; metric: string }> = {
  '1': {
    badge: 'PLV & Packaging',
    details: 'Conception et fabrication de dispositifs de vente et de communication commerciale pour les marques exigeantes.',
    points: ['PLV de comptoir et de sol', 'ILV et animation retail', 'Packaging et habillages'],
    metric: 'Expertise métier depuis 1996',
  },
  '2': {
    badge: 'Méthode projet',
    details: 'Une organisation complète, de l\'étude du besoin à la mise en place en point de vente, avec suivi opérationnel.',
    points: ['Brief + étude technique', 'Prototypage et tests', 'Production, co-packing, logistique'],
    metric: 'Respect des engagements qualité/délai',
  },
  '3': {
    badge: 'Devis 3D Studio',
    details: 'Accélérez le cadrage de votre projet grâce à une configuration 3D claire transmise au bureau d\'études.',
    points: ['Paramètres dimensions', 'Capacité et implantation produit', 'Demande de devis structurée'],
    metric: 'Du concept à la faisabilité en quelques clics',
  },
};

const heroTextGroups = [
  { title: "À la croisée des solutions", subtitle: "Multi-pôles est une société commerciale indépendante d'imprimeur, cartonnier, fabricant, concepteur, volumiste et production multimédia.", ctaText: "Découvrir nos solutions", ctaLink: "/solutions", panelKey: '1' },
  { title: "Devis en ligne Studio 3D", subtitle: "Pré-configurez votre projet, illustrez le besoin et transmettez un brief clair au bureau d'études", ctaText: "Ouvrir Devis 3D Studio", ctaLink: "/simulateur", panelKey: '3' },
  { title: "Plus de 300 experts à votre service", subtitle: "Regroupant plus de 300 personnes sur sites spécialisés dans leur domaine à travers la France.", ctaText: "Nous contacter", ctaLink: "/contact", panelKey: '2' },
  { title: "Production et déploiement multi-réseaux", subtitle: "PLV de comptoir, PLV de sol, ILV et packaging adaptés à vos contraintes retail", ctaText: "Voir nos réalisations", ctaLink: "/realisations", panelKey: '1' },
];

// ── Catégories savoir-faire (du brouillon 4) ────────────────
const CATEGORIES = [
  { n: '01', id: 'plv', title: 'PLV', icon: Lightbulb, link: '/solutions#plv', image: '/image/brouillon-ai/ai-plv.png', desc: 'PLV de comptoir et de sol — conception structurelle, prototypage et fabrication série.', tags: ['Comptoir', 'Sol', 'Linéaire'] },
  { n: '02', id: 'packaging', title: 'Packaging', icon: Package, link: '/solutions#packaging', image: '/image/brouillon-ai/ai-packaging.png', desc: "Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées.", tags: ['Etuis', 'Coffrets', 'Calages'] },
  { n: '03', id: 'print', title: 'Print', icon: Printer, link: '/solutions#print', image: '/image/brouillon-ai/ai-print.png', desc: "Offset, numérique, dorure à chaud, vernis sélectif, gaufrage et façonnage.", tags: ['Offset', 'Numérique', 'Finitions'] },
  { n: '04', id: 'studio3d', title: 'Devis 3D Studio', icon: Play, link: '/simulateur', image: '/image/brouillon-ai/ai-studio3d.png', desc: "Configuration 3D et transmission directe au bureau d'études pour chiffrage.", tags: ['Config', '3D', 'Devis'] },
];

// ── Drag-divider (identique page originale) ─────────────────
function SlideDivider({ layoutKey, cardWidth, setHeroLayout }: {
  layoutKey: string; cardWidth: number; setHeroLayout: (k: string, w: number) => void;
}) {
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const [active, setActive] = useState(false);
  return (
    <div
      style={{ width: '14px', flexShrink: 0, alignSelf: 'stretch', cursor: 'ew-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 35, userSelect: 'none' }}
      title={`Glisser pour redimensionner (${cardWidth}px)`}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); dragRef.current = { startX: e.clientX, startW: cardWidth }; setActive(true); }}
      onPointerMove={(e) => { if (!dragRef.current) return; const delta = -(e.clientX - dragRef.current.startX); setHeroLayout(layoutKey, Math.max(234, Math.min(576, dragRef.current.startW + delta))); }}
      onPointerUp={() => { dragRef.current = null; setActive(false); }}
      onPointerLeave={() => { dragRef.current = null; setActive(false); }}
    >
      <div style={{ width: '4px', height: '52px', borderRadius: '4px', backgroundColor: active ? '#000B58' : 'rgba(0,11,88,0.3)', boxShadow: active ? '0 0 0 4px rgba(0,11,88,0.12)' : 'none', transition: 'all 0.15s' }} />
    </div>
  );
}

export default function Brouillon5() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentSlide, nextSlide, prevSlide, goToSlide, editorMode } = useEditorCarousel({ totalSlides: fallbackCarouselItems.length, intervalMs: 5000 });
  const { heroLayouts, setHeroLayout } = useEditor();

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const getHeroTextGroup = (slideIndex: number) => {
    const groupIndex = Math.floor(slideIndex / 3);
    return heroTextGroups[groupIndex] ?? heroTextGroups[heroTextGroups.length - 1];
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pt-[5.5rem] md:pt-[6rem]">

      {/* ── HERO CAROUSEL — identique page originale ─────────── */}
      <section className="relative mt-6 md:mt-8 h-[67vh] min-h-[342px] w-full overflow-hidden bg-white">
        {fallbackCarouselItems.map((item, index) => {
          const textGroup = getHeroTextGroup(index);
          const layoutKey = `b5-slide-layout-${index}`;
          const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 436;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 flex items-center px-4 md:px-9 py-3.5">
                <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                  {/* Image */}
                  <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                    <EditableImage
                      editorKey={`b5-hero-${index}`}
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Drag divider (editor only) */}
                  {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                  {/* Carte texte */}
                  <div
                    className={`hidden md:flex flex-col shrink-0 transform transition-all duration-300 ease-out ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                    style={{ width: `${cardWidth}px` }}
                  >
                    <motion.div className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                      <div className="flex flex-col h-full rounded-2xl border border-[#000B58]/15 bg-white/88 px-5 py-6 shadow-[0_20px_48px_-36px_rgba(0,11,88,0.55)] backdrop-blur-sm md:px-6 md:py-7 text-[#000B58]">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="inline-flex rounded-md border border-[#000B58]/20 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#000B58]/75">
                            {(heroPanelContent[textGroup.panelKey] ?? heroPanelContent['1'])?.badge ?? 'Savoir-faire'}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#000B58]/55">
                            Slide {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <EditableText
                          editorKey={`b5-hero-title-${index}`}
                          defaultValue={textGroup.title}
                          as="h1"
                          className="text-3xl md:text-[2.4rem] md:leading-[1.05] font-bold mb-3 text-[#000B58]"
                        />
                        <EditableText
                          editorKey={`b5-hero-subtitle-${index}`}
                          defaultValue={textGroup.subtitle}
                          as="p"
                          className="text-base mb-4 text-[#000B58]/78"
                          multiline
                        />
                        <EditableText
                          editorKey={`b5-hero-details-${index}`}
                          defaultValue={(heroPanelContent[textGroup.panelKey] ?? heroPanelContent['1'])?.details ?? ''}
                          as="p"
                          className="text-sm leading-relaxed text-[#000B58]/72 mb-4"
                          multiline
                        />
                        <div className="mb-5 grid grid-cols-1 gap-2">
                          {((heroPanelContent[textGroup.panelKey] ?? heroPanelContent['1'])?.points ?? []).map((point, pointIndex) => (
                            <span key={pointIndex} className="inline-flex items-center gap-2 text-sm text-[#000B58]/78">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#000B58]/65 shrink-0" />
                              <EditableText
                                editorKey={`b5-hero-point-${index}-${pointIndex}`}
                                defaultValue={point}
                                as="span"
                                className="text-sm text-[#000B58]/78"
                              />
                            </span>
                          ))}
                        </div>
                        <EditableText
                          editorKey={`b5-hero-metric-${index}`}
                          defaultValue={(heroPanelContent[textGroup.panelKey] ?? heroPanelContent['1'])?.metric ?? ''}
                          as="p"
                          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#000B58]/55"
                        />
                        <div className="mt-auto">
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <div className="inline-flex rounded-lg border border-[#000B58] px-5 py-2.5 sm:px-6 sm:py-3 transition-colors hover:bg-[#000B58]/5">
                              <Link
                                href={textGroup?.ctaLink ?? item.ctaLink}
                                className="font-semibold text-sm sm:text-base text-[#000B58] hover:text-[#000B58]/75 transition-colors"
                              >
                                {textGroup?.ctaText ?? item.ctaText}
                              </Link>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Controls */}
        <div className={`absolute bottom-6 left-4 md:left-10 z-30 flex items-center gap-3 transform transition-all duration-300 ease-out ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          <button onClick={prevSlide} className="rounded-lg bg-white p-2 sm:p-2.5 text-[#000B58] shadow-lg shadow-[#000B58]/20 transition-all" aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextSlide} className="rounded-lg bg-white p-2 sm:p-2.5 text-[#000B58] shadow-lg shadow-[#000B58]/20 transition-all" aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="h-4 w-px bg-[#000B58]/20 mx-1" />
          {fallbackCarouselItems.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-3 w-3 rounded-[4px] ${index === currentSlide ? 'bg-[#000B58]' : 'bg-[#000B58]/25'}`}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              animate={{ scale: index === currentSlide ? 1.6 : 1 }}
              whileHover={{ scale: 1.25 }}
            />
          ))}
        </div>
      </section>

      {/* ── NOS SAVOIR-FAIRE — du brouillon 4 ────────────────── */}
      <section className="bg-white px-4 md:px-8 pt-5 pb-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <EditableText editorKey="b5-section-label" defaultValue="Multi-Pôles" as="p" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#000B58]/35 mb-1" />
            <EditableText editorKey="b5-section-title" defaultValue="Nos savoir-faire" as="h2" className="text-2xl md:text-3xl font-extrabold text-[#000B58] tracking-tight" />
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
                <EditableImage editorKey={`b5-cat-img-${cat.id}`} src={cat.image} alt={cat.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" priority={i < 2} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#000B58]/65 via-transparent to-[#000B58]/70" />

                {/* Titre haut */}
                <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-3 z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-white" />
                    </span>
                    <div>
                      <p className="text-[9px] font-bold text-white/45 uppercase tracking-[0.2em] leading-none">{cat.n}</p>
                      <EditableText editorKey={`b5-cat-title-${cat.id}`} defaultValue={cat.title} as="h3" className="text-sm font-extrabold text-white uppercase tracking-[0.12em] leading-tight mt-0.5" />
                    </div>
                  </div>
                </div>

                {/* Contenu bas */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 z-10">
                  <EditableText editorKey={`b5-cat-desc-${cat.id}`} defaultValue={cat.desc} as="p" className="text-xs text-white/75 leading-relaxed mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
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

      {/* ── Footer brouillon ─────────────────────────────────── */}
      <div className="mt-auto bg-gray-900 text-gray-400 text-center py-6 text-xs">
        <p>Brouillon 5 — Header blanc original · Hero complet · Savoir-faire B4</p>
        <div className="flex justify-center gap-6 mt-2">
          <Link href="/brouillon4" className="hover:text-white">← B4</Link>
          <Link href="/brouillon3" className="hover:text-white">B3</Link>
          <Link href="/" className="hover:text-white">Site principal</Link>
        </div>
      </div>
    </div>
  );
}
