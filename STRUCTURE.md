# Structure du Site Multi-Poles

## Architecture

```
SiteMP_CODEX/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx            # Homepage (hero carousel, categories, vitrine, FAQ, video)
│   │   ├── solutions/          # Page Solutions (4 cartes editables)
│   │   ├── apropos/            # Page A propos (histoire, valeurs, certifications)
│   │   ├── contact/            # Page Contact (formulaire)
│   │   ├── devis/              # Page Devis
│   │   ├── simulateur/         # Simulateur 3D (iframe vers studio-3d.html)
│   │   ├── brouillon*/         # Brouillons prototypes (NE PAS MODIFIER 1 et 2)
│   │   ├── api/
│   │   │   ├── media/
│   │   │   │   ├── route.ts    # Liste les images de public/media/ (GET /api/media?dir=...)
│   │   │   │   └── serve/
│   │   │   │       └── route.ts # Sert une image (GET /api/media/serve?path=...)
│   │   │   └── studio/
│   │   │       ├── load/route.ts  # Charge editor-overrides.json (GET)
│   │   │       └── save/route.ts  # Sauvegarde editor-overrides.json (POST)
│   │   └── layout.tsx          # Layout global (EditorWrapper + Header + Footer)
│   │
│   ├── components/
│   │   ├── Header.tsx          # Header avec nav, tel, DEVIS 3D, Imprim'Vert
│   │   ├── Footer.tsx          # Footer avec liens, contact, legal
│   │   ├── EditableImage.tsx   # Image cliquable en mode editeur (galerie + crop + filters)
│   │   ├── EditableText.tsx    # Texte editable inline en mode editeur
│   │   ├── EditorWrapper.tsx   # Provider contexte editeur (overrides, blocs libres, sauvegarde)
│   │   ├── EditorBlockLayer.tsx # Blocs libres drag&drop (scope par page)
│   │   └── MainWrapper.tsx     # Gere padding-top header
│   │
│   ├── data/
│   │   ├── editor-overrides.json    # Overrides images/textes/transforms (SSR + client)
│   │   └── production-images.json   # Mapping editorKey -> chemin statique
│   │
│   └── hooks/
│       ├── use-editor-carousel.ts   # Carousel hero avec controle editeur
│       └── use-site-content.ts      # Contenu centralise
│
├── public/
│   ├── image/
│   │   ├── production/         # Images finales utilisees par les overrides (compressees)
│   │   └── selecta/            # Images de base (hero, logo, savoir-faire)
│   ├── media/                  # Bibliotheque editeur (Hero, Logos, Savoir-faire, Gemini, etc.)
│   ├── video/                  # Video presentation
│   └── studio-3d.html          # Studio 3D standalone (Three.js, 5 themes)
│
├── data/
│   └── editor-overrides.json   # Copie pour Docker volume (/app/data)
│
└── STRUCTURE.md                # Ce fichier
```

## Systeme d'edition

### Comment ca marche

1. **Bouton "Editeur"** (bas droite) active le mode edition
2. **Cliquer sur une image** → ouvre la galerie pour la remplacer
3. **Cliquer sur un texte** → edition inline
4. **Bouton "Sauvegarder"** → envoie les overrides au serveur (POST /api/studio/save)

### Scope par page

- Les **images et textes** sont identifies par `editorKey` (ex: `hero-0`, `apropos-hero`)
- Les **blocs libres** sont scopes par page (`page` property = pathname)
- Un bloc cree sur `/apropos` n'apparait que sur `/apropos`

### Chargement des overrides

1. **SSR** : `EditorWrapper` importe `editor-overrides.json` statiquement → pas de flash
2. **Client** : charge depuis `/api/studio/load` pour les modifications recentes
3. **Fallback** : localStorage

### Conventions editorKey

| Prefixe | Page | Exemple |
|---------|------|---------|
| `hero-N` | Home (slides) | `hero-0`, `hero-1` |
| `hero-title-N` | Home (textes slides) | `hero-title-0` |
| `sf-product-*` | Home (categories) | `sf-product-plv` |
| `vitrine-N` | Home (grille realisations) | `vitrine-1` |
| `sol-*` | Solutions | `sol-plv`, `sol-packaging` |
| `apropos-*` | A propos | `apropos-hero`, `apropos-val-0` |
| `header-*` | Header global | `header-logo`, `header-imprim-vert` |

## Studio 3D

Fichier standalone : `public/studio-3d.html`

### Themes disponibles
- **Light Navy** (defaut) — navy + or
- **Full White** — blanc pur + orange
- **Navy Glass** — glass + cyan
- **Warm pro** — tons chauds
- **Studio neutre** — gris pro

### Fonctionnalites
- Mode PLV (etages, facing, profondeur, fronton configurable)
- Mode Packaging (dimensions boite, impression, finition, papier)
- Resume du brief automatique
- Boutons DEMANDE DE PRIX / ENVOYER / upload fichiers
- Email vers jeremy@multi-poles.net

## Deploiement

### Local (dev)
```bash
cd SiteMP_CODEX
npm run dev -- --port 3002
```

### Production (VPS)
```bash
# Build
npm run build

# Transfert
scp -r -i ~/.ssh/claude_vps_key .next/standalone/.next root@72.60.45.230:/var/www/multi-poles.cloud/app/.next
scp -r -i ~/.ssh/claude_vps_key .next/static root@72.60.45.230:/var/www/multi-poles.cloud/app/.next/static
scp -r -i ~/.ssh/claude_vps_key public root@72.60.45.230:/var/www/multi-poles.cloud/app/public

# Relancer Docker
ssh -i ~/.ssh/claude_vps_key root@72.60.45.230 "cd /var/www/multi-poles.cloud && docker compose up -d --build"

# Fix permissions images (pour Nginx)
ssh -i ~/.ssh/claude_vps_key root@72.60.45.230 "chown -R www-data:www-data /var/www/multi-poles.cloud/app/public/"
```

### Architecture VPS
```
Internet → Nginx (HTTPS/443) → Docker container (port 3000)
                              → Fichiers statiques (/image/, /video/) servis par Nginx
```

## Couleurs

| Usage | Hex | Variable |
|-------|-----|----------|
| Navy principal | `#000B58` | `--foreground` |
| Fond | `#FFFFFF` | `--background` |
| Accent or | `#D4A017` | - |
| Accent orange | `#FF6B00` | `--neon-orange` |
