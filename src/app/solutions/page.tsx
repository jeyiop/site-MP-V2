'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableImage } from '@/components/EditableImage';

const SOLUTIONS = [
  {
    title: 'PLV sur mesure',
    description:
      "Conception, prototypage et fabrication de dispositifs PLV qui épousent parfaitement votre univers de marque. Nos bureaux d'études internalisés garantissent un accompagnement complet, du volume maquette aux séries finales.",
    badge: 'PLV',
    image: '/image/selecta/savoir-faire/card-plv.png',
  },
  {
    title: 'Packaging premium',
    description:
      'Étuis, coffrets, calages et habillages pensés pour sublimer vos produits. Nous combinons savoir-faire artisanal et procédés industriels pour des packagings durables, élégants et performants.',
    badge: 'Packaging',
    image: '/image/selecta/savoir-faire/card-packaging.png',
  },
  {
    title: 'Impression et finition',
    description:
      "Offset, numérique, sérigraphie… Nos ateliers délivrent des impressions haute fidélité et des finitions spéciales (dorure, gaufrage, vernis sélectif) qui renforcent l'impact de vos supports.",
    badge: 'Impression',
    image: '/image/selecta/savoir-faire/card-print.png',
  },
  {
    title: 'Devis 3D Studio',
    description:
      'Configurez votre PLV en 3D (dimensions, niveau de chargement, implantation produit) puis transmettez directement votre brief pour chiffrage technique.',
    badge: '3D Studio',
    image: '/image/selecta/savoir-faire/card-etuis-pharma.png',
  },
];

export default function Solutions() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-1 pb-12">
        <div className="container mx-auto px-4">
          <div className="border-b border-[#000B58]/10 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-4 max-w-2xl"
            >
              <h1 className="text-xl md:text-2xl uppercase tracking-[0.35em] text-[#000B58]">
                Solutions PLV & Packaging
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-[#000B58]/70">
                Notre offre couvre la chaîne complète: bureau d'études, prototypage, production série, conditionnement et déploiement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pt-12 pb-20">
        <div className="container mx-auto px-4 space-y-20">
          {SOLUTIONS.map((solution, index) => (
            <motion.article
              key={solution.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="space-y-8"
            >
              <div
                className={`grid gap-8 lg:gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] ${
                  index % 2 === 0 ? '' : 'lg:direction-rtl'
                }`}
              >
                <div
                  className={`relative order-1 overflow-hidden rounded-lg bg-[#F3F5FB] aspect-[14/9] ${
                    index % 2 === 0 ? '' : 'lg:order-2'
                  }`}
                >
                  <EditableImage
                    editorKey={`sol-${solution.badge.toLowerCase().replace(/\s+/g, '-')}`}
                    src={solution.image}
                    alt={solution.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 55vw, (min-width: 768px) 70vw, 100vw"
                    priority={index === 0}
                  />
                  <span className="pointer-events-none absolute inset-0 rounded-lg border border-white/40" aria-hidden="true" />
                </div>

                <div
                  className={`order-2 flex flex-col justify-between gap-6 lg:gap-10 ${
                    index % 2 === 0 ? '' : 'lg:order-1 lg:text-right'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#000B58]/60">
                      <span>{solution.badge}</span>
                      <span className="h-px flex-1 bg-[#000B58]/15" aria-hidden="true" />
                    </div>
                    <h2 className="text-3xl font-semibold uppercase tracking-[0.18em] text-[#000B58]">
                      {solution.title}
                    </h2>
                    <p className="text-base leading-relaxed text-[#000B58]/75">
                      {solution.description}
                    </p>
                  </div>

                  <div className={`grid gap-6 text-sm uppercase tracking-[0.24em] text-[#000B58]/60 ${index % 2 === 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-2 lg:direction-ltr'}`}>
                    <div className="space-y-2">
                      <span className="text-[11px] font-medium text-[#000B58]/40">Secteur</span>
                      <p className="text-[#000B58]">Retail & Beauté</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] font-medium text-[#000B58]/40">Livrables</span>
                      <p className="text-[#000B58]">Concept, Design, Production</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#000B58]/10" aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#000B58' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-semibold" style={{ color: '#FFFFFF' }}>
              Prêt à concrétiser votre projet ?
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir une proposition personnalisée par nos équipes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/devis"
                className="rounded-md border border-white bg-white px-6 py-3 text-sm font-semibold text-[#000B58] transition-colors hover:bg-white/80"
              >
                Demander un devis
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
