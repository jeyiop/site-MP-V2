'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Lightbulb, Package, Printer, Play } from 'lucide-react';
import { useRealisations, useSolutions } from '@/hooks/use-api';
import { RealisationCard } from '@/components/RealisationCard';
import { EditableImage } from '@/components/EditableImage';
import type { Realisation } from '@/types/api';

const solutionVisualsBySlug: Record<string, { image: string; tags: string[] }> = {
  plv: { image: '/image/selecta/savoir-faire/sf-plv.png', tags: ['Comptoir', 'Sol', 'Linéaire'] },
  packaging: { image: '/image/selecta/savoir-faire/sf-packaging.png', tags: ['Etuis', 'Coffrets', 'Calages'] },
  print: { image: '/image/selecta/savoir-faire/sf-print.png', tags: ['Offset', 'Numérique', 'Finitions'] },
  digital: { image: '/image/selecta/savoir-faire/sf-studio.jpg', tags: ['Configuration', '3D', 'Devis'] },
};

const baseSolutionCategories = [
  { slug: 'plv', title: 'PLV', icon: Lightbulb, description: "PLV de comptoir et PLV de sol: conception structurelle, prototypage et fabrication série.", link: '/solutions#plv' },
  { slug: 'packaging', title: 'Packaging', icon: Package, description: 'Etuis, coffrets, sleeves et calages avec contraintes logistiques et retail intégrées.', link: '/solutions#packaging' },
  { slug: 'print', title: 'Print', icon: Printer, description: "Impression offset/numérique, dorure, vernis sélectif, gaufrage, découpe et façonnage.", link: '/solutions#print' },
  { slug: 'digital', title: 'Devis 3D Studio', icon: Play, description: "Configuration 3D de votre projet et transmission directe au bureau d'études pour chiffrage.", link: '/simulateur' },
];

export default function RealisationsPage() {
  const { data: realisations, loading, error } = useRealisations('fr');
  const { data: solutionsData, loading: solutionsLoading } = useSolutions('fr');
  const [selectedRealisation, setSelectedRealisation] = useState<Realisation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const displayedSolutions = baseSolutionCategories.map((base) => {
    const match = Array.isArray(solutionsData)
      ? solutionsData.find((s) => s?.slug?.toLowerCase() === base.slug || s?.title?.toLowerCase() === base.title.toLowerCase())
      : null;
    const visuals = solutionVisualsBySlug[base.slug] ?? { image: '/image/placeholder.jpg', tags: [] };
    return { ...base, id: base.slug, image: visuals.image, tags: visuals.tags, ...(match ? { title: match.title, description: match.description } : {}) };
  });

  // Filter published realisations and sort by year
  const publishedRealisations = realisations
    ? realisations.filter(r => r.isPublished).sort((a, b) => b.year - a.year)
    : [];

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(publishedRealisations.map(r => r.category)))];

  // Filter by selected category
  const filteredRealisations = selectedCategory === 'all'
    ? publishedRealisations
    : publishedRealisations.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Category Filter */}
      <section className="pt-1 pb-3 md:pb-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="border-b border-[#000B58]/10 pb-6">
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="space-y-4 max-w-2xl"
              >
                <h1 className="text-xl md:text-2xl uppercase tracking-[0.35em] text-[#000B58]">
                  Explorez nos réalisations
                </h1>
                <p className="text-base md:text-lg leading-relaxed text-[#000B58]/70">
                  Découvrez comment nous sublimons les marques cosmétique et pharma avec des dispositifs PLV impactants.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mt-3 md:mt-4 overflow-x-auto"
          >
            <div className="inline-flex min-w-max rounded-lg border border-[#000B58]/12 bg-white/70 shadow-sm">
              {categories.map((category, index) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 md:px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#000B58]/60 ${
                      isActive
                        ? 'bg-[#000B58] text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]'
                        : 'text-[#000B58]/70 hover:bg-[#000B58]/10'
                    } ${index > 0 ? 'border-l border-[#000B58]/12' : ''}`}
                  >
                    {category === 'all' ? 'Tous' : category}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Realisations Grid */}
      <section id="realisations" className="pt-3 md:pt-4 pb-20 bg-white">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto mb-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {!loading && filteredRealisations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredRealisations.map((realisation, index) => (
                <RealisationCard
                  key={realisation.id}
                  realisation={realisation}
                  index={index}
                  onClick={() => setSelectedRealisation(realisation)}
                />
              ))}
            </div>
          )}
          
          {!loading && filteredRealisations.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                Aucune réalisation à afficher pour cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Nos savoir-faire */}
      <section className="py-20 bg-[#000B58]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Nos savoir-faire</h2>
            <p className="text-xl max-w-3xl mx-auto text-white">
              Depuis 1996, Multi-Pôles accompagne les marques en pharmacie, parapharmacie et cosmétique :
              conseil, création, fabrication, co-packing et déploiement terrain.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutionsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-8 animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded mb-4" />
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-16 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : (
              displayedSolutions.map((solution) => {
                const Icon = solution.icon;
                return (
                  <motion.div
                    key={solution.id}
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ duration: 0.25 }}
                    className="group relative overflow-hidden rounded-2xl bg-white/95 p-8 shadow-lg shadow-black/10 border border-white/60 text-[#000B58] transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow/80 via-yellow/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex flex-col h-full">
                      <div className="mb-5 overflow-hidden rounded-xl border border-[#000B58]/10 bg-[#f5f5f2]">
                        <div className="relative aspect-[4/3] w-full">
                          <EditableImage
                            editorKey={`sf-real-${solution.id}`}
                            src={solution.image}
                            alt={solution.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 25vw"
                            className="object-contain p-3"
                          />
                        </div>
                      </div>
                      <div className="mb-5 flex items-center justify-start">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/20">
                          <Icon className="w-6 h-6 text-[#000B58]" />
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                      <p className="text-[#000B58]/70 mb-6 flex-1 leading-relaxed">{solution.description}</p>
                      <div className="mb-6 flex flex-wrap gap-2">
                        {solution.tags.map((tag) => (
                          <span key={tag} className="rounded-md border border-[#000B58]/15 bg-[#000B58]/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#000B58]/70">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link href={solution.link} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#000B58] group-hover:text-yellow transition-colors">
                        En savoir plus
                        <span aria-hidden="true" className="text-base leading-none transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-navy text-white"
        style={{ backgroundColor: '#000B58' }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl mb-10" style={{ color: '#FFFFFF' }}>
              Contactez-nous dès aujourd'hui pour discuter de votre projet et bénéficier de notre expertise.
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
                  href="/simulateur"
                  className="bg-transparent text-white px-8 py-3 rounded-md font-semibold border border-white hover:bg-white/10 transition-colors"
                >
                  Essayer notre simulateur
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRealisation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRealisation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Image */}
              {(selectedRealisation.featuredImage || selectedRealisation.images?.[0]) && (
                <div className="h-64 relative">
                  <Image
                    src={selectedRealisation.featuredImage || selectedRealisation.images?.[0] || ''}
                    alt={selectedRealisation.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setSelectedRealisation(null)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Modal Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-yellow text-navy px-3 py-1 rounded-lg text-sm font-semibold">
                    {selectedRealisation.category}
                  </span>
                  {selectedRealisation.year && (
                    <span className="text-gray-500">
                      {selectedRealisation.year}
                    </span>
                  )}
                </div>
                
                <h2 className="text-3xl font-bold text-navy mb-4">
                  {selectedRealisation.title}
                </h2>
                
                {selectedRealisation.client && (
                  <p className="text-lg text-gray-600 mb-4">
                    <span className="font-semibold">Client:</span> {selectedRealisation.client}
                  </p>
                )}
                
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedRealisation.description}
                  </p>
                </div>
                
                {/* Tags */}
                {selectedRealisation.tags && selectedRealisation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedRealisation.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Additional Images */}
                {selectedRealisation.images && selectedRealisation.images.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {selectedRealisation.images.slice(1).map((image, idx) => (
                      <div key={idx} className="h-40 relative rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${selectedRealisation.title} - Image ${idx + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* CTA Button */}
                <div className="flex justify-center">
                  <Link
                    href="/contact"
                    className="bg-navy text-white px-8 py-3 rounded-md font-semibold hover:bg-navy/90 transition-colors"
                  >
                    Discuter de votre projet
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
