import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const METADATA_PATH = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { index, section, category, title, description, tags } = body;
  const metadata = JSON.parse(await fs.readFile(METADATA_PATH, 'utf-8'));
    if (typeof index !== 'number' || index < 0 || index >= metadata.length) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }
    metadata[index].section = section;
    metadata[index].category = category;
    metadata[index].title = title;
    metadata[index].description = description;
    metadata[index].tags = typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
    await fs.writeFile(METADATA_PATH, JSON.stringify(metadata, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to edit image.' }, { status: 500 });
  }
}
