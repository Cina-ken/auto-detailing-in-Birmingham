import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const METADATA_PATH = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public');

export async function POST(req: NextRequest) {
  try {
    const { index } = await req.json();
    const metadataRaw = await fs.readFile(METADATA_PATH, 'utf-8');
    const metadata = JSON.parse(metadataRaw);
    if (typeof index !== 'number' || index < 0 || index >= metadata.length) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
    // Remove images from disk
    const beforeImage = metadata[index].beforeImage;
    const afterImage = metadata[index].afterImage;
    if (beforeImage) {
      const beforePath = path.join(UPLOADS_DIR, beforeImage.replace(/^\//, ''));
  try { await fs.unlink(beforePath); } catch { /* ignore */ }
    }
    if (afterImage) {
      const afterPath = path.join(UPLOADS_DIR, afterImage.replace(/^\//, ''));
  try { await fs.unlink(afterPath); } catch { /* ignore */ }
    }
    // Remove from metadata
    metadata.splice(index, 1);
    await fs.writeFile(METADATA_PATH, JSON.stringify(metadata, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete image.' }, { status: 500 });
  }
}
