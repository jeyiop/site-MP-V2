#!/usr/bin/env python3
"""
resize-hero-images.py
Center-crop les images hero vers un ratio cible uniforme.

Usage:
  python scripts/resize-hero-images.py              # crop en 16:9, avec backup
  python scripts/resize-hero-images.py --dry-run    # preview sans modifier
  python scripts/resize-hero-images.py --ratio 2:1  # ratio personnalise
  python scripts/resize-hero-images.py --no-backup  # sans backup
"""

import os
import shutil
import argparse
from PIL import Image

HERO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'image', 'selecta', 'hero')
BACKUP_DIR = os.path.join(HERO_DIR, 'backup')
SUPPORTED = ('.jpg', '.jpeg', '.png', '.webp')


def center_crop(img: Image.Image, target_ratio: float) -> Image.Image:
    """Center-crop l'image vers le ratio cible (width/height)."""
    w, h = img.size
    current_ratio = w / h

    if abs(current_ratio - target_ratio) < 0.01:
        return img  # deja au bon ratio

    if current_ratio > target_ratio:
        # Image trop large : rogner les cotes
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        return img.crop((left, 0, left + new_w, h))
    else:
        # Image trop haute : rogner haut/bas
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        return img.crop((0, top, w, top + new_h))


def process(dry_run: bool, target_ratio: float, ratio_str: str, do_backup: bool):
    hero_dir = os.path.normpath(HERO_DIR)

    if not os.path.isdir(hero_dir):
        print(f"Dossier introuvable : {hero_dir}")
        return

    images = [
        f for f in os.listdir(hero_dir)
        if f.lower().endswith(SUPPORTED) and os.path.isfile(os.path.join(hero_dir, f))
    ]

    if not images:
        print("Aucune image trouvee dans", hero_dir)
        return

    if do_backup and not dry_run:
        os.makedirs(BACKUP_DIR, exist_ok=True)
        print(f"Backup automatique -> {BACKUP_DIR}\n")

    print(f"Ratio cible : {ratio_str} ({target_ratio:.4f})")
    print(f"Mode : {'DRY-RUN (aucune modification)' if dry_run else 'LIVE'}\n")
    print(f"{'Fichier':<32} {'Avant':>12}  {'Apres':>12}  Statut")
    print("-" * 72)

    changed = 0
    for filename in sorted(images):
        path = os.path.join(hero_dir, filename)
        img = Image.open(path)
        w, h = img.size
        current_ratio = w / h

        if abs(current_ratio - target_ratio) < 0.01:
            print(f"{filename:<32} {w}x{h:>6}  {'':>12}  OK (ratio deja correct)")
            continue

        cropped = center_crop(img, target_ratio)
        cw, ch = cropped.size
        changed += 1

        status = "[dry-run]" if dry_run else "sauvegarde"
        print(f"{filename:<32} {w}x{h:>6}  {cw}x{ch:>6}  {status}")

        if not dry_run:
            if do_backup:
                shutil.copy2(path, os.path.join(BACKUP_DIR, filename))

            ext = os.path.splitext(filename)[1].lower()
            if ext in ('.jpg', '.jpeg'):
                cropped.save(path, quality=95, optimize=True)
            elif ext == '.png':
                cropped.save(path, optimize=True)
            else:
                cropped.save(path)

    print("-" * 72)
    if dry_run:
        print(f"\n{changed} image(s) seraient modifiees. Relancer sans --dry-run pour appliquer.")
    else:
        print(f"\n{changed} image(s) recadree(s).")
        if do_backup and changed > 0:
            print(f"Originaux sauvegardes dans : {BACKUP_DIR}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Center-crop les images hero vers un ratio uniforme.')
    parser.add_argument('--ratio', default='16:9', help='Ratio cible W:H (defaut: 16:9)')
    parser.add_argument('--dry-run', action='store_true', help='Preview sans modifier les fichiers')
    parser.add_argument('--no-backup', action='store_true', help='Ne pas creer de backup')
    args = parser.parse_args()

    parts = args.ratio.split(':')
    if len(parts) != 2:
        print("Format ratio invalide. Utiliser W:H — ex: 16:9 ou 2:1")
        exit(1)

    try:
        target_ratio = float(parts[0]) / float(parts[1])
    except ValueError:
        print("Valeurs numeriques invalides dans le ratio.")
        exit(1)

    process(args.dry_run, target_ratio, args.ratio, do_backup=not args.no_backup)
