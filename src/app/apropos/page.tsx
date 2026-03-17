'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lightbulb, Sparkles, Sprout, Handshake } from 'lucide-react';
import { EditableImage } from '@/components/EditableImage';
import { EditableText } from '@/components/EditableText';

const values = [
  {
    title: 'Innovation',
    description: "Nous repoussons constamment les limites de la créativité et de la technologie pour créer des solutions d'affichage uniques et impactantes.",
    icon: Lightbulb,
    image: '/image/production/sol-plv.png',
  },
  {
    title: 'Excellence',
    description: "Nous nous engageons à fournir un travail de la plus haute qualité, du concept initial à la production finale.",
    icon: Sparkles,
    image: '/image/production/hero-0.png',
  },
  {
    title: 'Éco-responsabilité',
    description: "Nous concevons des solutions qui minimisent l'impact environnemental tout en maximisant l'efficacité commerciale.",
    icon: Sprout,
    image: '/image/production/hero-3.png',
  },
  {
    title: 'Collaboration',
    description: "Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs besoins et créer des solutions personnalisées.",
    icon: Handshake,
    image: '/image/production/hero-1.png',
  },
];

export default function APropos() {
  return (
    <div className="min-h-screen">
      <section className="pt-1 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="border-b border-[#000B58]/10 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-4 max-w-2xl"
            >
              <h1 className="text-xl md:text-2xl uppercase tracking-[0.35em] text-[#000B58]">
                <EditableText editorKey="apropos-title" defaultValue="À propos de Multi-Pôles" tag="span" />
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-[#000B58]/70">
                <EditableText editorKey="apropos-subtitle" defaultValue="Découvrez notre histoire, notre équipe et les valeurs qui animent notre expertise PLV." tag="span" />
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="pt-12 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#000B58] mb-6">
                <EditableText editorKey="apropos-history-title" defaultValue="Notre histoire" tag="span" />
              </h2>
              <div className="space-y-4 text-[#000B58]/75 leading-relaxed">
                <p>
                  <EditableText editorKey="apropos-history-p1" defaultValue="Fondée en 1995, Multi-Pôles est un Groupement d'Intérêt Économique spécialisé dans la conception et la fabrication de supports PLV, packaging et impression pour les industries cosmétique et pharmaceutique." tag="span" />
                </p>
                <p>
                  <EditableText editorKey="apropos-history-p2" defaultValue="Au fil des années, nous avons développé une expertise unique dans la conception et la fabrication de PLV qui allient esthétique, fonctionnalité et durabilité." tag="span" />
                </p>
                <p>
                  <EditableText editorKey="apropos-history-p3" defaultValue="Aujourd'hui, avec plus de 300 collaborateurs répartis sur plusieurs sites spécialisés, nous sommes devenus un partenaire privilégié des plus grandes marques du secteur." tag="span" />
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F3F5FB]">
              <EditableImage
                editorKey="apropos-hero"
                src="/image/production/hero-2.png"
                alt="Multi-Pôles — Notre histoire"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#000B58] mb-4">
              <EditableText editorKey="apropos-values-title" defaultValue="Nos valeurs" tag="span" />
            </h2>
            <p className="text-xl text-[#000B58]/60 max-w-3xl mx-auto">
              <EditableText editorKey="apropos-values-subtitle" defaultValue="Ces principes guident chacune de nos actions et décisions" tag="span" />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#000B58]/5"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <EditableImage
                      editorKey={`apropos-val-${index}`}
                      src={value.image}
                      alt={value.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#000B58]/5">
                        <Icon className="w-6 h-6 text-[#000B58]" />
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#000B58] mb-3">{value.title}</h3>
                    <p className="text-[#000B58]/60 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#000B58] mb-4">
              <EditableText editorKey="apropos-certif-title" defaultValue="Nos certifications" tag="span" />
            </h2>
            <p className="text-lg text-[#000B58]/60 max-w-3xl mx-auto">
              <EditableText editorKey="apropos-certif-subtitle" defaultValue="Engagés dans une démarche qualité et environnementale" tag="span" />
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {['PEFC', 'FSC', 'Imprim Vert', 'ISO 14001'].map((cert, i) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F9FA] rounded-xl p-6 flex flex-col items-center justify-center h-32 w-44 shadow-sm border border-[#000B58]/5"
              >
                <div className="relative w-16 h-16 mb-2">
                  <EditableImage
                    editorKey={`apropos-cert-${i}`}
                    src="/image/selecta/logo/imprim-vert-badge.webp"
                    alt={cert}
                    fill
                    compact
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-[#000B58]/70 uppercase tracking-wider">{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#000B58' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Prêt à collaborer ?
            </h2>
            <p className="text-xl mb-10 text-white/75">
              Contactez-nous pour discuter de votre projet et découvrir comment nous pouvons vous aider à valoriser votre marque.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="bg-white text-[#000B58] px-8 py-3 rounded-md font-semibold border border-white hover:bg-white/80 transition-colors">
                  Contactez-nous
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/simulateur" className="bg-transparent text-white px-8 py-3 rounded-md font-semibold border border-white hover:bg-white/10 transition-colors">
                  Devis 3D Studio
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
