# Changelog Session — 07 mars 2026
## Projet : SiteMP_CODEX — Site Vitrine Multipoles
## Dossier de référence : `C:\Users\jerem_07fes6p\SiteMP_CODEX\`

---

## 1. Réduction du Hero (-10%)

**Fichier modifié** : `src/app/page.tsx`

| Propriété | Avant | Après |
|---|---|---|
| Hauteur hero | `h-[74vh] min-h-[380px]` | `h-[67vh] min-h-[342px]` |
| Largeur card (défaut) | `cardWidth ?? 484` | `cardWidth ?? 436` |
| Largeur card (Math.max) | `Math.max(260, Math.min(640, ...))` | `Math.max(234, Math.min(576, ...))` |

---

## 2. Images service et vitrine — passage à object-cover

**Fichier modifié** : `src/app/page.tsx`

### Section Services (cartes expertises)

**Avant** :
```tsx
<div className="mb-5 rounded-xl overflow-hidden bg-gray-50 p-2">
  <div className="relative aspect-[4/3] w-full">
    <EditableImage ... className="object-contain" />
```

**Après** :
```tsx
<div className="mb-5 overflow-hidden rounded-xl">
  <div className="relative aspect-[4/3] w-full">
    <EditableImage ... className="object-cover" />
```

**Changements** : suppression `bg-gray-50 p-2` + `object-contain` → `object-cover`

### Section Vitrine (cartes projets)

**Avant** :
```tsx
<div className="relative mb-4 overflow-hidden rounded-xl bg-gray-50 p-1.5">
  <div className="relative aspect-[16/10] w-full">
    <EditableImage ... className="object-contain" />
```

**Après** :
```tsx
<div className="relative mb-4 overflow-hidden rounded-xl">
  <div className="relative aspect-[16/10] w-full">
    <EditableImage ... className="object-cover" />
```

**Changements** : suppression `bg-gray-50 p-1.5` + `object-contain` → `object-cover`

---

## 3. Hero image container — suppression bg-white

**Fichier modifié** : `src/app/page.tsx`, ligne ~434

**Avant** :
```tsx
<div className={`flex-1 h-full relative rounded-xl overflow-hidden bg-white ${editorMode ? 'z-30' : ''}`}>
```

**Après** :
```tsx
<div className={`flex-1 h-full relative rounded-xl overflow-hidden ${editorMode ? 'z-30' : ''}`}>
```

**Raison** : bg-white retiré car toutes les images hero sont désormais en 16:9 (object-cover couvre tout le cadre sans laisser de fond blanc).

---

## 4. Recadrage automatique des images hero (16:9)

**Script créé** : `scripts/resize-hero-images.py`

Script Python (PIL/Pillow) de center-crop vers ratio uniforme.

**Usage** :
```bash
python scripts/resize-hero-images.py              # crop 16:9 avec backup
python scripts/resize-hero-images.py --dry-run    # preview sans modifier
python scripts/resize-hero-images.py --ratio 2:1  # ratio personnalisé
python scripts/resize-hero-images.py --no-backup  # sans backup
```

### Images recadrées (session 07/03/2026)

| Image | Dimensions avant | Dimensions après | Ratio avant | Ratio après |
|---|---|---|---|---|
| hero-01-collage.jpg | 2816×1536 | 2730×1536 | 1.83 | 1.78 (16:9) |
| hero-01.jpg | 2816×1536 | 2730×1536 | 1.83 | 1.78 (16:9) |
| hero-02.jpg | 2816×1536 | 2730×1536 | 1.83 | 1.78 (16:9) |
| hero-03.jpg | 2816×1536 | 2730×1536 | 1.83 | 1.78 (16:9) |
| hero-04.jpg | 2816×1536 | 2730×1536 | 1.83 | 1.78 (16:9) |
| hero-05.jpg | 2400×1792 | 2400×1350 | 1.34 | 1.78 (16:9) |
| hero-06.png | 1600×1131 | 1600×900 | 1.41 | 1.78 (16:9) |
| hero-07.png | 1536×1024 | 1536×864 | 1.50 | 1.78 (16:9) |

**Backup des originaux** : `public/image/selecta/hero/backup/`

**Problème résolu** : les slides 5, 6, 7 avaient des ratios différents des autres, causant des débordements ou des fonds blancs visibles. Toutes les images sont maintenant uniformément en 16:9.

---

## 5. Fonctionnalité IA Inspire-moi (session précédente — commit GitHub)

**Route créée** : `src/app/api/studio/ai-propose/route.ts`

- Endpoint `POST /api/studio/ai-propose`
- Body : `{ "brief": "texte du client" }`
- Response : `{ "proposals": [ { titre, description, type, theme, config } ] }`
- Modèle : `claude-sonnet-4-6`
- Requires : `ANTHROPIC_API_KEY` dans `.env.local`

---

## 6. Maquettes de design alternatives (archivées)

4 versions de design ont été créées dans `public/` pour exploration :

| Dossier | Concept | Statut |
|---|---|---|
| `public/design-a/` | Editorial Premium (Playfair + navy/gold) | Rejeté — archivé |
| `public/design-b/` | Tech Industriel (DM Sans, split asymétrique) | Rejeté — archivé |
| `public/design-c/` | French Craft (Cormorant Garamond, ivory/gold) | Rejeté — archivé |
| `public/design-d/` | Original Modernisé (Inter, CSS vars) | Rejeté — archivé |

Décision : retour au design original `main` — ces fichiers peuvent être supprimés ou conservés comme référence.

---

## Etat du projet au 07/03/2026

- **Port dev** : 3002 (`npm run dev`)
- **Stack** : Next.js 15.5.6, React 19, TypeScript, Tailwind v4, Framer Motion
- **Couleur principale** : `#000B58` (navy)
- **GitHub** : jeyiop/site-MP-V2 (à mettre à jour)
- **Pages** : `/` · `/solutions` · `/realisations` · `/apropos` · `/contact` · `/devis` · `/blog` · `/simulateur` · `/studio`
- **Editeur visuel** : `/studio` — localStorage `codex_site_mp_overrides`
- **Contenu centralisé** : `src/content/site-content.ts`
- **Hook contenu** : `src/hooks/use-site-content.ts`

---

## Autres dossiers sites — A ARCHIVER

Ces dossiers ne sont plus le projet de référence :

| Dossier | Description | Action |
|---|---|---|
| `C:\Users\jerem_07fes6p\SiteMP_Sonnet\` | Ancienne version Next.js port 3005 | Archiver |
| `E:\Dropbox\7_APP_SANDOX\PROJECT_SITE_WEB_MULTIPOLES\` | Archives Dropbox multiples versions | Conserver archives |
| `E:\Dropbox\1💼_MULTIPOLES\SiteMP_V3\` | Dossier Dropbox SiteMP V3 | Archiver |

**LE SEUL DOSSIER DE REFERENCE** : `C:\Users\jerem_07fes6p\SiteMP_CODEX\`
