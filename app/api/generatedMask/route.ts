import path from 'path';
import fs from 'fs/promises';
// import { readMatrixFromCompressedFile } from '@/components/DrawCanvasTools';
import { createCanvas, loadImage } from 'canvas';
import { readMatrixFromCompressedFile } from '@/lib/DrawCanvasToolsNode';

export async function GET(req: NextRequest) {
  const scan = req.nextUrl.searchParams.get('scan');
  const folder = req.nextUrl.searchParams.get('folder');
  const matrix = req.nextUrl.searchParams.get('matrix');

  if (!scan || !folder || !matrix) {
    console.error('Missing query params:', { scan, folder, matrix });
    return NextResponse.json({ mask: null }, { status: 400 });
  }

  console.log('---- 🟢 AVANT TRY----');

  try {
    console.log('---- 🟢 DEBUT TRAITEMENT MASK ----');

    const publicRoot = path.resolve(process.cwd(), 'public');
    const cleanFolder = folder.replace(/^\/+/g, '');
    const folderPath = path.resolve(publicRoot, cleanFolder);
    const matrixPath = path.join(folderPath, matrix);

    // LOG: paths utilisés
    console.log('📂 folderPath:', folderPath);
    console.log('📄 matrixPath:', matrixPath);

    // LECTURE DE LA MATRICE
    const matrixData = await readMatrixFromCompressedFile(matrixPath);
    console.log('🧩 matrixData sample:', matrixData.slice(0, 10));
    console.log('🧩 matrixData length:', matrixData.length);

    // LECTURE DE L'IMAGE
    const scanPath = path.join(folderPath, scan);
    const image = await loadImage(scanPath);
    console.log('🖼️ image loaded:', scanPath);
    console.log('🖼️ image dimensions:', image.width, image.height);

    // CANVAS
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    // Test: carré rouge (on doit le voir dans le PNG généré)
    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    ctx.fillRect(10, 10, 20, 20);

    // DESSIN DES POINTS DE LA MATRICE
    ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    matrixData.forEach(([x, y]) => {
      ctx.fillRect(x, y, 1, 1);
    });

    const maskFilename = `${path.parse(scanPath).name}_mask.png`;
    const outputPath = path.join(folderPath, maskFilename);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buffer);

    console.log('✅ mask generated at:', outputPath);

    return NextResponse.json({ mask: path.basename(outputPath) });
  } catch (err) {
    console.error('❌ Error in /api/generateMask:', err);
    return NextResponse.json({ mask: null }, { status: 500 });
  }
}
