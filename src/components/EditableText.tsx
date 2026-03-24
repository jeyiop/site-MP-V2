'use client';

import { useRef, useEffect, useLayoutEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditor } from '@/components/EditorWrapper';

// ─── Interface ───────────────────────────────────────────────
export interface EditableTextProps {
  editorKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

// Inject keyframes once globally
let keyframesInjected = false;
function injectKeyframes() {
  if (typeof window === 'undefined' || keyframesInjected) return;
  keyframesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes editablePulse {
      0%,100% { outline-color: rgba(0,11,88,0.3); }
      50%      { outline-color: rgba(0,11,88,0.75); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Toolbar inline ─────────────────────────────────────────
function TextToolbar({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: rect.top + window.scrollY - 38,
      left: rect.left + window.scrollX,
    });
  }, [targetRef]);

  const applyCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    targetRef.current?.focus();
  };

  const btnBase: React.CSSProperties = {
    background: '#1a1a2e',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '4px',
    padding: '2px 7px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '20px',
    minWidth: '26px',
    textAlign: 'center',
  };

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        zIndex: 999999,
        display: 'flex',
        gap: '3px',
        background: '#0d0d1a',
        border: '1px solid rgba(197,165,90,0.3)',
        borderRadius: '8px',
        padding: '4px 6px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button style={btnBase} onClick={() => applyCommand('bold')} title="Gras">B</button>
      <button style={{...btnBase, fontStyle: 'italic'}} onClick={() => applyCommand('italic')} title="Italique">I</button>
      <span style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />
      <button style={btnBase} onClick={() => applyCommand('justifyLeft')} title="Gauche">&#8676;</button>
      <button style={btnBase} onClick={() => applyCommand('justifyCenter')} title="Centre">&#8596;</button>
      <button style={btnBase} onClick={() => applyCommand('justifyRight')} title="Droite">&#8677;</button>
      <span style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />
      <select
        style={{ ...btnBase, padding: '2px 4px', minWidth: '50px' }}
        onChange={(e) => applyCommand('fontSize', e.target.value)}
        defaultValue="3"
        title="Taille"
      >
        <option value="1">XS</option>
        <option value="2">S</option>
        <option value="3">M</option>
        <option value="4">L</option>
        <option value="5">XL</option>
        <option value="6">XXL</option>
      </select>
      <input
        type="color"
        defaultValue="#ffffff"
        onChange={(e) => applyCommand('foreColor', e.target.value)}
        style={{ width: '24px', height: '24px', border: 'none', cursor: 'pointer', background: 'transparent' }}
        title="Couleur"
      />
      <select
        style={{ ...btnBase, padding: '2px 4px', minWidth: '60px' }}
        onChange={(e) => applyCommand('fontName', e.target.value)}
        defaultValue=""
        title="Police"
      >
        <option value="">Police</option>
        <option value="Inter">Inter</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="monospace">Mono</option>
        <option value="Helvetica Neue">Helvetica</option>
      </select>
    </div>,
    document.body,
  );
}

// ─── Composant ───────────────────────────────────────────────
export function EditableText({
  editorKey,
  defaultValue,
  as: Tag = 'span',
  className,
  multiline = false,
}: EditableTextProps) {
  const { editorMode, textOverrides, setTextOverride } = useEditor();
  const ref = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);
  const savedValueRef = useRef<string>(defaultValue);
  const [showToolbar, setShowToolbar] = useState(false);

  const currentValue = (textOverrides ?? {})[editorKey] ?? defaultValue;

  // Inject animation CSS once
  useEffect(() => {
    if (editorMode) injectKeyframes();
  }, [editorMode]);

  // Sync DOM
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || isFocusedRef.current) return;
    if (el.textContent !== currentValue) el.textContent = currentValue;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode, currentValue]);

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
    savedValueRef.current = ref.current?.textContent ?? currentValue;
    setShowToolbar(true);
  }, [currentValue]);

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    setShowToolbar(false);
    const el = ref.current;
    if (!el) return;
    const newValue = (el.textContent ?? '').trim() || savedValueRef.current;
    if (newValue !== savedValueRef.current) {
      setTextOverride(editorKey, newValue);
    }
    el.textContent = newValue;
  }, [editorKey, setTextOverride]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const el = ref.current;
        if (el) el.textContent = savedValueRef.current;
        isFocusedRef.current = false;
        setShowToolbar(false);
        ref.current?.blur();
      }
      if (!multiline && e.key === 'Enter') {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [multiline],
  );

  // ── Non-editor mode: plain render
  if (!editorMode) {
    return <Tag className={className}>{currentValue}</Tag>;
  }

  // ── Editor mode: contentEditable with toolbar
  return (
    <>
      <Tag
        // @ts-expect-error ref typing per tag varies
        ref={ref}
        className={className}
        contentEditable
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          outline: '2px solid rgba(0,11,88,0.35)',
          outlineOffset: '2px',
          borderRadius: '3px',
          cursor: 'text',
          animation: 'editablePulse 1.8s ease-in-out infinite',
          minWidth: '1ch',
          whiteSpace: multiline ? 'pre-wrap' : undefined,
        }}
      />
      {showToolbar && <TextToolbar targetRef={ref} />}
    </>
  );
}
