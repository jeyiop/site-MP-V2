'use client';

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useEditor } from '@/components/EditorWrapper';

// ─── Catalogue images ────────────────────────────────────────
const IMAGE_GALLERY = [
  { category: 'Hero', images: ['/image/selecta/hero/hero-01-collage.jpg','/image/selecta/hero/hero-01.jpg','/image/selecta/hero/hero-02.jpg','/image/selecta/hero/hero-03.jpg','/image/selecta/hero/hero-04.jpg','/image/selecta/hero/hero-05.jpg','/image/selecta/hero/hero-06.png','/image/selecta/hero/hero-07.png'] },
  { category: 'Savoir-faire', images: ['/image/selecta/savoir-faire/sf-packaging.png','/image/selecta/savoir-faire/sf-plv.png','/image/selecta/savoir-faire/sf-print.png','/image/selecta/savoir-faire/sf-studio.jpg'] },
  { category: 'Vitrine', images: ['/image/selecta/vitrine/vitrine-ilv-01.jpg','/image/selecta/vitrine/vitrine-ilv-02.jpg','/image/selecta/vitrine/vitrine-packaging-01.jpg','/image/selecta/vitrine/vitrine-packaging-02.jpg','/image/selecta/vitrine/vitrine-packaging-03.jpg','/image/selecta/vitrine/vitrine-packaging-04.jpg','/image/selecta/vitrine/vitrine-plv-comptoir-01.jpg','/image/selecta/vitrine/vitrine-plv-comptoir-02.jpg','/image/selecta/vitrine/vitrine-plv-comptoir-03.jpg','/image/selecta/vitrine/vitrine-plv-lineaire-01.jpg','/image/selecta/vitrine/vitrine-plv-sol-01.jpg','/image/selecta/vitrine/vitrine-plv-sol-02.jpg'] },
  { category: 'Réalisations', images: ['/image/realisations/realisations-01.webp','/image/realisations/realisations-02.webp','/image/realisations/realisations-03.webp','/image/realisations/realisations-04.webp'] },
  { category: 'Divers', images: ['/image/slider-live-kraft/kraft-gamme-01.jpg','/image/slider-live-kraft/kraft-gamme-02.jpg','/image/slider-live-kraft/kraft-gamme-03.jpg','/image/003ab1236756873.68f226d5e8204.webp','/image/2a5c5c211072581.671be4b87df2e.webp','/image/950e4c236909363.68f623758ca51 copy.webp'] },
  { category: 'Logos', images: ['/image/selecta/logo/logo-multipoles-v2-header.png','/image/selecta/logo/logo-multipoles-transparent.png','/image/selecta/logo/logo-A.png','/image/selecta/logo/logo-B.png','/image/selecta/logo/logo-C.png','/image/selecta/logo/logo-X.png','/image/selecta/logo/logo-blanc-transparent.png','/image/selecta/logo/logo-final.png','/image/selecta/logo/logo-navy-transparent.png','/image/selecta/logo/logo-original-transparent.png','/image/selecta/logo/logo-transparent.png','/image/selecta/logo/logo-white-v2.jpg','/image/selecta/logo/logo-white-v3.jpg'] },
  { category: 'Logo Templates', images: ['/image/logo-template/logo-multipoles-neon-transparent.png','/image/logo-template/Gemini_Generated_Image_a8mgbaa8mgbaa8mg.png','/image/logo-template/Gemini_Generated_Image_msu5u7msu5u7msu5.png','/image/logo-template/logo A.png','/image/logo-template/logo b.png','/image/logo-template/logo c.png','/image/logo-template/logo x.png','/image/logo-template/Gemini_Generated_Image_c77ma9c77ma9c77m.jpg','/image/logo-template/Gemini_Generated_Image_c77ma9c77ma9c77m (1).jpg'] },
];

interface EditableImageProps {
  editorKey: string; src: string; alt: string;
  fill?: boolean; className?: string;
  width?: number; height?: number; priority?: boolean; sizes?: string;
  compact?: boolean; // désactive le panneau de contrôles (pour logo, petites images)
}

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
        if (!isPng) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
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
  const isPng = label.toLowerCase().endsWith('.png') || src.includes('image/png');
  const thumbBg = isPng
    ? '#000B58'
    : '#f9fafb';
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
  const [dirs, setDirs] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);
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

const MEDIA_TAB_IDX = IMAGE_GALLERY.length;

function ImageGalleryModal({ onSelect, onClose, onUpload }: { onSelect: (p: string) => void; onClose: () => void; onUpload: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100000, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 24px 40px', overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '960px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#000B58' }}>Galerie d&apos;images</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666', lineHeight: 1 }}>&times;</button>
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '8px 20px', borderBottom: '1px solid #e5e7eb', overflowX: 'auto', flexShrink: 0 }}>
          {IMAGE_GALLERY.map((cat, idx) => <button key={cat.category} onClick={() => setActiveTab(idx)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: activeTab === idx ? '#000B58' : '#f3f4f6', color: activeTab === idx ? '#fff' : '#374151', transition: 'all 0.15s' }}>{cat.category} ({cat.images.length})</button>)}
          <button onClick={() => setActiveTab(MEDIA_TAB_IDX)} style={{ padding: '6px 14px', borderRadius: '8px', border: activeTab === MEDIA_TAB_IDX ? 'none' : '1px dashed #000B58', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', backgroundColor: activeTab === MEDIA_TAB_IDX ? '#000B58' : 'transparent', color: activeTab === MEDIA_TAB_IDX ? '#fff' : '#000B58', transition: 'all 0.15s' }}>📂 Media Dropbox</button>
        </div>
        <div style={{ overflow: 'auto', padding: '16px 20px', maxHeight: '60vh' }}>
          {activeTab === MEDIA_TAB_IDX ? <MediaTab onSelect={url => { onSelect(url); }} /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {IMAGE_GALLERY[activeTab].images.map(imgPath => <ImgThumb key={imgPath} src={imgPath} label={imgPath.split('/').pop() || imgPath} onClick={() => onSelect(imgPath)} />)}
            </div>
          )}
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

function FloatingToolbar({ containerRef, fill, objectFit, transform, hasTransform, onChangeImage, onToggleFit, onReset, onDeselect, setImageTransform, editorKey }: {
  containerRef: React.RefObject<HTMLDivElement | null>; fill?: boolean; objectFit: string;
  transform: { scale: number; x: number; y: number }; hasTransform: boolean;
  onChangeImage: () => void; onToggleFit: () => void; onReset: () => void; onDeselect: () => void;
  setImageTransform: (k: string, v: any) => void; editorKey: string;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
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

  const toolbarH = 40;
  const gap = 6;
  const spaceAbove = rect.top;
  const top = spaceAbove > toolbarH + gap
    ? rect.top + window.scrollY - toolbarH - gap
    : rect.bottom + window.scrollY + gap;
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - 420));

  const btnStyle = (active = false): React.CSSProperties => ({
    height: 30, padding: '0 10px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12,
    fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
    backgroundColor: active ? '#000B58' : 'rgba(255,255,255,0.12)',
    color: active ? '#fff' : 'rgba(255,255,255,0.85)',
    transition: 'all 0.15s',
  });
  const sep: React.CSSProperties = { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 2px' };

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
    </div>,
    document.body
  );
}

// ─── Composant principal ─────────────────────────────────────
export function EditableImage({ editorKey, src, alt, fill, className, width, height, priority, sizes, compact }: EditableImageProps) {
  const { editorMode, imageOverrides, setImageOverride, imageTransforms, setImageTransform } = useEditor();
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selected, setSelected]       = useState(false);
  const [hovered, setHovered]         = useState(false);

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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(false); if (e.key === 'r' || e.key === 'R') setImageTransform(editorKey, { scale: 1, x: 0, y: 0 }); };
    const onClickOutside = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setSelected(false); };
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
      const t = transformRef.current;
      const raw = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaMode === 2 ? e.deltaY * 300 : e.deltaY;
      const delta = -raw * 0.002;
      const newScale = Math.max(1, Math.min(4, t.scale + delta));
      const next = { scale: newScale, x: newScale <= 1 ? 0 : t.x, y: newScale <= 1 ? 0 : t.y };
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
    const t = transformRef.current;
    const nx = d.startTx - (e.clientX - d.startX) / rect.width  * 100 / Math.max(1, t.scale);
    const ny = d.startTy - (e.clientY - d.startY) / rect.height * 100 / Math.max(1, t.scale);
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
  const fitKey = `${editorKey}__fit`;
  const fitOverride = ((imageTransforms ?? {})[fitKey] as any)?.fit as 'cover' | 'contain' | undefined;
  const objectFit = fitOverride ?? 'cover';
  const toggleFit = useCallback(() => {
    const next = objectFit === 'cover' ? 'contain' : 'cover';
    setImageTransform(fitKey, { scale: 1, x: 0, y: 0, fit: next } as any);
  }, [objectFit, fitKey, setImageTransform]);

  // ── Image style ───────────────────────────────────────────
  const imgStyle: React.CSSProperties = (editorMode || hasTransform) ? {
    objectFit: objectFit,
    objectPosition: `${50 + transform.x}% ${50 + transform.y}%`,
    transform: transform.scale !== 1 ? `scale(${transform.scale})` : undefined,
    transformOrigin: 'center',
    transition: dragRef.current ? 'none' : 'transform 0.1s ease, object-position 0.1s ease',
  } : {};

  const override   = imageOverrides[editorKey];
  const displaySrc = override || src;
  const isDataUrl  = override?.startsWith('data:');

  // ── Cursor ───────────────────────────────────────────────
  const cursor = !editorMode ? undefined : !selected ? 'pointer' : fill && hasTransform ? 'move' : fill ? 'crosshair' : 'pointer';

  const wrapperStyle: React.CSSProperties = {
    ...(fill ? { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' } : { display: 'inline-block', overflow: 'hidden' }),
    cursor,
    // Selection ring
    ...(editorMode && selected ? { outline: '2px solid #000B58', outlineOffset: '0px', zIndex: 40 } : {}),
    ...(editorMode && hovered && !selected ? { outline: '2px solid rgba(0,11,88,0.4)', outlineOffset: '0px' } : {}),
  };

  // ── Hover hint (minimal, non-selected) ───────────────────
  const hoverHint = editorMode && hovered && !selected && fill ? (
    <div style={{ position: 'absolute', inset: 0, zIndex: 41, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ backgroundColor: 'rgba(0,11,88,0.75)', borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Cliquer pour éditer</span>
      </div>
    </div>
  ) : null;

  // ── Selected drag hint ────────────────────────────────────
  const dragHint = editorMode && selected && fill && !hasTransform ? (
    <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', zIndex: 41, pointerEvents: 'none' }}>
      <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: 600, borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap' }}>
        molette = zoom · glisser = recadrer
      </span>
    </div>
  ) : null;

  const commonChildren = (
    <>
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
      onDeselect={() => setSelected(false)}
      setImageTransform={setImageTransform} editorKey={editorKey}
    />
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
          priority={priority} sizes={sizes} style={imgStyle}
        />
        {commonChildren}
      </div>
      {toolbar}
      {showGallery && typeof document !== 'undefined' && createPortal(<ImageGalleryModal onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} onUpload={handleFileUpload} />, document.body)}
    </>
  );
}
