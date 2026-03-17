import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MEDIA_ROOT = process.env.MEDIA_ROOT || path.join(process.cwd(), 'public', 'media');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);

function listDir(dirPath: string) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    const files = entries
      .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
      .map((e) => e.name);
    return { dirs, files };
  } catch {
    return { dirs: [], files: [] };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subdir = searchParams.get('dir') || '';
  const dirPath = subdir ? path.join(MEDIA_ROOT, subdir) : MEDIA_ROOT;
  return NextResponse.json(listDir(dirPath));
}
