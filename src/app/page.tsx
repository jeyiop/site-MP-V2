'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbulb, Package, Printer, ChevronDown, Play } from 'lucide-react';
import { useCarousel, useSolutions, useRealisations } from '@/hooks/use-api';
import { CarouselSlide, Realisation } from '@/types/api';
import { RealisationCard } from '@/components/RealisationCard';
import { EditableImage } from '@/components/EditableImage';
import { EditableText } from '@/components/EditableText';
import { useEditorCarousel } from '@/hooks/use-editor-carousel';
import { useEditor } from '@/components/EditorWrapper';

// ─── Zone draggable propre (juste cadre + label, sauvegarde localStorage) ──
function DragZone({ id, color, label, init }: {
  id: string; color: string; label: string;
  init: { top: number; left: number; width: number; height: number };
}) {
  const key = `mp-zone-${id}`;
  const [r, setR] = useState(init);
  const loaded = useRef(false);
  const drag = useRef<{ sx: number; sy: number; sr: typeof init; mode: 'move'|'resize' } | null>(null);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try { const s = localStorage.getItem(key); if (s) setR(JSON.parse(s)); } catch {}
  }, [key]);

  useEffect(() => { if (loaded.current) localStorage.setItem(key, JSON.stringify(r)); }, [r, key]);

  const down = (e: React.PointerEvent, mode: 'move'|'resize') => {
    e.preventDefault(); e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, sr: { ...r }, mode };
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const pw = e.currentTarget.parentElement?.offsetWidth ?? 1;
    const ph = e.currentTarget.parentElement?.offsetHeight ?? 1;
    const dx = ((e.clientX - drag.current.sx) / pw) * 100;
    const dy = ((e.clientY - drag.current.sy) / ph) * 100;
    const s = drag.current.sr;
    if (drag.current.mode === 'move') setR({ ...s, top: Math.max(0, s.top + dy), left: Math.max(0, s.left + dx) });
    else setR({ ...s, width: Math.max(10, s.width + dx), height: Math.max(3, s.height + dy) });
  };
  const up = () => { drag.current = null; };

  return (
    <div
      style={{ position: 'absolute', top: `${r.top}%`, left: `${r.left}%`, width: `${r.width}%`, height: `${r.height}%`, border: `2px dashed ${color}`, borderRadius: 10, zIndex: 20, cursor: 'move' }}
      onPointerDown={e => down(e, 'move')} onPointerMove={move} onPointerUp={up}
    >
      <span style={{ position: 'absolute', top: -14, left: 6, background: color, color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, pointerEvents: 'none' }}>{label}</span>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, background: color, borderRadius: '3px 0 10px 0', cursor: 'se-resize' }}
        onPointerDown={e => { e.stopPropagation(); down(e, 'resize'); }} />
    </div>
  );
}

// ImgZone supprimé — remplacé par overlay produit inline dans la section cards

// Fallback carousel data
const fallbackCarouselItems: CarouselSlide[] = [
  {
    id: '1',
    title: "PLV, ILV & Packaging pour la pharmacie et la cosmétique",
    subtitle: "De la conception à la fabrication série, avec exigence de qualité et de délais",
    imageUrl: "/image/selecta/hero/hero-01-collage.jpg",
    videoUrl: undefined,
    ctaText: "Découvrir nos solutions",
    ctaLink: "/solutions",
    order: 1,
    isActive: true,
    locale: 'fr',
  },
  {
    id: '2',
    title: "Un partenaire technique à l’écoute et réactif",
    subtitle: "Accompagnement bureau d’études, prototype, validation et industrialisation",
    imageUrl: "/image/selecta/hero/hero-02.jpg",
    videoUrl: undefined,
    ctaText: "Lancer Devis 3D Studio",
    ctaLink: "/simulateur",
    order: 2,
    isActive: true,
    locale: 'fr',
  },
  {
    id: '3',
    title: "Devis 3D Studio pour cadrer rapidement votre besoin",
    subtitle: "Pré-configurez vos volumes et transmettez un brief exploitable pour chiffrage",
    imageUrl: "/image/selecta/hero/hero-03.jpg",
    videoUrl: undefined,
    ctaText: "Voir nos réalisations",
    ctaLink: "/realisations",
    order: 3,
    isActive: true,
    locale: 'fr',
  },
  {
    id: '4',
    title: "PLV et présentoirs orientés performance en point de vente",
    subtitle: "Conception utile, structure robuste et impact visuel maîtrisé",
    imageUrl: "/image/selecta/hero/hero-04.jpg",
    videoUrl: undefined,
    ctaText: "Découvrir nos solutions",
    ctaLink: "/solutions",
    order: 4,
    isActive: true,
    locale: 'fr',
  },
  {
    id: '5',
    title: "Fabrication série avec contrôle qualité et finitions premium",
    subtitle: "Impression, découpe, assemblage et conditionnement selon vos contraintes",
    imageUrl: "/image/selecta/hero/hero-05.jpg",
    videoUrl: undefined,
    ctaText: "Voir nos réalisations",
    ctaLink: "/realisations",
    order: 5,
    isActive: true,
    locale: 'fr',
  },
  {
    id: '6',
    title: "Activation retail multi-formats",
    subtitle: "Comptoir, linéaire, ILV et PLV sol selon les objectifs enseigne",
    imageUrl: "/image/selecta/hero/hero-06.png",
    videoUrl: undefined,
    ctaText: "Découvrir nos solutions",
    ctaLink: "/solutions",
    order: 6,
    isActive: true,
    locale: 'fr',
  },
  {
    id: '7',
    title: "Déploiement opérationnel de vos campagnes",
    subtitle: "Du prototype au terrain avec un pilotage centralisé",
    imageUrl: "/image/selecta/hero/hero-07.png",
    videoUrl: undefined,
    ctaText: "Nous contacter",
    ctaLink: "/contact",
    order: 7,
    isActive: true,
    locale: 'fr',
  },
];

const fallbackRealisations: Realisation[] = [
  {
    id: 'fallback-1',
    title: 'Corner Beauté Premium',
    description: 'Installation PLV complète pour le lancement d’une nouvelle gamme de soins visage.',
    client: 'LuxeSkin',
    category: 'PLV',
    images: ['/image/realisations/realisations-01.webp'],
    featuredImage: '/image/realisations/realisations-01.webp',
    year: 2024,
    tags: ['Retail', 'Animation', 'Skincare'],
    locale: 'fr',
    isPublished: true,
    createdAt: '2024-08-18T00:00:00Z',
  },
  {
    id: 'fallback-2',
    title: 'Présentoir parfumerie halo',
    description: 'Structure autoportante avec éclairage intégré pour maximiser la visibilité en boutique.',
    client: 'Elysée Parfums',
    category: 'Packaging',
    images: ['/image/realisations/realisations-02.webp'],
    featuredImage: '/image/realisations/realisations-02.webp',
    year: 2023,
    tags: ['Lumière', 'Corner', 'Premium'],
    locale: 'fr',
    isPublished: true,
    createdAt: '2023-11-04T00:00:00Z',
  },
  {
    id: 'fallback-3',
    title: 'Totems pharmacie modulaires',
    description: 'Série de totems personnalisables pour les points de vente santé & bien-être.',
    client: 'PharmaPlus',
    category: 'Print',
    images: ['/image/realisations/realisations-03.webp'],
    featuredImage: '/image/realisations/realisations-03.webp',
    year: 2024,
    tags: ['Pharmacie', 'Module', 'Point de vente'],
    locale: 'fr',
    isPublished: true,
    createdAt: '2024-05-22T00:00:00Z',
  },
  {
    id: 'fallback-4',
    title: 'Experience bar make-up',
    description: 'Espace immersif multi-écrans pour présenter une collection de maquillage.',
    client: 'GlowLab',
    category: 'Devis 3D Studio',
    images: ['/image/realisations/realisations-04.webp'],
    featuredImage: '/image/realisations/realisations-04.webp',
    year: 2022,
    tags: ['3D', 'Configuration', 'Devis'],
    locale: 'fr',
    isPublished: true,
    createdAt: '2022-09-10T00:00:00Z',
  },
];

const heroPanelContent: Record<string, { badge: string; details: string; points: string[]; metric: string }> = {
  '1': {
    badge: 'PLV & Packaging',
    details:
      'Conception et fabrication de dispositifs de vente et de communication commerciale pour les marques exigeantes.',
    points: ['PLV de comptoir et de sol', 'ILV et animation retail', 'Packaging et habillages'],
    metric: 'Expertise métier depuis 1996',
  },
  '2': {
    badge: 'Méthode projet',
    details:
      'Une organisation complète, de l’étude du besoin à la mise en place en point de vente, avec suivi opérationnel.',
    points: ['Brief + étude technique', 'Prototypage et tests', 'Production, co-packing, logistique'],
    metric: 'Respect des engagements qualité/délai',
  },
  '3': {
    badge: 'Devis 3D Studio',
    details:
      'Accélérez le cadrage de votre projet grâce à une configuration 3D claire transmise au bureau d’études.',
    points: ['Paramètres dimensions', 'Capacité et implantation produit', 'Demande de devis structurée'],
    metric: 'Du concept à la faisabilité en quelques clics',
  },
};

const heroTextGroups = [
  {
    title: "À la croisée des solutions",
    subtitle: "Multi-pôles est une société commerciale indépendante d'imprimeur, cartonnier, fabricant, concepteur, volumiste et production multimédia.",
    ctaText: "Découvrir nos solutions",
    ctaLink: "/solutions",
    panelKey: '1',
  },
  {
    title: "Devis en ligne Studio 3D",
    subtitle: "Pré-configurez votre projet, illustrez le besoin et transmettez un brief clair au bureau d’études",
    ctaText: "Ouvrir Devis 3D Studio",
    ctaLink: "/simulateur",
    panelKey: '3',
  },
  {
    title: "Plus de 300 experts à votre service",
    subtitle: "Regroupant plus de 300 personnes sur sites spécialisés dans leur domaine à travers la France.",
    ctaText: "Nous contacter",
    ctaLink: "/contact",
    panelKey: '2',
  },
  {
    title: "Production et déploiement multi-réseaux",
    subtitle: "PLV de comptoir, PLV de sol, ILV et packaging adaptés à vos contraintes retail",
    ctaText: "Voir nos réalisations",
    ctaLink: "/realisations",
    panelKey: '1',
  },
];

const solutionVisualsBySlug: Record<string, { image: string; tags: string[] }> = {
  plv: {
    image: '/image/selecta/savoir-faire/sf-plv.png',
    tags: ['Comptoir', 'Sol', 'Linéaire'],
  },
  packaging: {
    image: '/image/selecta/savoir-faire/sf-packaging.png',
    tags: ['Etuis', 'Coffrets', 'Calages'],
  },
  print: {
    image: '/image/selecta/savoir-faire/sf-print.png',
    tags: ['Offset', 'Numérique', 'Finitions'],
  },
  digital: {
    image: '/image/selecta/savoir-faire/sf-studio.jpg',
    tags: ['Configuration', '3D', 'Devis'],
  },
};

const geminiCards = [
  { slug: 'etuis', frame: '/image/selecta/savoir-faire/frame-etuis.png', photo: '/image/selecta/savoir-faire/photo-etuis.png', link: '/solutions#packaging' },
  { slug: 'plv', frame: '/image/selecta/savoir-faire/frame-plv.png', photo: '/image/selecta/savoir-faire/photo-plv.png', link: '/solutions#plv' },
  { slug: 'packaging', frame: '/image/selecta/savoir-faire/frame-packaging.png', photo: '/image/selecta/savoir-faire/photo-packaging.png', link: '/solutions#packaging' },
  { slug: 'print', frame: '/image/selecta/savoir-faire/frame-print.png', photo: '/image/selecta/savoir-faire/photo-print.png', link: '/solutions#print' },
];

const vitrineItems = [
  { id: 'v1', title: 'PLV comptoir Saugella', image: '/image/selecta/vitrine/vitrine-plv-comptoir-01.jpg', tags: ['PLV', 'Comptoir'] },
  { id: 'v2', title: 'PLV comptoir Innoxa', image: '/image/selecta/vitrine/vitrine-plv-comptoir-02.jpg', tags: ['PLV', 'Pharmacie'] },
  { id: 'v3', title: 'PLV comptoir Sampar', image: '/image/selecta/vitrine/vitrine-plv-comptoir-03.jpg', tags: ['PLV', 'Cosmétique'] },
  { id: 'v4', title: 'PLV sol Display', image: '/image/selecta/vitrine/vitrine-plv-sol-01.jpg', tags: ['PLV', 'Sol'] },
  { id: 'v5', title: 'PLV sol Seba-Med', image: '/image/selecta/vitrine/vitrine-plv-sol-02.jpg', tags: ['PLV', 'Retail'] },
  { id: 'v6', title: 'Linéaire Ultra-Levure', image: '/image/selecta/vitrine/vitrine-plv-lineaire-01.jpg', tags: ['ILV', 'Linéaire'] },
  { id: 'v7', title: 'Coffret T.Leclerc', image: '/image/selecta/vitrine/vitrine-packaging-01.jpg', tags: ['Packaging', 'Coffret'] },
  { id: 'v8', title: 'Packaging Fitoform', image: '/image/selecta/vitrine/vitrine-packaging-02.jpg', tags: ['Packaging', 'Pharma'] },
  { id: 'v9', title: 'Packaging Chronomag', image: '/image/selecta/vitrine/vitrine-packaging-03.jpg', tags: ['Packaging', 'Etui'] },
  { id: 'v10', title: 'Packaging Gravelline', image: '/image/selecta/vitrine/vitrine-packaging-04.jpg', tags: ['Packaging', 'Gamme'] },
  { id: 'v11', title: 'ILV silhouette Topicrem', image: '/image/selecta/vitrine/vitrine-ilv-01.jpg', tags: ['ILV', 'Vitrine'] },
  { id: 'v12', title: 'ILV Benegast', image: '/image/selecta/vitrine/vitrine-ilv-02.jpg', tags: ['ILV', 'Pharmacie'] },
];

const baseSolutionCategories = [
  {
    slug: 'plv',
    title: 'PLV',
    icon: Lightbulb,
    description:
      "PLV de comptoir et PLV de sol: conception structurelle, prototypage et fabrication série.",
    link: '/solutions#plv',
  },
  {
    slug: 'packaging',
    title: 'Packaging',
    icon: Package,
    description:
      'Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées.',
    link: '/solutions#packaging',
  },
  {
    slug: 'print',
    title: 'Print',
    icon: Printer,
    description:
      "Impression offset/numérique, dorure, vernis sélectif, gaufrage, découpe et façonnage.",
    link: '/solutions#print',
  },
  {
    slug: 'digital',
    title: 'Devis 3D Studio',
    icon: Play,
    description: 'Configuration 3D de votre projet et transmission directe au bureau d’études pour chiffrage.',
    link: '/simulateur',
  },
];

const faqItems = [
  {
    question: 'Quelle est votre expertise sectorielle ?',
    answer:
      'Nous intervenons sur les secteurs cosmétique, dermocosmétique et pharmacie avec des PLV comptoir/sol et des packagings techniques adaptés aux contraintes retail.',
  },
  {
    question: 'Proposez-vous des solutions sur-mesure ?',
    answer:
      'Oui. Nous partons de votre brief pour définir dimensions, matériaux, process d’impression, finitions et conditionnement, puis nous validons via prototype avant production série.',
  },
  {
    question: 'Comment l’innovation 3D intervient-elle dans vos projets ?',
    answer:
      'Le Devis 3D Studio permet de configurer les volumes et la capacité produit en amont. Votre configuration est transmise pour étude technique et devis.',
  },
  {
    question: 'Êtes-vous engagés dans une démarche éco-responsable ?',
    answer:
      'Nous privilégions les matières recyclables, l’optimisation des développés, et des choix de fabrication limitant la matière et les transports inutiles.',
  },
];

// ─── Drag-divider entre image et carte ──────────────────────
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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const vitrineScrollRef = useRef<HTMLDivElement | null>(null);

  const presentationVideoUrl = process.env.NEXT_PUBLIC_PRESENTATION_VIDEO_URL;
  const presentationVideoPoster = process.env.NEXT_PUBLIC_PRESENTATION_VIDEO_POSTER;
  const presentationVideoType = process.env.NEXT_PUBLIC_PRESENTATION_VIDEO_TYPE ?? 'video/mp4';

  // Fetch data from API
  const { data: carouselData, loading: carouselLoading } = useCarousel('fr');
  const { data: solutionsData, loading: solutionsLoading } = useSolutions('fr');
  const { data: realisationsData, loading: realisationsLoading } = useRealisations('fr');

  const baseRealisations = Array.isArray(realisationsData) && realisationsData.length > 0
    ? realisationsData
    : fallbackRealisations;

  const showcaseRealisations = baseRealisations
    .filter((item) => item?.isPublished)
    .sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 8);

  // Use API data or fallback
  const carouselItems = Array.isArray(carouselData) && carouselData.length > 0
    ? carouselData
      .filter((item) => item?.isActive && item?.imageUrl)
      .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    : fallbackCarouselItems;

  const safeCarouselLength = carouselItems.length || fallbackCarouselItems.length;

  const { currentSlide, nextSlide, prevSlide, goToSlide, editorMode } = useEditorCarousel({
    totalSlides: safeCarouselLength,
    intervalMs: 5000,
  });
  const { heroLayouts, setHeroLayout, imageOverrides } = useEditor();

  const displayedSolutions = baseSolutionCategories.map((base) => {
    const match = Array.isArray(solutionsData)
      ? solutionsData.find((solution) => {
        const slug = solution?.slug?.toLowerCase();
        const title = solution?.title?.toLowerCase();
        return (
          slug === base.slug ||
          title === base.title.toLowerCase()
        );
      })
      : undefined;

    return {
      id: match?.id ?? base.slug,
      title: base.title,
      icon: base.icon,
      description: base.description,
      link: base.link,
      image: solutionVisualsBySlug[base.slug]?.image,
      tags: solutionVisualsBySlug[base.slug]?.tags ?? [],
      order: match?.order ?? 0,
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeroTextGroup = (slideIndex: number) => {
    const groupIndex = Math.floor(slideIndex / 3);
    return heroTextGroups[groupIndex] ?? heroTextGroups[heroTextGroups.length - 1];
  };

  const scrollVitrine = (direction: 'left' | 'right') => {
    if (!vitrineScrollRef.current) return;
    const distance = Math.round(vitrineScrollRef.current.clientWidth * 0.82);
    vitrineScrollRef.current.scrollBy({
      left: direction === 'right' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Carousel — plein écran moins le header */}
      <section className="relative mt-4 md:mt-6 h-[54vh] min-h-[280px] w-full overflow-hidden bg-white">
        {carouselItems.map((item, index) => {
          const textGroup = getHeroTextGroup(index);
          const layoutKey = `slide-layout-${index}`;
          const cardWidth = (heroLayouts ?? {})[layoutKey] ?? 436;
          return (
            <div
              key={item?.id ?? index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="absolute inset-0 flex items-center px-4 md:px-9 py-3.5">
                <div className="w-full h-full flex items-stretch gap-3 md:gap-4">
                  {/* ── Image ── */}
                  <div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
                    {editorMode && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-50">
                        #S{index + 1}
                      </span>
                    )}
                    <EditableImage
                      editorKey={`hero-${index}`}
                      src={item?.imageUrl ?? '/image/placeholder.jpg'}
                      alt={item?.title ?? 'Slide'}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={95}
                      className="object-cover"
                    />
                  </div>
                  {/* ── Drag divider (editor only) ── */}
                  {editorMode && <SlideDivider layoutKey={layoutKey} cardWidth={cardWidth} setHeroLayout={setHeroLayout} />}
                  {/* ── Carte texte ── */}
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
                          editorKey={`hero-title-${index}`}
                          defaultValue={textGroup.title}
                          as="h1"
                          className="text-3xl md:text-[2.4rem] md:leading-[1.05] font-bold mb-3 text-[#000B58]"
                        />
                        <EditableText
                          editorKey={`hero-subtitle-${index}`}
                          defaultValue={textGroup.subtitle}
                          as="p"
                          className="text-base mb-4 text-[#000B58]/78"
                          multiline
                        />
                        <EditableText
                          editorKey={`hero-details-${index}`}
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
                                editorKey={`hero-point-${index}-${pointIndex}`}
                                defaultValue={point}
                                as="span"
                                className="text-sm text-[#000B58]/78"
                              />
                            </span>
                          ))}
                        </div>
                        <EditableText
                          editorKey={`hero-metric-${index}`}
                          defaultValue={(heroPanelContent[textGroup.panelKey] ?? heroPanelContent['1'])?.metric ?? ''}
                          as="p"
                          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#000B58]/55"
                        />
                        <div className="mt-auto">
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <div className="inline-flex rounded-lg border border-[#000B58] px-5 py-2.5 sm:px-6 sm:py-3 transition-colors hover:bg-[#000B58]/5">
                              <Link
                                href={textGroup?.ctaLink ?? item?.ctaLink ?? '#'}
                                className="font-semibold text-sm sm:text-base text-[#000B58] hover:text-[#000B58]/75 transition-colors"
                              >
                                {textGroup?.ctaText ?? item?.ctaText ?? 'En savoir plus'}
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
        <div
          className={`absolute bottom-6 left-4 md:left-10 z-30 flex items-center gap-3 transform transition-all duration-300 ease-out ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
        >
          <button
            onClick={prevSlide}
            className="rounded-lg bg-white p-2 sm:p-2.5 text-[#000B58] shadow-lg shadow-[#000B58]/20 transition-all"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="rounded-lg bg-white p-2 sm:p-2.5 text-[#000B58] shadow-lg shadow-[#000B58]/20 transition-all"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#000B58">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="h-4 w-px bg-[#000B58]/20 mx-1" />
          {carouselItems.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-3 w-3 rounded-[4px] ${index === currentSlide ? 'bg-[#000B58]' : 'bg-[#000B58]/25'
                }`}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              animate={{ scale: index === currentSlide ? 1.6 : 1 }}
              whileHover={{ scale: 1.25 }}
            />
          ))}
        </div>
      </section>
      {/* Services Section */}
      <section className="pt-4 pb-24 bg-[#000B58]">
        <div className="w-full px-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {geminiCards.map((card, index) => {
              const n = index + 1;
              return (
                <motion.div
                  key={card.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={editorMode ? {} : { y: -6 }}
                  className="relative"
                >
                  {/* Layer 1 (fond) : image produit remplaçable */}
                  <div style={{ position: 'absolute', top: '29.3%', left: '10.9%', width: '78.2%', height: '46.1%', overflow: 'hidden', zIndex: 1 }}>
                    <EditableImage
                      editorKey={`sf-product-${card.slug}`}
                      src={card.photo}
                      alt={`Image produit ${card.slug}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Layer 2 (dessus) : frame avec trou transparent — JAMAIS editable */}
                  <Image
                    src={card.frame}
                    alt={card.slug}
                    width={1792}
                    height={2232}
                    className="w-full h-auto block relative"
                    style={{ zIndex: 2, pointerEvents: 'none' }}
                  />

                  {editorMode && (
                    <>
                      <DragZone id={`c${n}-top`} color="#06b6d4" label={`#C${n}-TOP`} init={{ top: 1, left: 2, width: 95, height: 14 }} />
                      {/* Label visuel zone produit */}
                      <div style={{ position: 'absolute', top: '27.91%', left: '8.71%', width: '82.81%', height: '50.04%', border: '2px dashed #f59e0b', borderRadius: 20, zIndex: 15, pointerEvents: 'none' }}>
                        <span style={{ position: 'absolute', top: -14, left: 6, background: '#f59e0b', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4 }}>#C{n}-IMG</span>
                      </div>
                      <DragZone id={`c${n}-txt`} color="#22c55e" label={`#C${n}-TXT`} init={{ top: 80, left: 2, width: 95, height: 18 }} />
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vitrine — grille 4x4 images editables */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.3em] text-[#000B58]/50">
              Vitrine
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#000B58]">{"Réalisations Multi-Pôles"}</h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#000B58]/20" />
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#000B58]/60 leading-relaxed">
              {"Une sélection de réalisations issues de vos dossiers : PLV, ILV et packaging, présentée dans un format homogène pour lecture claire par secteur d’intervention."}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 16 }, (_, i) => (
              <div key={`vit-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#000B58]/5">
                <EditableImage
                  editorKey={`vitrine-${i + 1}`}
                  src="/image/selecta/savoir-faire/photo-packaging.png"
                  alt={`Réalisation ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Presentation Video */}
      <section className="bg-white py-20">
        <div className="container mx-auto flex flex-col gap-12 px-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#000B58]/15 bg-[#000B58]/5 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#000B58]"
            >
              En vidéo
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-6 text-4xl font-bold text-[#000B58]"
            >
              Découvrez Multi-Pôles en images
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-lg leading-relaxed text-[#000B58]/70"
            >
              Parcourez nos réalisations en contexte point de vente: PLV de comptoir, PLV de sol, packaging primaire/secondaire
              et opérations de conditionnement prêtes à l’expédition.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-[#000B58]/10 bg-[#000B58]/5 shadow-[0_30px_80px_-40px_rgba(0,11,88,0.35)]"
          >
            {presentationVideoUrl ? (
              <video
                controls
                preload="metadata"
                poster={presentationVideoPoster ?? undefined}
                className="aspect-video w-full bg-black object-cover"
              >
                <source src={presentationVideoUrl} type={presentationVideoType} />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-[#000B58]/10 p-8 text-center text-[#000B58]/70">
                <span className="text-xl font-semibold">Vidéo en cours d'ajout</span>
                <p className="max-w-md text-sm">
                  Ajoutez l'URL de votre vidéo dans la variable d'environnement <code className="rounded bg-[#000B58]/10 px-2 py-1">NEXT_PUBLIC_PRESENTATION_VIDEO_URL</code> pour afficher ce contenu.
                </p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/30" />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-lg border border-[#000B58]/15 bg-[#000B58]/5 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#000B58]">
              FAQ
            </span>
            <h2 className="mt-6 text-4xl font-bold text-[#000B58]">Pourquoi choisir Multi-Pôles&nbsp;?</h2>
            <p className="mt-3 text-lg text-[#000B58]/70">
              Découvrez en un clin d’œil les réponses aux questions que nos clients nous posent le plus souvent à propos de notre approche et de notre accompagnement.
            </p>
          </motion.div>

          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-[#000B58]/10 bg-white shadow-[0_18px_45px_-30px_rgba(0,11,88,0.45)]"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#000B58]/5"
                  >
                    <span className="text-lg font-semibold text-[#000B58]">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[#000B58] transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-base leading-relaxed text-[#000B58]/80">{item.answer}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Quote */}
      <section
        className="py-20 bg-navy text-white"
        style={{ backgroundColor: '#000B58' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-4xl font-bold mb-6"
            style={{ color: '#FFFFFF' }}
          >
            Prêt à concrétiser votre projet ?
          </h2>
          <p
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={{ color: '#FFFFFF' }}
          >
            Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/devis"
                className="bg-white text-[#000B58] px-8 py-3 rounded-md font-semibold border border-white hover:bg-white/80 transition-colors"
              >
                Demander un devis
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="bg-transparent text-white px-8 py-3 rounded-md font-semibold border border-white hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
