import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dataDir = join(process.cwd(), 'data');
    const { mkdirSync, existsSync: ex } = require('fs');
    if (!ex(dataDir)) mkdirSync(dataDir, { recursive: true });
    const filePath = join(dataDir, 'editor-overrides.json');
    writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
