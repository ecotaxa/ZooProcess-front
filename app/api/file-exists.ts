import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { filePath } = await req.json();
  
  try {
    const exists = fs.existsSync(filePath);
    return NextResponse.json({ exists });
  } catch (error) {
    return NextResponse.json({ exists: false, error: (error as Error).message });
  }
}
