'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useEditor, DEFAULT_FILTER, ImageFilter, FrameSize } from '@/components/EditorWrapper';

// ─── Catalogue images ────────────────────────────────────────
const IMAGE_GALLERY = [
  { category: 'Hero', images: ['/image/selecta/hero/hero-01-collage.jpg','/image/selecta/hero/hero-01.jpg','/image/selecta/hero/hero-02.jpg','/image/selecta/hero/hero-03.jpg','/image/selecta/hero/hero-04.jpg','/image/selecta/hero/hero-05.jpg','/image/selecta/hero/hero-06.png','/image/selecta/hero/hero-07.png'] },
  { category: 'Savoir-faire', images: ['/image/selecta/savoir-faire/sf-packaging.png','/image/selecta/savoir-faire/sf-plv.png','/image/selecta/savoir-faire/sf-print.png','/image/selecta/savoir-faire/sf-studio.jpg'] },
  { category: 'Vitrine', images: ['/image/selecta/vitrine/vitrine-ilv-01.jpg','/image/selecta/vitrine/vitrine-ilv-02.jpg','/image/selecta/vitrine/vitrine-packaging-01.jpg','/image/selecta/vitrine/vitrine-packaging-02.jpg','/image/selecta/vitrine/vitrine-packaging-03.jpg','/image/selecta/vitrine/vitrine-packaging-04.jpg','/image/selecta/vitrine/vitrine-plv-comptoir-01.jpg','/image/selecta/vitrine/vitrine-plv-comptoir-02.jpg','/image/selecta/vitrine/vitrine-plv-comptoir-03.jpg','/image/selecta/vitrine/vitrine-plv-lineaire-01.jpg','/image/selecta/vitrine/vitrine-plv-sol-01.jpg','/image/selecta/vitrine/vitrine-plv-sol-02.jpg'] },
  { category: 'Réalisations', images: ['/image/realisations/realisations-01.webp','/image/realisations/realisations-02.webp','/image/realisations/realisations-03.webp','/image/realisations/realisations-04.webp'] },
  { category: 'Divers', images: ['/image/slider-live-kraft/kraft-gamme-01.jpg','/image/slider-live-kraft/kraft-gamme-02.jpg','/image/slider-live-kraft/kraft-gamme-03.jpg','/image/003ab1236756873.68f226d5e8204.webp','/image/2a5c5c211072581.671be4b87df2e.webp','/image/950e4c236909363.68f623758ca51 copy.webp'] },
  { category: 'Logos', images: ['/image/selecta/logo/logo-multipoles-v2-header.png','/image/selecta/logo/logo-multipoles-transparent.png','/image/selecta/logo/logo-A.png','/image/selecta/logo/logo-B.png','/image/selecta/logo/logo-C.png','/image/selecta/logo/logo-X.png','/image/selecta/logo/logo-blanc-transparent.png','/image/selecta/logo/logo-final.png','/image/selecta/logo/logo-navy-transparent.png','/image/selecta/logo/logo-original-transparent.png','/image/selecta/logo/logo-transparent.png','/image/selecta/logo/logo-white-v2.jpg','/image/selecta/logo/logo-white-v3.jpg','/image/selecta/logo/serve.avif','/image/selecta/logo/logo-multipoles-v2-header.avif','/image/selecta/logo/Gemini_Generated_Image_ofpngdofpngdofpn.png','/image/selecta/logo/logo fon bleu.jpg','/image/selecta/logo/Gemini_Generated_Image_8xkgbr8xkgbr8xkg.png','/image/selecta/logo/imprim-vert-logo.png','/image/selecta/logo/imprim-vert-badge.webp'] },
  { category: 'Logo Templates', images: ['/image/logo-template/logo-multipoles-neon-transparent.png','/image/logo-template/Gemini_Generated_Image_a8mgbaa8mgbaa8mg.png','/image/logo-template/Gemini_Generated_Image_msu5u7msu5u7msu5.png','/image/logo-template/logo A.png','/image/logo-template/logo b.png','/image/logo-template/logo c.png','/image/logo-template/logo x.png','/image/logo-template/Gemini_Generated_Image_c77ma9c77ma9c77m.jpg','/image/logo-template/Gemini_Generated_Image_c77ma9c77ma9c77m (1).jpg'] },
];

// ─── Presets filtres ─────────────────────────────────────────
const FILTER_PRESETS = [
  { key: 'normal',  label: 'Normal',  brightness: 1,    contrast: 1,    saturation: 1,    temperature: 0,   accent: '#888' },
  { key: 'vivid',   label: 'Vivid',   brightness: 1.05, contrast: 1.2,  saturation: 1.5,  temperature: 5,   accent: '#ff6b35' },
  { key: 'matte',   label: 'Matte',   brightness: 1.1,  contrast: 0.85, saturation: 0.75, temperature: 0,   accent: '#b0a090' },
  { key: 'chrome',  label: 'Chrome',  brightness: 1.05, contrast: 1.3,  saturation: 0.5,  temperature: -5,  accent: '#7c8fa0' },
  { key: 'fade',    label: 'Fade',    brightness: 1.2,  contrast: 0.8,  saturation: 0.7,  temperature: 0,   accent: '#d4c5b0' },
  { key: 'cool',    label: 'Cool',    brightness: 1,    contrast: 1.05, saturation: 1.1,  temperature: -35, accent: '#5588cc' },
  { key: 'warm',    label: 'Warm',    brightness: 1.05, contrast: 1,    saturation: 1.1,  temperature: 35,  accent: '#dd8833' },
  { key: 'noir',    label: 'N&B',     brightness: 0.95, contrast: 1.15, saturation: 0,    temperature: 0,   accent: '#444' },
];

// ─── Filter CSS helper ───────────────────────────────────────
function filterToCSS(f: ImageFilter): string {
  const parts: string[] = [];
  if (f.brightness !== 1) parts.push(`brightness(${f.brightness.toFixed(2)})`);
  if (f.contrast   !== 1) parts.push(`contrast(${f.contrast.toFixed(2)})`);
  if (f.saturation !== 1) parts.push(`saturate(${f.saturation.toFixed(2)})`);
  return parts.join(' ') || '';
}

// ─── Temperature overlay ─────────────────────────────────────
function TempOverlay({ temperature }: { temperature: number }) {
  if (!temperature) return null;
  const abs   = Math.abs(temperature);
  const alpha = (abs / 50) * 0.22;
  const color = temperature > 0
    ? `rgba(255, 140, 30, ${alpha})`
    : `rgba(80, 160, 255, ${alpha})`;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
      backgroundColor: color,
      mixBlendMode: (temperature > 0 ? 'multiply' : 'screen') as React.CSSProperties['mixBlendMode'],
    }} />
  );
}

// ─── FilterPanel (portal) ────────────────────────────────────
function FilterPanel({ containerRef, filter, onFilterChange, onClose }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filter: ImageFilter;
  onFilterChange: (f: ImageFilter) => void;
  onClose: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [containerRef]);

  if (!rect || typeof document === 'undefined') return null;

  const panelTop  = rect.bottom + window.scrollY + 8;
  const panelLeft = Math.max(8, Math.min(rect.left, window.innerWidth - 360));

  const SliderField = ({ label, value, min, max, step, onChange, display }: {
    label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; display?: string;
  }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 88, fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: '#ffd580', cursor: 'pointer' }} />
      <span style={{ width: 36, fontSize: 11, color: '#ffd580', textAlign: 'right', fontWeight: 700 }}>{display ?? value}</span>
    </div>
  );

  return createPortal(
    <div
      onPointerDown={e => e.stopPropagation()}
      style={{
        position: 'absolute', top: panelTop, left: panelLeft, zIndex: 999998,
        backgroundColor: 'rgba(0,11,88,0.95)', backdropFilter: 'blur(16px)',
        borderRadius: 12, padding: '14px 16px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.15)', width: 340, display: 'flex',
        flexDirection: 'column', gap: 12,
      }}
    >
      {/* Presets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FILTER_PRESETS.map(p => (
          <button key={p.key}
            onClick={() => onFilterChange({ brightness: p.brightness, contrast: p.contrast, saturation: p.saturation, temperature: p.temperature, preset: p.key })}
            style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              border: filter.preset === p.key ? `2px solid ${p.accent}` : '2px solid rgba(255,255,255,0.15)',
              backgroundColor: filter.preset === p.key ? p.accent + '33' : 'rgba(255,255,255,0.08)',
              color: filter.preset === p.key ? '#fff' : 'rgba(255,255,255,0.7)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: p.accent, marginRight: 5 }} />
            {p.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Sliders */}
      <SliderField label="Luminosité" value={filter.brightness} min={0.5} max={1.5} step={0.05}
        display={`${Math.round(filter.brightness * 100)}%`}
        onChange={v => onFilterChange({ ...filter, brightness: v, preset: 'custom' })} />
      <SliderField label="Contraste" value={filter.contrast} min={0.5} max={1.5} step={0.05}
        display={`${Math.round(filter.contrast * 100)}%`}
        onChange={v => onFilterChange({ ...filter, contrast: v, preset: 'custom' })} />
      <SliderField label="Saturation" value={filter.saturation} min={0} max={2} step={0.05}
        display={`${Math.round(filter.saturation * 100)}%`}
        onChange={v => onFilterChange({ ...filter, saturation: v, preset: 'custom' })} />
      <SliderField label="Chaleur" value={filter.temperature} min={-50} max={50} step={1}
        display={filter.temperature === 0 ? '0' : filter.temperature > 0 ? `+${filter.temperature}°` : `${filter.temperature}°`}
        onChange={v => onFilterChange({ ...filter, temperature: v, preset: 'custom' })} />

      {/* Reset + Close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
        <button onClick={() => onFilterChange(DEFAULT_FILTER)}
          style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)' }}>
          Réinitialiser
        </button>
        <button onClick={onClose}
          style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: 'none', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' }}>
          Fermer
        </button>
      </div>
    </div>,
    document.body
  );
}

// ─── ResizeHandles (portal) ──────────────────────────────────
function ResizeHandles({ containerRef, editorKey, setFrameSize }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  editorKey: string;
  setFrameSize: (key: string, s: FrameSize | null) => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [containerRef]);

  if (!rect || typeof document === 'undefined') return null;

  const cx = (rect.left + rect.right) / 2;
  const cy = (rect.top  + rect.bottom) / 2;

  const handles = [
    { id: 'nw', x: rect.left,  y: rect.top    },
    { id: 'n',  x: cx,         y: rect.top    },
    { id: 'ne', x: rect.right, y: rect.top    },
    { id: 'e',  x: rect.right, y: cy          },
    { id: 'se', x: rect.right, y: rect.bottom },
    { id: 's',  x: cx,         y: rect.bottom },
    { id: 'sw', x: rect.left,  y: rect.bottom },
    { id: 'w',  x: rect.left,  y: cy          },
  ];

  const getCursor = (id: string) => {
    const map: Record<string, string> = { nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize', s: 's-resize', sw: 'sw-resize', w: 'w-resize' };
    return map[id] ?? 'pointer';
  };

  const startResize = (e: React.PointerEvent<HTMLDivElement>, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = rect.width;
    const startH = rect.height;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let w = startW;
      let h = startH;
      if (handle.includes('e')) w = Math.max(80, startW + dx);
      if (handle.includes('w')) w = Math.max(80, startW - dx);
      if (handle.includes('s')) h = Math.max(60, startH + dy);
      if (handle.includes('n')) h = Math.max(60, startH - dy);
      setFrameSize(editorKey, { w, h });
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  return createPortal(
    <>
      {handles.map(h => (
        <div key={h.id}
          onPointerDown={e => startResize(e, h.id)}
          style={{
            position: 'fixed',
            left: h.x - 5,
            top:  h.y - 5,
            width: 10, height: 10,
            backgroundColor: '#fff',
            border: '2px solid #000B58',
            borderRadius: 2,
            cursor: getCursor(h.id),
            zIndex: 999997,
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </>,
    document.body
  );
}

// ─── Image utilities ─────────────────────────────────────────
function resizeImage(file: File, maxWidth: number, quality: number): Promise<string> {
  const isPng = file.type === 'image/png';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width; let h = img.height;
        if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('no ctx'));
        if (!isPng) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImgThumb({ src, label, onClick }: { src: string; label: string; onClick: () => void }) {
  const isPng  = label.toLowerCase().endsWith('.png') || src.includes('image/png');
  const thumbBg = isPng ? '#000B58' : '#f9fafb';
  return (
    <button onClick={onClick} style={{ border: '2px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', background: thumbBg, padding: 0, transition: 'border-color 0.15s, transform 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000B58'; e.currentTarget.style.transform = 'scale(1.03)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'scale(1)'; }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} loading="lazy" />
      </div>
      <div style={{ padding: '4px 6px', fontSize: '10px', color: isPng ? '#aef' : '#666', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {isPng && <span style={{ fontSize: '8px', background: '#22c55e', color: '#fff', borderRadius: '3px', padding: '0 3px', marginRight: '3px' }}>PNG</span>}
        {label}
      </div>
    </button>
  );
}

function MediaTab({ onSelect }: { onSelect: (url: string) => void }) {
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [dirs,  setDirs]   = useState<string[]>([]);
  const [files, setFiles]  = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const currentPath = breadcrumb.join('/');
  useEffect(() => {
    setLoading(true);
    fetch(`/api/media?dir=${encodeURIComponent(currentPath)}`).then(r => r.json()).then(d => { setDirs(d.dirs ?? []); setFiles(d.files ?? []); }).catch(() => { setDirs([]); setFiles([]); }).finally(() => setLoading(false));
  }, [currentPath]);
  const enter = (n: string) => setBreadcrumb(p => [...p, n]);
  const goTo  = (i: number) => setBreadcrumb(p => p.slice(0, i));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => goTo(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000B58', fontWeight: 600, padding: '2px 4px' }}>Media</button>
        {breadcrumb.map((s, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ color: '#aaa' }}>/</span><button onClick={() => goTo(i+1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: i === breadcrumb.length-1 ? '#374151' : '#000B58', fontWeight: 600, padding: '2px 4px' }}>{s}</button></span>)}
      </div>
      {loading && <div style={{ color: '#888', fontSize: '13px' }}>Chargement…</div>}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {dirs.map(d => <button key={d} onClick={() => enter(d)} style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '12px 8px', cursor: 'pointer', background: '#f0f4ff', fontWeight: 600, fontSize: '12px', color: '#000B58', textAlign: 'center', transition: 'border-color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#000B58')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>📁 {d}</button>)}
          {files.map(f => { const p = currentPath ? `${currentPath}/${f}` : f; const url = `/api/media/serve?path=${encodeURIComponent(p)}`; return <ImgThumb key={f} src={url} label={f} onClick={() => onSelect(url)} />; })}
          {dirs.length === 0 && files.length === 0 && <div style={{ color: '#888', fontSize: '13px', gridColumn: '1/-1' }}>Dossier vide</div>}
        </div>
      )}
    </div>
  );
}

const MEDIA_TAB_IDX = -1; // special sentinel for the full Dropbox browser
const DROPBOX_TAB_OFFSET = IMAGE_GALLERY.length;

// Folders to skip (no images, docs only, or duplicates)
const SKIP_DIRS = new Set(['BE_PLANS_TECHNIQUES', 'MULTIPOLES_SITE_REFONTE', 'croquis', 'Base de donnée photo reel', 'BE']);
// Folders that have meaningful subfolders to expand
const EXPAND_DIRS = new Set(['PLV']);

type DropboxCat = { name: string; dir: string; images: string[] | null };

function useDropboxCategories() {
  const [cats, setCats] = useState<DropboxCat[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const root = await fetch('/api/media').then(r => r.json());
        const result: DropboxCat[] = [];

        // Root-level files first (loose Gemini images, headers, etc.)
        const rootFiles = ((root.files || []) as string[]);
        if (rootFiles.length > 0) {
          result.push({ name: 'Visuels racine', dir: '', images: rootFiles.map(f => `/api/media/serve?path=${encodeURIComponent(f)}`) });
        }

        for (const dir of (root.dirs || []) as string[]) {
          if (SKIP_DIRS.has(dir)) continue;
          if (EXPAND_DIRS.has(dir)) {
            const sub = await fetch(`/api/media?dir=${encodeURIComponent(dir)}`).then(r => r.json());
            for (const subdir of (sub.dirs || []) as string[]) {
              result.push({ name: `${dir} · ${subdir}`, dir: `${dir}/${subdir}`, images: null });
            }
          } else {
            result.push({ name: dir, dir, images: null });
          }
        }
        setCats(result);
      } catch { /* Dropbox offline */ }
      setReady(true);
    })();
  }, []);

  const loadImages = useCallback((catIdx: number) => {
    const cat = cats[catIdx];
    if (!cat || cat.images !== null) return;
    fetch(`/api/media?dir=${encodeURIComponent(cat.dir)}`).then(r => r.json()).then(data => {
      const files = ((data.files || []) as string[])
        .filter(f => !f.startsWith('Copie de'))
        .filter(f => !/_x2/i.test(f));
      const images = files.map(f => `/api/media/serve?path=${encodeURIComponent(cat.dir + '/' + f)}`);
      // Also include subdirectory images (one level deep)
      const subDirs = (data.dirs || []) as string[];
      if (subDirs.length > 0) {
        Promise.all(subDirs.map(sd =>
          fetch(`/api/media?dir=${encodeURIComponent(cat.dir + '/' + sd)}`).then(r => r.json()).then(sub =>
            ((sub.files || []) as string[])
              .filter(f => !f.startsWith('Copie de') && !/_x2/i.test(f))
              .map(f => `/api/media/serve?path=${encodeURIComponent(cat.dir + '/' + sd + '/' + f)}`)
          )
        )).then(subImages => {
          const allImages = [...images, ...subImages.flat()];
          setCats(prev => prev.map((c, i) => i === catIdx ? { ...c, images: allImages } : c));
        });
      } else {
        setCats(prev => prev.map((c, i) => i === catIdx ? { ...c, images } : c));
      }
    });
  }, [cats]);

  return { cats, ready, loadImages };
}

export function ImageGalleryModal({ onSelect, onClose, onUpload }: { onSelect: (p: string) => void; onClose: () => void; onUpload: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const { cats: dropboxCats, ready: dropboxReady, loadImages } = useDropboxCategories();

  // Lazy-load Dropbox images when a dynamic tab is selected
  useEffect(() => {
    const catIdx = activeTab - DROPBOX_TAB_OFFSET;
    if (catIdx >= 0 && catIdx < dropboxCats.length) {
      loadImages(catIdx);
    }
  }, [activeTab, dropboxCats.length, loadImages]);

  const isStaticTab = activeTab >= 0 && activeTab < IMAGE_GALLERY.length;
  const isDropboxTab = activeTab >= DROPBOX_TAB_OFFSET && activeTab < DROPBOX_TAB_OFFSET + dropboxCats.length;
  const isMediaBrowser = activeTab === MEDIA_TAB_IDX;
  const dropboxCat = isDropboxTab ? dropboxCats[activeTab - DROPBOX_TAB_OFFSET] : null;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100000, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 24px 40px', overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#000B58' }}>Galerie d&apos;images</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666', lineHeight: 1 }}>&times;</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '8px 20px', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', flexShrink: 0 }}>
          {/* Static local categories */}
          {IMAGE_GALLERY.map((cat, idx) => (
            <button key={cat.category} onClick={() => setActiveTab(idx)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: activeTab === idx ? '#000B58' : '#f3f4f6', color: activeTab === idx ? '#fff' : '#374151', transition: 'all 0.15s' }}>
              {cat.category} ({cat.images.length})
            </button>
          ))}

          {/* Separator */}
          {dropboxCats.length > 0 && <div style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#d1d5db', margin: '2px 4px' }} />}

          {/* Dynamic Dropbox categories */}
          {dropboxCats.map((cat, idx) => (
            <button key={cat.dir || '_root'} onClick={() => setActiveTab(DROPBOX_TAB_OFFSET + idx)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: activeTab === DROPBOX_TAB_OFFSET + idx ? '#000B58' : '#f0f4ff', color: activeTab === DROPBOX_TAB_OFFSET + idx ? '#fff' : '#000B58', transition: 'all 0.15s' }}>
              {cat.name} {cat.images !== null ? `(${cat.images.length})` : ''}
            </button>
          ))}

          {!dropboxReady && <span style={{ padding: '6px 14px', fontSize: '12px', color: '#888' }}>Chargement Dropbox…</span>}

          {/* Full Dropbox browser */}
          <button onClick={() => setActiveTab(MEDIA_TAB_IDX)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: isMediaBrowser ? 'none' : '1px dashed #000B58', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: isMediaBrowser ? '#000B58' : 'transparent', color: isMediaBrowser ? '#fff' : '#000B58', transition: 'all 0.15s' }}>
            📂 Explorer Dropbox
          </button>
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: '16px 20px', maxHeight: '60vh' }}>
          {isMediaBrowser ? (
            <MediaTab onSelect={url => { onSelect(url); }} />
          ) : isStaticTab ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {IMAGE_GALLERY[activeTab].images.map(imgPath => <ImgThumb key={imgPath} src={imgPath} label={imgPath.split('/').pop() || imgPath} onClick={() => onSelect(imgPath)} />)}
            </div>
          ) : isDropboxTab && dropboxCat ? (
            dropboxCat.images === null ? (
              <div style={{ color: '#888', fontSize: '14px', padding: '20px', textAlign: 'center' }}>Chargement des images…</div>
            ) : dropboxCat.images.length === 0 ? (
              <div style={{ color: '#888', fontSize: '14px', padding: '20px', textAlign: 'center' }}>Aucune image dans ce dossier</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {dropboxCat.images.map(imgUrl => {
                  const label = decodeURIComponent(imgUrl.split('path=').pop() || '').split('/').pop() || '';
                  return <ImgThumb key={imgUrl} src={imgUrl} label={label} onClick={() => onSelect(imgUrl)} />;
                })}
              </div>
            )
          ) : null}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onUpload} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #000B58', backgroundColor: 'transparent', color: '#000B58', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Importer un fichier…</button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#f3f4f6', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar flottante (portal) ──────────────────────────────
const POSITIONS = [
  { label: '↖', x: -50, y: -50 }, { label: '↑', x: 0, y: -50 }, { label: '↗', x: 50, y: -50 },
  { label: '←', x: -50, y:   0 }, { label: '·', x: 0, y:   0 }, { label: '→', x: 50, y:   0 },
  { label: '↙', x: -50, y:  50 }, { label: '↓', x: 0, y:  50 }, { label: '↘', x: 50, y:  50 },
];

function FloatingToolbar({
  containerRef, fill, objectFit, transform, hasTransform,
  onChangeImage, onToggleFit, onReset, onDeselect,
  setImageTransform, editorKey,
  showFilters, onToggleFilters,
  filter, onFilterChange,
  frameSize, onResetFrame,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  fill?: boolean;
  objectFit: string;
  transform: { scale: number; x: number; y: number };
  hasTransform: boolean;
  onChangeImage: () => void;
  onToggleFit: () => void;
  onReset: () => void;
  onDeselect: () => void;
  setImageTransform: (k: string, v: { scale: number; x: number; y: number }) => void;
  editorKey: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  filter: ImageFilter;
  onFilterChange: (f: ImageFilter) => void;
  frameSize?: FrameSize;
  onResetFrame: () => void;
}) {
  const [rect, setRect]       = useState<DOMRect | null>(null);
  const [showPos, setShowPos] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [containerRef]);

  if (!rect || typeof document === 'undefined') return null;

  const toolbarH  = 40;
  const gap       = 6;
  const spaceAbove = rect.top;
  const top  = spaceAbove > toolbarH + gap
    ? rect.top + window.scrollY - toolbarH - gap
    : rect.bottom + window.scrollY + gap;
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - 480));

  const btnStyle = (active = false): React.CSSProperties => ({
    height: 30, padding: '0 10px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12,
    fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
    backgroundColor: active ? '#000B58' : 'rgba(255,255,255,0.12)',
    color: active ? '#fff' : 'rgba(255,255,255,0.85)',
    transition: 'all 0.15s',
  });
  const sep: React.CSSProperties = { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 2px' };

  const isFilterActive = filter.brightness !== 1 || filter.contrast !== 1 || filter.saturation !== 1 || filter.temperature !== 0;

  return createPortal(
    <div
      onPointerDown={e => e.stopPropagation()}
      style={{ position: 'absolute', top, left, zIndex: 999999, display: 'flex', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,11,88,0.92)', backdropFilter: 'blur(12px)', borderRadius: 10,
        padding: '5px 8px', boxShadow: '0 8px 32px rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)',
        height: toolbarH, userSelect: 'none' }}
    >
      {/* Changer image */}
      <button style={btnStyle()} onClick={onChangeImage} title="Changer l'image">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Changer
      </button>

      <div style={sep} />

      {/* Filtres */}
      <button style={{ ...btnStyle(showFilters || isFilterActive), ...(isFilterActive && !showFilters ? { color: '#ffd580' } : {}) }} onClick={onToggleFilters} title="Filtres image">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          <circle cx="4" cy="6" r="2" fill="currentColor" opacity={0.6}/><circle cx="6" cy="12" r="2" fill="currentColor" opacity={0.6}/><circle cx="10" cy="18" r="2" fill="currentColor" opacity={0.6}/>
        </svg>
        Filtres
      </button>

      <div style={sep} />

      {/* Cover / Contain */}
      {fill && (
        <>
          <button style={btnStyle(objectFit === 'cover')} onClick={() => { if (objectFit !== 'cover') onToggleFit(); }} title="Cover — remplit le cadre">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="0" y="0" width="24" height="24" rx="2"/></svg>
            Cover
          </button>
          <button style={btnStyle(objectFit === 'contain')} onClick={() => { if (objectFit !== 'contain') onToggleFit(); }} title="Contain — image entière visible">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" opacity={0.5}/></svg>
            Contain
          </button>
          <div style={sep} />
        </>
      )}

      {/* Dimensions cadre + reset */}
      {fill && frameSize && (
        <>
          <span style={{ color: '#ffd580', fontSize: 10, fontWeight: 700 }}>{Math.round(frameSize.w)}×{Math.round(frameSize.h)}</span>
          <button style={{ ...btnStyle(), paddingLeft: 6, paddingRight: 6 }} onClick={onResetFrame} title="Reset taille cadre">⊡</button>
          <div style={sep} />
        </>
      )}

      {/* Position grid (9 points) — toggle */}
      {fill && (
        <>
          <div style={{ position: 'relative' }}>
            <button style={{ ...btnStyle(), paddingLeft: 8, paddingRight: 8 }} onClick={() => setShowPos(p => !p)} title="Position de l'image">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
              Position
            </button>
            {showPos && (
              <div style={{ position: 'absolute', bottom: 38, left: 0, backgroundColor: 'rgba(0,11,88,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: 6, display: 'grid', gridTemplateColumns: 'repeat(3, 24px)', gap: 3, zIndex: 10 }}>
                {POSITIONS.map(pos => {
                  const active = Math.round(transform.x) === pos.x && Math.round(transform.y) === pos.y;
                  return (
                    <button key={pos.label} onClick={e => { e.stopPropagation(); setImageTransform(editorKey, { ...transform, x: pos.x, y: pos.y }); setShowPos(false); }}
                      style={{ width: 24, height: 24, borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        backgroundColor: active ? '#ffd580' : 'rgba(255,255,255,0.12)', color: active ? '#000B58' : '#fff' }}
                    >{pos.label}</button>
                  );
                })}
              </div>
            )}
          </div>
          <div style={sep} />
        </>
      )}

      {/* Zoom info + reset */}
      {hasTransform && (
        <>
          <span style={{ color: '#ffd580', fontSize: 11, fontWeight: 700, padding: '0 4px' }}>{Math.round(transform.scale * 100)}%</span>
          <button style={{ ...btnStyle(), color: '#ffd580', paddingLeft: 8, paddingRight: 8 }} onClick={onReset} title="Réinitialiser zoom/position (R)">↺</button>
          <div style={sep} />
        </>
      )}

      {/* Fermer */}
      <button style={{ ...btnStyle(), paddingLeft: 8, paddingRight: 8, color: 'rgba(255,255,255,0.5)' }} onClick={onDeselect} title="Désélectionner (Échap)">✕</button>

      {/* FilterPanel (rendu ici pour hériter du portail de la toolbar) */}
      {showFilters && (
        <FilterPanel
          containerRef={containerRef}
          filter={filter}
          onFilterChange={onFilterChange}
          onClose={onToggleFilters}
        />
      )}
    </div>,
    document.body
  );
}

// ─── Props ────────────────────────────────────────────────────
interface EditableImageProps {
  editorKey: string; src: string; alt: string;
  fill?: boolean; className?: string;
  width?: number; height?: number; priority?: boolean; sizes?: string;
  compact?: boolean; quality?: number;
}

// ─── Composant principal ─────────────────────────────────────
export function EditableImage({ editorKey, src, alt, fill, className, width, height, priority, sizes, compact, quality }: EditableImageProps) {
  const {
    editorMode, imageOverrides, setImageOverride,
    imageTransforms, setImageTransform,
    imageFilters, setImageFilter,
    frameSizes, setFrameSize,
  } = useEditor();

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGallery,  setShowGallery]  = useState(false);
  const [selected,     setSelected]     = useState(false);
  const [hovered,      setHovered]      = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);

  // Filter state
  const filter = (imageFilters ?? {})[editorKey] ?? DEFAULT_FILTER;
  const handleFilterChange = useCallback((f: ImageFilter) => setImageFilter(editorKey, f), [editorKey, setImageFilter]);

  // Frame size
  const frameSize = (frameSizes ?? {})[editorKey] as FrameSize | undefined;

  // Transform state
  const transform    = (imageTransforms ?? {})[editorKey] ?? { scale: 1, x: 0, y: 0 };
  const hasTransform = transform.scale !== 1 || transform.x !== 0 || transform.y !== 0;
  const transformRef = useRef(transform);
  useLayoutEffect(() => { transformRef.current = transform; }, [transform]);

  // Drag tracking
  const dragRef = useRef<{ startX: number; startY: number; startTx: number; startTy: number; moved: boolean } | null>(null);

  // ── Escape key + click outside ────────────────────────────
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSelected(false); setShowFilters(false); }
      if (e.key === 'r' || e.key === 'R') setImageTransform(editorKey, { scale: 1, x: 0, y: 0 });
    };
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(false);
        setShowFilters(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onClickOutside);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onClickOutside); };
  }, [selected, editorKey, setImageTransform]);

  // ── Wheel zoom (non-passive) ──────────────────────────────
  useEffect(() => {
    if (!editorMode || !fill || !selected) return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const t     = transformRef.current;
      const raw   = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaMode === 2 ? e.deltaY * 300 : e.deltaY;
      const delta = -raw * 0.002;
      const newScale = Math.max(1, Math.min(4, t.scale + delta));
      const next  = { scale: newScale, x: newScale <= 1 ? 0 : t.x, y: newScale <= 1 ? 0 : t.y };
      transformRef.current = next;
      setImageTransform(editorKey, next);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [editorMode, fill, selected, editorKey, setImageTransform]);

  // ── Pointer events ────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editorMode) return;
    e.stopPropagation();
    if (!selected) { setSelected(true); return; }
    if (!fill) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startTx: transform.x, startTy: transform.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || !fill || !selected) return;
    const hasMoved = Math.abs(e.clientX - d.startX) > 4 || Math.abs(e.clientY - d.startY) > 4;
    if (!hasMoved) return;
    d.moved = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const t    = transformRef.current;
    const nx   = d.startTx - (e.clientX - d.startX) / rect.width  * 100 / Math.max(1, t.scale);
    const ny   = d.startTy - (e.clientY - d.startY) / rect.height * 100 / Math.max(1, t.scale);
    setImageTransform(editorKey, { ...t, x: Math.max(-50, Math.min(50, nx)), y: Math.max(-50, Math.min(50, ny)) });
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && !d.moved && selected) setShowGallery(true);
  };

  // ── File upload ───────────────────────────────────────────
  const handleGallerySelect = useCallback((path: string) => { setImageOverride(editorKey, path); setShowGallery(false); setSelected(false); }, [editorKey, setImageOverride]);
  const handleFileUpload    = useCallback(() => { setShowGallery(false); inputRef.current?.click(); }, []);
  const handleFileChange    = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setImageOverride(editorKey, await resizeImage(file, 1920, 0.85)); } catch (err) { console.error(err); }
    e.target.value = '';
  }, [editorKey, setImageOverride]);

  // ── Object-fit override ───────────────────────────────────
  const fitKey      = `${editorKey}__fit`;
  const fitOverride = ((imageTransforms ?? {})[fitKey] as unknown as { fit?: 'cover' | 'contain' })?.fit;
  const objectFit   = fitOverride ?? 'cover';
  const toggleFit   = useCallback(() => {
    const next = objectFit === 'cover' ? 'contain' : 'cover';
    setImageTransform(fitKey, { scale: 1, x: 0, y: 0, fit: next } as unknown as { scale: number; x: number; y: number });
  }, [objectFit, fitKey, setImageTransform]);

  // ── Image style (avec filtres) ────────────────────────────
  const cssFilter = filterToCSS(filter);
  const imgStyle: React.CSSProperties = (editorMode || hasTransform || cssFilter) ? {
    objectFit: objectFit,
    objectPosition: `${50 + transform.x}% ${50 + transform.y}%`,
    transform: transform.scale !== 1 ? `scale(${transform.scale})` : undefined,
    transformOrigin: 'center',
    transition: dragRef.current ? 'none' : 'transform 0.1s ease, object-position 0.1s ease',
    ...(cssFilter ? { filter: cssFilter } : {}),
  } : {};

  // ── Frame size override ───────────────────────────────────
  const frameSizeStyle: React.CSSProperties = fill && frameSize
    ? { width: frameSize.w, height: frameSize.h }
    : {};

  const override   = imageOverrides[editorKey];
  const displaySrc = override || src;
  const isDataUrl  = override?.startsWith('data:');

  const cursor = !editorMode ? undefined : !selected ? 'pointer' : fill && hasTransform ? 'move' : fill ? 'crosshair' : 'pointer';

  const wrapperStyle: React.CSSProperties = {
    ...(fill ? { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' } : { display: 'inline-block', overflow: 'hidden' }),
    ...frameSizeStyle,
    cursor,
    ...(editorMode && selected  ? { outline: '2px solid #000B58', outlineOffset: '0px', zIndex: 40 } : {}),
    ...(editorMode && hovered && !selected ? { outline: '2px solid rgba(0,11,88,0.4)', outlineOffset: '0px' } : {}),
  };

  const hoverHint = editorMode && hovered && !selected && fill ? (
    <div style={{ position: 'absolute', inset: 0, zIndex: 41, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ backgroundColor: 'rgba(0,11,88,0.75)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Cliquer pour éditer</span>
      </div>
    </div>
  ) : null;

  const dragHint = editorMode && selected && fill && !hasTransform ? (
    <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', zIndex: 41, pointerEvents: 'none' }}>
      <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 600, borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap' }}>
        molette = zoom · glisser = recadrer
      </span>
    </div>
  ) : null;

  const commonChildren = (
    <>
      <TempOverlay temperature={filter.temperature} />
      {hoverHint}
      {dragHint}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </>
  );

  const toolbar = editorMode && selected ? (
    <FloatingToolbar
      containerRef={containerRef} fill={fill} objectFit={objectFit}
      transform={transform} hasTransform={hasTransform}
      onChangeImage={() => setShowGallery(true)}
      onToggleFit={toggleFit}
      onReset={() => setImageTransform(editorKey, { scale: 1, x: 0, y: 0 })}
      onDeselect={() => { setSelected(false); setShowFilters(false); }}
      setImageTransform={setImageTransform} editorKey={editorKey}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(p => !p)}
      filter={filter}
      onFilterChange={handleFilterChange}
      frameSize={frameSize}
      onResetFrame={() => setFrameSize(editorKey, null)}
    />
  ) : null;

  const resizeHandles = editorMode && selected && fill ? (
    <ResizeHandles containerRef={containerRef} editorKey={editorKey} setFrameSize={setFrameSize} />
  ) : null;

  if (isDataUrl) {
    return (
      <>
        <div ref={containerRef} style={wrapperStyle}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
          onPointerLeave={() => { dragRef.current = null; setHovered(false); }}
          onPointerEnter={() => editorMode && setHovered(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={override} alt={alt} className={className}
            style={{ ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : { width, height }), ...imgStyle }}
            width={!fill ? width : undefined} height={!fill ? height : undefined}
          />
          {commonChildren}
        </div>
        {toolbar}
        {resizeHandles}
        {showGallery && typeof document !== 'undefined' && createPortal(<ImageGalleryModal onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} onUpload={handleFileUpload} />, document.body)}
      </>
    );
  }

  return (
    <>
      <div ref={containerRef} style={wrapperStyle}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        onPointerLeave={() => { dragRef.current = null; setHovered(false); }}
        onPointerEnter={() => editorMode && setHovered(true)}
      >
        <Image src={displaySrc} alt={alt} fill={fill} className={className}
          width={!fill ? width : undefined} height={!fill ? height : undefined}
          priority={priority} sizes={sizes} quality={quality} style={imgStyle}
        />
        {commonChildren}
      </div>
      {toolbar}
      {resizeHandles}
      {showGallery && typeof document !== 'undefined' && createPortal(<ImageGalleryModal onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} onUpload={handleFileUpload} />, document.body)}
    </>
  );
}
