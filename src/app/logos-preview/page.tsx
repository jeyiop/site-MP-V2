'use client';

import Image from 'next/image';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';


export default function LogosPreviewPage() {
    const logos = [
        { src: '/image/selecta/logo/logo A.png', name: 'Logo A' },
        { src: '/image/selecta/logo/logo b.png', name: 'Logo B' },
        { src: '/image/selecta/logo/logo c.png', name: 'Logo C' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 md:px-8 space-y-20">

            <div className="text-center max-w-2xl">
                <h1 className="text-3xl font-bold text-navy mb-4">Aperçu Comparatif des Logos</h1>
                <p className="text-gray-600">
                    Voici comment chaque logo rend exactement dans son cadre (le Header Bleu) de façon indépendante. Prenez le temps de comparer les 3 versions ci-dessous et dîtes-moi lequel vous préférez !
                </p>
            </div>

            <div className="flex flex-col gap-24 w-full max-w-[1400px]">
                {logos.map((logo, index) => (
                    <div key={index} className="flex flex-col gap-6">
                        {/* Titre du logo */}
                        <div className="flex items-center gap-4">
                            <span className="bg-navy text-white text-xl font-bold h-10 w-10 flex items-center justify-center rounded-full">
                                {index + 1}
                            </span>
                            <h2 className="text-2xl font-semibold text-navy">Candidat : {logo.name}</h2>
                        </div>

                        {/* Fausse simulation de Header */}
                        <div className="w-full relative bg-gray-200 rounded-xl overflow-hidden border border-gray-300 shadow-xl">
                            {/* Le faux contenu du site derrière */}
                            <div className="h-64 md:h-80 w-full bg-[url('/image/hero-08.png')] bg-cover bg-center opacity-30"></div>

                            {/* Le Faux Header injecté pardessus */}
                            <header className="absolute top-2 w-full px-4 md:px-8 left-0">
                                <div className="container mx-auto rounded-lg border border-white/10 bg-navy px-6 md:px-12 py-1.5 md:py-2 text-white shadow-md shadow-black/10 flex items-center gap-4 md:gap-6">

                                    {/* Faux Bouton Logo */}
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="relative flex items-center group">
                                            <div className="relative z-10 flex h-16 w-40 md:h-16 md:w-48 items-center justify-center overflow-hidden">
                                                <Image
                                                    src={logo.src}
                                                    alt={logo.name}
                                                    fill
                                                    className="object-cover object-center scale-[110%]"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                        <span className="hidden md:block h-6 w-px bg-white/20" aria-hidden="true" />
                                    </div>

                                    {/* Faux menu textuel */}
                                    <div className="hidden md:flex flex-1 justify-center pointer-events-none">
                                        <NavigationMenu>
                                            <NavigationMenuList className="flex-wrap gap-2">
                                                {['Accueil', 'Solutions', 'Réalisations', 'À propos', 'Contact'].map((item) => (
                                                    <NavigationMenuItem key={item}>
                                                        <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} !text-white/80 hover:!text-white hover:!bg-white/10 !bg-transparent`}>
                                                            <span className="cursor-default">{item}</span>
                                                        </NavigationMenuLink>
                                                    </NavigationMenuItem>
                                                ))}
                                            </NavigationMenuList>
                                        </NavigationMenu>
                                    </div>

                                    {/* Faux bouton de droite */}
                                    <div className="hidden md:flex items-center gap-4">
                                        <span className="h-6 w-px bg-white/20" aria-hidden="true" />
                                        <div>
                                            <Button asChild variant="outline" className="border-white text-white bg-transparent pointer-events-none">
                                                <span>Simulateur</span>
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </header>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
