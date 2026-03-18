# Multi-Poles — Site Vitrine

Site web professionnel pour **Multi-Poles**, GIE specialise PLV, packaging et impression pour la cosmetique et la pharmacie depuis 1995.

**URL live** : https://multi-poles.cloud
**Repo** : https://github.com/jeyiop/site-MP-V2

---

## Demarrage rapide

```bash
# Cloner
git clone git@github.com:jeyiop/site-MP-V2.git SiteMP_CODEX
cd SiteMP_CODEX

# Installer
npm install

# Lancer en dev
npm run dev -- --port 3002
# → http://localhost:3002
```

---

## Stack technique

| Tech | Version |
|------|---------|
| Next.js | 15.5.6 (App Router + Turbopack) |
| React | 19 |
| TypeScript | 5.9 |
| Tailwind CSS | v4 |
| Framer Motion | 12 |
| Three.js | 0.170 (studio 3D standalone) |

---

## Pages

| Route | Description | Editable |
|-------|-------------|----------|
| `/` | Accueil — carousel hero 7 slides, categories, vitrine 16 images, video, FAQ | Oui |
| `/solutions` | 4 solutions (PLV, Packaging, Impression, Devis 3D) | Oui |
| `/apropos` | Histoire, valeurs, certifications | Oui |
| `/simulateur` | Studio 3D PLV & Packaging (iframe studio-3d.html) | Via studio |
| `/contact` | Formulaire de contact | Non |
| `/devis` | Demande de devis | Non |

---

## Editeur visuel

### Activation
Bouton **Editeur** en bas a droite de toutes les pages.

### Fonctionnalites
- **Clic sur image** → galerie pour remplacer (dossiers dans `public/media/`)
- **Clic sur texte** → edition inline
- **Zoom/recadrage** → molette + drag sur les images
- **Blocs libres** → creer des blocs texte/image positionnables (scopes par page)
- **Sauvegarder** → ecrit dans `/data/editor-overrides.json` (volume Docker en prod)
- **Export/Import JSON** → backup des modifications

### Conventions editorKey

| Prefixe | Page |
|---------|------|
| `hero-N`, `hero-title-N` | Home (slides) |
| `sf-product-*`, `vitrine-N` | Home (categories, vitrine) |
| `sol-*` | Solutions |
| `apropos-*` | A propos |
| `header-*` | Header global |

### API editeur

```
GET  /api/studio/load    → charge les overrides
POST /api/studio/save    → sauvegarde les overrides
GET  /api/media?dir=...  → liste les images de la bibliotheque
GET  /api/media/serve?path=...  → sert une image
```

---

## Studio 3D

Fichier standalone : `public/studio-3d.html`
Accessible via : `/simulateur`

### Modes
- **PLV de sol** — etageres, facing, profondeur, fronton configurable
- **Packaging** — dimensions boite, impression, finition, papier

### 5 Themes
Light Navy (defaut), Full White, Navy Glass, Warm pro, Studio neutre

### Fonctionnalites devis
- Resume du brief automatique
- Boutons DEMANDE DE PRIX / ENVOYER / upload fichiers
- Email vers jeremy@multi-poles.net

---

## Images

### Dossiers

| Dossier | Contenu |
|---------|---------|
| `public/image/production/` | Images finales (overrides compresses) |
| `public/image/selecta/` | Images de base (hero, logo, savoir-faire) |
| `public/media/` | Bibliotheque editeur (12 dossiers, 90 images) |
| `public/video/` | Video presentation |

### Compression
Toutes les images sont compressees avec sharp (max 1920px, quality 85).
`public/` total : ~143 Mo.

---

## Deploiement production

### VPS Hostinger
- **IP** : 72.60.45.230
- **SSH** : `ssh -i ~/.ssh/claude_vps_key root@72.60.45.230` (cle uniquement)
- **Architecture** : Docker container → Nginx reverse proxy HTTPS
- **SSL** : Let's Encrypt (auto-renew)

### Commandes de deploiement

```bash
# 1. Build
npm run build

# 2. Transfert
scp -r -i ~/.ssh/claude_vps_key .next/standalone/.next root@72.60.45.230:/var/www/multi-poles.cloud/app/.next
scp -r -i ~/.ssh/claude_vps_key .next/static root@72.60.45.230:/var/www/multi-poles.cloud/app/.next/static
scp -r -i ~/.ssh/claude_vps_key public root@72.60.45.230:/var/www/multi-poles.cloud/app/public

# 3. Fix permissions + rebuild Docker
ssh -i ~/.ssh/claude_vps_key root@72.60.45.230 "
  chown -R www-data:www-data /var/www/multi-poles.cloud/app/public/
  cd /var/www/multi-poles.cloud && docker compose up -d --build
"
```

### Architecture VPS
```
Internet → Nginx (HTTPS/443)
             ├── /image/, /video/ → fichiers statiques (Nginx direct)
             ├── /_next/static/   → cache immutable (Nginx)
             └── /*               → Docker container Next.js (port 3000)
```

### Securite VPS
- SSH cle uniquement (PasswordAuthentication no)
- fail2ban (3 essais, ban 24h)
- UFW (ports 22, 80, 443 uniquement)
- Docker container isole (mem 512M, cpu 1.5)
- Headers securite (X-Frame, X-Content-Type, XSS-Protection)

---

## Dossiers du projet

| Dossier | Localisation | Usage |
|---------|-------------|-------|
| **SiteMP_CODEX** | `C:\Users\jerem_07fes6p\SiteMP_CODEX\` | Version de travail (dev + deploy) |
| **BOXSITEMP** | `E:\Dropbox\7_APP_SANDOX\BOXSITEMP\` | Copie offline reference |
| **BOXSITEMP_OPTIM** | `E:\Dropbox\7_APP_SANDOX\BOXSITEMP_OPTIM\` | Backup pre-optimisation |
| **ARCHIVES** | `E:\Dropbox\7_APP_SANDOX\ARCHIVES_SITEMP\` | Anciennes versions archivees |
| **Builder** | `C:\Users\jerem_07fes6p\SiteMP_CODEX_BUILDER\` | Builder offline (port 3003) |

---

## Couleurs

| Usage | Hex |
|-------|-----|
| Navy principal | `#000B58` |
| Fond | `#FFFFFF` |
| Accent or | `#D4A017` |
| Accent orange | `#FF6B00` |

---

## Entreprise

**Multi-Poles** — GIE Imprimeur Cartonnier Volumiste
53 rue des Deux Communes — 93100 Montreuil
Tel : 01 43 91 17 71
Email : jeremy@multi-poles.net
Reseau GIE : Cartoneo (PLV) + Freller (pharma/cosmetique)
