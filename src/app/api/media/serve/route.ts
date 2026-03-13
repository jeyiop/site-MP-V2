import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MEDIA_ROOT = path.join('E:', 'Dropbox', '1\uD83D\uDCBC_MULTIPOLES', 'Media');

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path') || '';
  // Security: prevent path traversal
  const resolved = path.resolve(path.join(MEDIA_ROOT, filePath));
  if (!resolved.startsWith(path.resolve(MEDIA_ROOT))) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  try {
    const data = fs.readFileSync(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    return new NextResponse(data, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
