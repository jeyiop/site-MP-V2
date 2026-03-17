'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, FreeBlock } from './EditorWrapper';
import { ImageGalleryModal } from './EditableImage';

function BlockTypePicker({ onPick, onClose }: { onPick: (type: FreeBlock['type']) => void; onClose: () => void }) {
  const types: { type: FreeBlock['type']; label: string; icon: string; desc: string }[] = [
    { type: 'text',  label: 'Texte',  icon: 'T',  desc: 'Titre, paragraphe, légende' },
    { type: 'image', label: 'Image',  icon: '🖼', desc: 'Photo, logo, visuel' },
    { type: 'mixed', label: 'Mixte',  icon: '☰',  desc: 'Image + texte caption' },
  ];
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000000, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 24px 60px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 360 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#000B58' }}>Créer un bloc</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {types.map(t => (
            <button key={t.type} onClick={() => onPick(t.type)}
              style={{ flex: 1, padding: '20px 12px', borderRadius: 12, border: '2px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#000B58'; e.currentTarget.style.backgroundColor = '#f0f4ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}>
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <span style={{ fontWeight: 700, color: '#000B58', fontSize: 14 }}>{t.label}</span>
              <span style={{ fontSize: 11, color: '#888', textAlign: 'center' }}>{t.desc}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
      </div>
    </div>,
    document.body
  );
}

// ── Single block — position:absolute via portal to body, scrolls naturally ──
function FreeBlockComp({ block, editable, selected, onSelect, onUpdate, onDelete }: {
  block: FreeBlock; editable: boolean; selected: boolean;
  onSelect: () => void; onUpdate: (u: Partial<FreeBlock>) => void; onDelete: () => void;
}) {
  const dragRef = useRef<{ startX: number; startY: number; startBx: number; startBy: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleGallerySelect = useCallback((url: string) => { onUpdate({ imageUrl: url }); setShowGallery(false); }, [onUpdate]);
  const handleFileUpload = useCallback(() => { setShowGallery(false); fileInputRef.current?.click(); }, []);
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const d = ev.target?.result as string; if (d) onUpdate({ imageUrl: d }); };
    reader.readAsDataURL(file); e.target.value = '';
  }, [onUpdate]);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editable || (e.target as HTMLElement).dataset.handle) return;
    e.stopPropagation();
    if (!selected) { onSelect(); return; }
    (e.currentTarget).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startBx: block.x, startBy: block.y };
  };
  const doDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !editable) return;
    onUpdate({ x: dragRef.current.startBx + (e.clientX - dragRef.current.startX), y: dragRef.current.startBy + (e.clientY - dragRef.current.startY) });
  };
  const stopDrag = () => { dragRef.current = null; };

  const startResize = (e: React.PointerEvent, dir: string) => {
    e.stopPropagation(); (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const sX = e.clientX, sY = e.clientY, sW = block.w, sH = block.h;
    const onMove = (ev: PointerEvent) => {
      const u: Partial<FreeBlock> = {};
      if (dir.includes('e')) u.w = Math.max(80, sW + (ev.clientX - sX));
      if (dir.includes('s')) u.h = Math.max(40, sH + (ev.clientY - sY));
      if (dir.includes('w')) u.w = Math.max(80, sW - (ev.clientX - sX));
      if (dir.includes('n')) u.h = Math.max(40, sH - (ev.clientY - sY));
      onUpdate(u);
    };
    const onUp = () => { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
    document.addEventListener('pointermove', onMove); document.addEventListener('pointerup', onUp);
  };

  const bg = block.bgColor ?? (block.type === 'text' ? 'rgba(255,255,255,0.95)' : '#f0f4ff');
  const tc = block.textColor ?? '#000B58';
  const fs = block.fontSize ?? 16;
  const fw = block.fontWeight ?? 600;
  const ta = block.textAlign ?? 'left';
  const br = block.borderRadius ?? 8;
  const pad = block.padding ?? 16;

  const hs = (cursor: string): React.CSSProperties => ({
    position: 'absolute' as const, width: 10, height: 10, backgroundColor: '#fff',
    border: '2px solid #000B58', borderRadius: 2, cursor, zIndex: 1,
  });

  if (!mounted) return null;

  // All block rendering goes through a portal to document.body
  // Using position:absolute so blocks stay at their page position and scroll naturally
  return createPortal(
    <>
      {/* ── BLOCK ── always rendered, always visible */}
      <div
        data-free-block-inner
        onPointerDown={startDrag} onPointerMove={doDrag} onPointerUp={stopDrag}
        style={{
          position: 'absolute', left: block.x, top: block.y, width: block.w, height: block.h,
          zIndex: 9990, backgroundColor: bg, borderRadius: br, padding: pad,
          opacity: block.opacity ?? 1, overflow: 'hidden',
          cursor: editable ? (selected ? 'move' : 'pointer') : 'default',
          boxShadow: editable && selected ? '0 0 0 2px #000B58, 0 8px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.15)',
          userSelect: 'none',
          pointerEvents: editable ? 'auto' : 'none',
        }}
      >
        {(block.type === 'image' || block.type === 'mixed') && block.imageUrl && (
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        {editable && (block.type === 'image' || block.type === 'mixed') && !block.imageUrl && (
          <div onClick={(e) => { e.stopPropagation(); setShowGallery(true); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa', fontSize: 13, flexDirection: 'column', gap: 8, cursor: 'pointer' }}>
            <span style={{ fontSize: 32 }}>🖼</span><span>Cliquer pour choisir une image</span>
          </div>
        )}
        {(block.type === 'text' || block.type === 'mixed') && (
          <div contentEditable={editable && editing} suppressContentEditableWarning
            onDoubleClick={() => editable && setEditing(true)}
            onBlur={e => { setEditing(false); if (editable) onUpdate({ text: e.currentTarget.textContent ?? '' }); }}
            style={{
              position: block.type === 'mixed' ? 'absolute' : 'relative',
              bottom: block.type === 'mixed' ? 0 : undefined, left: block.type === 'mixed' ? 0 : undefined, right: block.type === 'mixed' ? 0 : undefined,
              padding: block.type === 'mixed' ? '8px 12px' : 0,
              backgroundColor: block.type === 'mixed' ? 'rgba(0,0,0,0.55)' : 'transparent',
              color: block.type === 'mixed' ? '#fff' : tc,
              fontSize: fs, fontWeight: fw, textAlign: ta,
              outline: editing ? '2px solid #ffd580' : 'none', minHeight: 24,
              cursor: editing ? 'text' : 'inherit', zIndex: 2, wordBreak: 'break-word',
            }}>
            {block.text ?? (block.type === 'text' ? 'Double-cliquer pour éditer...' : 'Légende')}
          </div>
        )}

        {/* Resize handles (editor+selected only) */}
        {editable && selected && (
          <>
            <div data-handle="se" onPointerDown={e => startResize(e, 'se')} style={{ ...hs('se-resize'), right: -5, bottom: -5 }} />
            <div data-handle="s"  onPointerDown={e => startResize(e, 's')}  style={{ ...hs('s-resize'),  bottom: -5, left: '50%', transform: 'translateX(-50%)' }} />
            <div data-handle="e"  onPointerDown={e => startResize(e, 'e')}  style={{ ...hs('e-resize'),  right: -5,  top: '50%',  transform: 'translateY(-50%)' }} />
            <div data-handle="ne" onPointerDown={e => startResize(e, 'ne')} style={{ ...hs('ne-resize'), right: -5,  top: -5 }} />
            <div data-handle="nw" onPointerDown={e => startResize(e, 'nw')} style={{ ...hs('nw-resize'), left: -5,   top: -5 }} />
            <div data-handle="sw" onPointerDown={e => startResize(e, 'sw')} style={{ ...hs('sw-resize'), left: -5,   bottom: -5 }} />
            <div data-handle="n"  onPointerDown={e => startResize(e, 'n')}  style={{ ...hs('n-resize'),  top: -5,    left: '50%', transform: 'translateX(-50%)' }} />
            <div data-handle="w"  onPointerDown={e => startResize(e, 'w')}  style={{ ...hs('w-resize'),  left: -5,   top: '50%',  transform: 'translateY(-50%)' }} />
          </>
        )}
      </div>

      {/* ── TOOLBAR (editor+selected only) ── */}
      {editable && selected && (
        <div
          data-free-block-inner
          onPointerDown={e => e.stopPropagation()}
          style={{
            position: 'absolute', left: block.x, top: block.y - 38,
            display: 'flex', gap: 4, alignItems: 'center',
            backgroundColor: 'rgba(0,11,88,0.92)', backdropFilter: 'blur(10px)',
            borderRadius: 8, padding: '4px 8px', zIndex: 900001, whiteSpace: 'nowrap',
          }}
        >
          {(block.type === 'image' || block.type === 'mixed') && (
            <button onClick={() => setShowGallery(true)}
              style={{ padding: '2px 8px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              🖼 Changer</button>
          )}
          {(block.type === 'text' || block.type === 'mixed') && (
            <>
              <button onClick={() => onUpdate({ fontWeight: fw === 700 ? 400 : 700 })}
                style={{ width: 24, height: 24, borderRadius: 4, border: 'none', backgroundColor: fw === 700 ? '#fff' : 'rgba(255,255,255,0.15)', color: fw === 700 ? '#000B58' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>B</button>
              <select value={fs} onChange={e => onUpdate({ fontSize: parseInt(e.target.value) })}
                style={{ padding: '2px 4px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                {[12,14,16,18,20,24,28,32,40,48,56,64,72].map(s => <option key={s} value={s} style={{ backgroundColor: '#000B58' }}>{s}px</option>)}
              </select>
              <select value={ta} onChange={e => onUpdate({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
                style={{ padding: '2px 4px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                {(['left','center','right'] as const).map(a => <option key={a} value={a} style={{ backgroundColor: '#000B58' }}>{a === 'left' ? '◀' : a === 'center' ? '▶◀' : '▶'}</option>)}
              </select>
            </>
          )}
          <input type="color" value={bg.startsWith('rgba') ? '#ffffff' : bg} onChange={e => onUpdate({ bgColor: e.target.value })}
            style={{ width: 24, height: 24, borderRadius: 4, border: 'none', padding: 2, cursor: 'pointer' }} title="Couleur fond" />
          <input type="range" min={0.1} max={1} step={0.05} value={block.opacity ?? 1} onChange={e => onUpdate({ opacity: parseFloat(e.target.value) })}
            style={{ width: 50, accentColor: '#ffd580' }} title="Opacité" />
          <input type="range" min={0} max={32} step={2} value={br} onChange={e => onUpdate({ borderRadius: parseInt(e.target.value) })}
            style={{ width: 40, accentColor: '#7dd3fc' }} title="Arrondi" />
          <button onClick={onDelete}
            style={{ width: 24, height: 24, borderRadius: 4, border: 'none', backgroundColor: '#dc2626', color: '#fff', fontSize: 14, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
      )}

      {editable && <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />}
      {showGallery && <ImageGalleryModal onSelect={handleGallerySelect} onClose={() => setShowGallery(false)} onUpload={handleFileUpload} />}
    </>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────
export function EditorBlockLayer() {
  const { editorMode, currentPage, freeBlocks, addFreeBlock, updateFreeBlock, deleteFreeBlock } = useEditor();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter blocks to only show those belonging to the current page
  // Blocks without a page property are treated as belonging to '/' for backward compatibility
  const pageBlocks = freeBlocks.filter(b => (b.page ?? '/') === currentPage);

  useEffect(() => {
    if (!editorMode) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('[data-free-block-inner]')) setSelectedId(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [editorMode]);

  useEffect(() => { if (!editorMode) setSelectedId(null); }, [editorMode]);

  return (
    <>
      {/* Blocks — ALWAYS rendered regardless of editorMode, via portal to body (filtered by current page) */}
      {pageBlocks.map(block => (
        <FreeBlockComp
          key={block.id}
          block={block}
          editable={editorMode}
          selected={editorMode && selectedId === block.id}
          onSelect={() => setSelectedId(block.id)}
          onUpdate={updates => updateFreeBlock(block.id, updates)}
          onDelete={() => { deleteFreeBlock(block.id); setSelectedId(null); }}
        />
      ))}

      {editorMode && (
        <>
          <button onClick={() => setShowPicker(true)} title="Créer un bloc"
            style={{
              position: 'fixed', bottom: '90px', left: '24px', zIndex: 99999,
              display: 'flex', alignItems: 'center', gap: 8,
              backgroundColor: '#000B58', color: '#fff',
              padding: '10px 18px', borderRadius: '9999px',
              fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0,0,0,0.35)', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0a1a78'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000B58'; e.currentTarget.style.transform = 'scale(1)'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Bloc
          </button>
          {showPicker && typeof document !== 'undefined' && (
            <BlockTypePicker onPick={handlePick} onClose={() => setShowPicker(false)} />
          )}
        </>
      )}
    </>
  );

  function handlePick(type: FreeBlock['type']) {
    addFreeBlock({
      id: crypto.randomUUID(), type,
      x: window.innerWidth / 2 - 150,
      y: window.scrollY + window.innerHeight / 2 - 80,
      w: 300, h: type === 'text' ? 80 : 200,
      text: type !== 'image' ? 'Votre texte ici...' : undefined,
      fontSize: type === 'text' ? 20 : 14, fontWeight: 600,
      textColor: '#000B58', textAlign: 'left',
      bgColor: type === 'image' ? '#e8edf5' : '#ffffff',
      borderRadius: 8, padding: 16, opacity: 1,
      page: currentPage,
    });
    setSelectedId(null);
    setShowPicker(false);
  }
}
