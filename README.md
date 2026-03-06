# Site Multipoles V3

Site vitrine professionnel pour **Multipoles** — spécialiste PLV, packaging haut de gamme et structures volumétriques en carton.

## Stack technique

- **Framework** : Next.js 15 (App Router, Turbopack)
- **Langage** : TypeScript
- **Style** : Tailwind CSS v4
- **3D** : Three.js (via importmap CDN)
- **Port dev** : 3002

## Lancer le projet

```bash
npm install
npm run dev
# → http://localhost:3002
```

## Pages

| Route | Description |
|---|---|
| `/` | Accueil — hero carousel, savoir-faire, vitrine |
| `/solutions` | Solutions PLV, packaging, imprimerie |
| `/realisations` | Galerie de réalisations |
| `/simulateur` | Studio 3D PLV & Packaging (Three.js) |
| `/apropos` | À propos de Multipoles |
| `/blog` | Articles et actualités |
| `/contact` | Formulaire de contact |
| `/devis` | Demande de devis |

## Éditeur visuel

Un éditeur visuel intégré permet de modifier images et textes sans toucher au code.

**Activer** : bouton **Éditeur** en bas à droite (toutes les pages)

### Fonctionnalités
- Remplacement d'images via galerie ou upload
- Édition de textes en clic direct
- Zoom/recadrage des images
- Ajustement des layouts hero
- **Sauvegarde persistante** : bouton 💾 → écrit dans `src/data/editor-overrides.json`
- Export/Import JSON des modifications

### API interne
- `GET /api/studio/load` — charge les overrides sauvegardés
- `POST /api/studio/save` — sauvegarde les overrides côté serveur

## Simulateur 3D

Accessible via `/simulateur` — fichier statique `public/studio-3d.html` chargé en iframe.

- Deux modes : **PLV de sol** et **Packaging** (étui tuck-end)
- Configurateur de dimensions en temps réel
- 8 thèmes visuels (Warm pro, Cobalt, Pharma, Jour neutre…)
- Fiche devis client intégrée

## Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── api/studio/         # API save/load éditeur
│   ├── simulateur/         # Page iframe studio 3D
│   └── ...
├── components/
│   ├── EditorWrapper.tsx   # Contexte éditeur + boutons
│   ├── EditableImage.tsx   # Image cliquable en mode éditeur
│   ├── EditableText.tsx    # Texte éditable
│   ├── Header.tsx          # Navigation principale
│   └── ...
└── data/
    └── editor-overrides.json  # Overrides sauvegardés

public/
├── studio-3d.html          # Studio 3D standalone (Three.js)
└── image/                  # Médias (non versionnés — gitignore)
```

## Images

Les images (`public/image/`) ne sont **pas versionnées** sur GitHub (trop volumineuses).  
Elles sont stockées localement et dans Dropbox : `E:\Dropbox\1💼_MULTIPOLES\Media\`

## Déploiement VPS

```bash
npm run build
scp -r .next root@72.60.45.230:/docker/multipoles-v3/
```

---

**Multipoles** — 53 rue des Deux Communes, 93100 Montreuil | 01 43 91 17 71
