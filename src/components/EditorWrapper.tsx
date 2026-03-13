'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import dynamic from 'next/dynamic';

// ─── Types ───────────────────────────────────────────────────
export interface ImageTransform { scale: number; x: number; y: number }

export interface ImageFilter {
  brightness: number;   // défaut 1, range 0.5-1.5
  contrast: number;     // défaut 1, range 0.5-1.5
  saturation: number;   // défaut 1, range 0-2
  temperature: number;  // défaut 0, range -50 à 50 (négatif = froid, positif = chaud)
  preset: string;       // 'normal' | 'vivid' | 'matte' | etc
}
export const DEFAULT_FILTER: ImageFilter = { brightness: 1, contrast: 1, saturation: 1, temperature: 0, preset: 'normal' };

export interface FrameSize { w: number; h: number; }

export interface FreeBlock {
  id: string;
  type: 'text' | 'image' | 'mixed';
  x: number; y: number; w: number; h: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  imageUrl?: string;
  bgColor?: string;
  borderRadius?: number;
  padding?: number;
  opacity?: number;
}

interface EditorContextType {
  editorMode: boolean;
  imageOverrides: Record<string, string>;
  textOverrides: Record<string, string>;
  imageTransforms: Record<string, ImageTransform>;
  heroLayouts: Record<string, number>;
  imageFilters: Record<string, ImageFilter>;
  frameSizes: Record<string, FrameSize>;
  freeBlocks: FreeBlock[];
  toggleEditor: () => void;
  setImageOverride: (key: string, dataURL: string) => void;
  setTextOverride: (key: string, value: string) => void;
  setImageTransform: (key: string, t: ImageTransform) => void;
  setHeroLayout: (key: string, cardWidth: number) => void;
  setImageFilter: (key: string, f: ImageFilter) => void;
  setFrameSize: (key: string, s: FrameSize | null) => void;
  addFreeBlock: (block: FreeBlock) => void;
  updateFreeBlock: (id: string, updates: Partial<FreeBlock>) => void;
  deleteFreeBlock: (id: string) => void;
  resetOverrides: () => void;
  resetTextOverrides: () => void;
  resetImageTransforms: () => void;
  resetHeroLayouts: () => void;
  resetImageFilters: () => void;
  resetFrameSizes: () => void;
  resetFreeBlocks: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

const IMAGE_STORAGE_KEY     = 'mp-editor-overrides';
const TEXT_STORAGE_KEY      = 'mp-editor-text-overrides';
const TRANSFORM_STORAGE_KEY = 'mp-editor-transforms';
const LAYOUT_STORAGE_KEY    = 'mp-editor-layouts';
const FILTER_STORAGE_KEY    = 'mp-editor-filters';
const FRAME_STORAGE_KEY     = 'mp-editor-frames';
const BLOCK_STORAGE_KEY     = 'mp-editor-blocks';

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorWrapper');
  return ctx;
}

// ─── Dynamic import du block layer ──────────────────────────
const EditorBlockLayer = dynamic(
  () => import('./EditorBlockLayer').then(m => ({ default: m.EditorBlockLayer })),
  { ssr: false }
);

// ─── Toggle Button ──────────────────────────────────────────
function EditorToggle() {
  const {
    editorMode, toggleEditor,
    resetOverrides, resetTextOverrides, resetImageTransforms, resetHeroLayouts,
    resetImageFilters, resetFrameSizes, resetFreeBlocks,
    imageOverrides, textOverrides, imageTransforms, heroLayouts,
    imageFilters, frameSizes, freeBlocks,
  } = useEditor();

  const importRef = useRef<HTMLInputElement>(null);

  const imgCount        = Object.keys(imageOverrides).length;
  const txtCount        = Object.keys(textOverrides).length;
  const transformCount  = Object.keys(imageTransforms).filter(k => {
    const t = imageTransforms[k];
    return t.scale !== 1 || t.x !== 0 || t.y !== 0;
  }).length;
  const layoutCount     = Object.keys(heroLayouts).length;
  const filterCount     = Object.keys(imageFilters).filter(k => {
    const f = imageFilters[k];
    return f.brightness !== 1 || f.contrast !== 1 || f.saturation !== 1 || f.temperature !== 0;
  }).length;
  const frameCount      = Object.keys(frameSizes).length;
  const blockCount      = freeBlocks.length;

  // ── Export JSON ────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      imageOverrides,
      textOverrides,
      imageTransforms,
      heroLayouts,
      imageFilters,
      frameSizes,
      freeBlocks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `mp-editor-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [imageOverrides, textOverrides, imageTransforms, heroLayouts, imageFilters, frameSizes, freeBlocks]);

  // ── Import JSON ────────────────────────────────────────────
  const handleImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (parsed.imageOverrides && typeof parsed.imageOverrides === 'object') {
            try { localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(parsed.imageOverrides)); } catch { /* ignore */ }
            window.location.reload();
          }
          if (parsed.textOverrides && typeof parsed.textOverrides === 'object') {
            try { localStorage.setItem(TEXT_STORAGE_KEY, JSON.stringify(parsed.textOverrides)); } catch { /* ignore */ }
          }
          if (parsed.imageTransforms && typeof parsed.imageTransforms === 'object') {
            try { localStorage.setItem(TRANSFORM_STORAGE_KEY, JSON.stringify(parsed.imageTransforms)); } catch { /* ignore */ }
          }
          if (parsed.heroLayouts && typeof parsed.heroLayouts === 'object') {
            try { localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(parsed.heroLayouts)); } catch { /* ignore */ }
          }
          if (parsed.imageFilters && typeof parsed.imageFilters === 'object') {
            try { localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(parsed.imageFilters)); } catch { /* ignore */ }
          }
          if (parsed.frameSizes && typeof parsed.frameSizes === 'object') {
            try { localStorage.setItem(FRAME_STORAGE_KEY, JSON.stringify(parsed.frameSizes)); } catch { /* ignore */ }
          }
          if (parsed.freeBlocks && Array.isArray(parsed.freeBlocks)) {
            try { localStorage.setItem(BLOCK_STORAGE_KEY, JSON.stringify(parsed.freeBlocks)); } catch { /* ignore */ }
          }
        } catch {
          alert('Fichier JSON invalide.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [],
  );

  const btnBase: React.CSSProperties = {
    padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
    border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'opacity 0.15s',
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: '8px' }}>

      {/* Reset blocs libres */}
      {editorMode && blockCount > 0 && (
        <button onClick={resetFreeBlocks} style={{ ...btnBase, backgroundColor: '#b45309', color: '#fff' }}>
          Reset blocs ({blockCount})
        </button>
      )}

      {/* Reset cadres */}
      {editorMode && frameCount > 0 && (
        <button onClick={resetFrameSizes} style={{ ...btnBase, backgroundColor: '#0e7490', color: '#fff' }}>
          Reset cadres ({frameCount})
        </button>
      )}

      {/* Reset filtres */}
      {editorMode && filterCount > 0 && (
        <button onClick={resetImageFilters} style={{ ...btnBase, backgroundColor: '#9333ea', color: '#fff' }}>
          Reset filtres ({filterCount})
        </button>
      )}

      {/* Reset layout */}
      {editorMode && layoutCount > 0 && (
        <button onClick={resetHeroLayouts} style={{ ...btnBase, backgroundColor: '#0891b2', color: '#fff' }}>
          Reset layout ({layoutCount})
        </button>
      )}

      {/* Reset zoom */}
      {editorMode && transformCount > 0 && (
        <button onClick={resetImageTransforms} style={{ ...btnBase, backgroundColor: '#d97706', color: '#fff' }}>
          Reset zoom ({transformCount})
        </button>
      )}

      {/* Reset textes */}
      {editorMode && txtCount > 0 && (
        <button onClick={resetTextOverrides} style={{ ...btnBase, backgroundColor: '#2563eb', color: '#fff' }}>
          Reset textes ({txtCount})
        </button>
      )}

      {/* Reset images */}
      {editorMode && imgCount > 0 && (
        <button onClick={resetOverrides} style={{ ...btnBase, backgroundColor: '#dc2626', color: '#fff' }}>
          Reset images ({imgCount})
        </button>
      )}

      {/* Sauvegarder / Export / Import */}
      {editorMode && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={async () => {
              const payload = { imageOverrides, textOverrides, imageTransforms, heroLayouts, imageFilters, frameSizes, freeBlocks };
              const res = await fetch('/api/studio/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (res.ok) alert('✅ Modifications sauvegardées dans le code !');
              else alert('❌ Erreur lors de la sauvegarde.');
            }}
            style={{ ...btnBase, backgroundColor: '#000B58', color: '#fff' }}
          >💾 Sauvegarder</button>
          <button onClick={handleExport} style={{ ...btnBase, backgroundColor: '#16a34a', color: '#fff' }}>Exporter</button>
          <button onClick={() => importRef.current?.click()} style={{ ...btnBase, backgroundColor: '#7c3aed', color: '#fff' }}>Importer</button>
          <input ref={importRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={toggleEditor}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: editorMode ? '#16a34a' : '#000B58',
          color: '#fff', padding: '12px 20px', borderRadius: '9999px',
          fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)', transition: 'all 0.2s ease',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        {editorMode ? 'MODE ÉDITEUR' : 'Éditeur'}
        {imgCount > 0 && (
          <span style={{ backgroundColor: '#dc2626', color: '#fff', borderRadius: '9999px', padding: '1px 7px', fontSize: '11px', fontWeight: 700, lineHeight: '18px', marginLeft: '2px' }}>
            {imgCount} img
          </span>
        )}
        {txtCount > 0 && (
          <span style={{ backgroundColor: '#2563eb', color: '#fff', borderRadius: '9999px', padding: '1px 7px', fontSize: '11px', fontWeight: 700, lineHeight: '18px', marginLeft: '2px' }}>
            {txtCount} txt
          </span>
        )}
        {transformCount > 0 && (
          <span style={{ backgroundColor: '#d97706', color: '#fff', borderRadius: '9999px', padding: '1px 7px', fontSize: '11px', fontWeight: 700, lineHeight: '18px', marginLeft: '2px' }}>
            {transformCount} zoom
          </span>
        )}
        {filterCount > 0 && (
          <span style={{ backgroundColor: '#9333ea', color: '#fff', borderRadius: '9999px', padding: '1px 7px', fontSize: '11px', fontWeight: 700, lineHeight: '18px', marginLeft: '2px' }}>
            {filterCount} filtre
          </span>
        )}
        {blockCount > 0 && (
          <span style={{ backgroundColor: '#b45309', color: '#fff', borderRadius: '9999px', padding: '1px 7px', fontSize: '11px', fontWeight: 700, lineHeight: '18px', marginLeft: '2px' }}>
            {blockCount} bloc
          </span>
        )}
      </button>
    </div>
  );
}

// ─── Wrapper (provider + toggle) ────────────────────────────
export function EditorWrapper({ children }: { children: ReactNode }) {
  const [editorMode, setEditorMode]             = useState(false);
  const [imageOverrides, setImageOverrides]     = useState<Record<string, string>>({});
  const [textOverrides, setTextOverrides]       = useState<Record<string, string>>({});
  const [imageTransforms, setImageTransformsState] = useState<Record<string, ImageTransform>>({});
  const [heroLayouts, setHeroLayoutsState]      = useState<Record<string, number>>({});
  const [imageFilters, setImageFiltersState]    = useState<Record<string, ImageFilter>>({});
  const [frameSizes, setFrameSizesState]        = useState<Record<string, FrameSize>>({});
  const [freeBlocks, setFreeBlocksState]        = useState<FreeBlock[]>([]);

  // ── Load from server JSON (saved overrides) then localStorage ─
  useEffect(() => {
    fetch('/api/studio/load')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          if (data.imageOverrides)  setImageOverrides(data.imageOverrides);
          if (data.textOverrides)   setTextOverrides(data.textOverrides);
          if (data.imageTransforms) setImageTransformsState(data.imageTransforms);
          if (data.heroLayouts)     setHeroLayoutsState(data.heroLayouts);
          if (data.imageFilters)    setImageFiltersState(data.imageFilters);
          if (data.frameSizes)      setFrameSizesState(data.frameSizes);
          if (data.freeBlocks)      setFreeBlocksState(data.freeBlocks);
        }
      })
      .catch(() => {
        // Fallback to localStorage
        try { const s = localStorage.getItem(IMAGE_STORAGE_KEY);     if (s) setImageOverrides(JSON.parse(s));        } catch { /* ignore */ }
        try { const s = localStorage.getItem(TEXT_STORAGE_KEY);      if (s) setTextOverrides(JSON.parse(s));         } catch { /* ignore */ }
        try { const s = localStorage.getItem(TRANSFORM_STORAGE_KEY); if (s) setImageTransformsState(JSON.parse(s));  } catch { /* ignore */ }
        try { const s = localStorage.getItem(LAYOUT_STORAGE_KEY);    if (s) setHeroLayoutsState(JSON.parse(s));      } catch { /* ignore */ }
        try { const s = localStorage.getItem(FILTER_STORAGE_KEY);    if (s) setImageFiltersState(JSON.parse(s));     } catch { /* ignore */ }
        try { const s = localStorage.getItem(FRAME_STORAGE_KEY);     if (s) setFrameSizesState(JSON.parse(s));       } catch { /* ignore */ }
        try { const s = localStorage.getItem(BLOCK_STORAGE_KEY);     if (s) setFreeBlocksState(JSON.parse(s));       } catch { /* ignore */ }
      });
  }, []);

  // ── Persist imageOverrides ─────────────────────────────────
  useEffect(() => {
    try {
      if (Object.keys(imageOverrides).length > 0) localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(imageOverrides));
      else localStorage.removeItem(IMAGE_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [imageOverrides]);

  // ── Persist textOverrides ──────────────────────────────────
  useEffect(() => {
    try {
      if (Object.keys(textOverrides).length > 0) localStorage.setItem(TEXT_STORAGE_KEY, JSON.stringify(textOverrides));
      else localStorage.removeItem(TEXT_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [textOverrides]);

  // ── Persist imageTransforms ────────────────────────────────
  useEffect(() => {
    try {
      if (Object.keys(imageTransforms).length > 0) localStorage.setItem(TRANSFORM_STORAGE_KEY, JSON.stringify(imageTransforms));
      else localStorage.removeItem(TRANSFORM_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [imageTransforms]);

  // ── Persist heroLayouts ────────────────────────────────────
  useEffect(() => {
    try {
      if (Object.keys(heroLayouts).length > 0) localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(heroLayouts));
      else localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [heroLayouts]);

  // ── Persist imageFilters ───────────────────────────────────
  useEffect(() => {
    try {
      if (Object.keys(imageFilters).length > 0) localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(imageFilters));
      else localStorage.removeItem(FILTER_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [imageFilters]);

  // ── Persist frameSizes ─────────────────────────────────────
  useEffect(() => {
    try {
      if (Object.keys(frameSizes).length > 0) localStorage.setItem(FRAME_STORAGE_KEY, JSON.stringify(frameSizes));
      else localStorage.removeItem(FRAME_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [frameSizes]);

  // ── Persist freeBlocks ─────────────────────────────────────
  useEffect(() => {
    try {
      if (freeBlocks.length > 0) localStorage.setItem(BLOCK_STORAGE_KEY, JSON.stringify(freeBlocks));
      else localStorage.removeItem(BLOCK_STORAGE_KEY);
    } catch { /* ignore */ }
  }, [freeBlocks]);

  const toggleEditor         = useCallback(() => setEditorMode((p) => !p), []);
  const setImageOverride     = useCallback((key: string, dataURL: string) => setImageOverrides((p) => ({ ...p, [key]: dataURL })), []);
  const setTextOverride      = useCallback((key: string, value: string) => setTextOverrides((p) => ({ ...p, [key]: value })), []);
  const setImageTransform    = useCallback((key: string, t: ImageTransform) => setImageTransformsState((p) => ({ ...p, [key]: t })), []);
  const setHeroLayout        = useCallback((key: string, cardWidth: number) => setHeroLayoutsState((p) => ({ ...p, [key]: cardWidth })), []);
  const setImageFilter       = useCallback((key: string, f: ImageFilter) => setImageFiltersState((p) => ({ ...p, [key]: f })), []);
  const setFrameSize         = useCallback((key: string, s: FrameSize | null) => {
    if (s === null) {
      setFrameSizesState((p) => { const n = { ...p }; delete n[key]; return n; });
    } else {
      setFrameSizesState((p) => ({ ...p, [key]: s }));
    }
  }, []);
  const addFreeBlock         = useCallback((block: FreeBlock) => setFreeBlocksState((p) => [...p, block]), []);
  const updateFreeBlock      = useCallback((id: string, updates: Partial<FreeBlock>) => setFreeBlocksState((p) => p.map(b => b.id === id ? { ...b, ...updates } : b)), []);
  const deleteFreeBlock      = useCallback((id: string) => setFreeBlocksState((p) => p.filter(b => b.id !== id)), []);
  const resetOverrides       = useCallback(() => setImageOverrides({}), []);
  const resetTextOverrides   = useCallback(() => setTextOverrides({}), []);
  const resetImageTransforms = useCallback(() => setImageTransformsState({}), []);
  const resetHeroLayouts     = useCallback(() => setHeroLayoutsState({}), []);
  const resetImageFilters    = useCallback(() => setImageFiltersState({}), []);
  const resetFrameSizes      = useCallback(() => setFrameSizesState({}), []);
  const resetFreeBlocks      = useCallback(() => setFreeBlocksState([]), []);

  return (
    <EditorContext.Provider value={{
      editorMode, imageOverrides, textOverrides, imageTransforms, heroLayouts,
      imageFilters, frameSizes, freeBlocks,
      toggleEditor, setImageOverride, setTextOverride, setImageTransform, setHeroLayout,
      setImageFilter, setFrameSize, addFreeBlock, updateFreeBlock, deleteFreeBlock,
      resetOverrides, resetTextOverrides, resetImageTransforms, resetHeroLayouts,
      resetImageFilters, resetFrameSizes, resetFreeBlocks,
    }}>
      {children}
      <EditorToggle />
      <EditorBlockLayer />
    </EditorContext.Provider>
  );
}
