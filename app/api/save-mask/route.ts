import fs from 'fs/promises';
import path from 'path';
import { readMatrixFromCompressedBinary } from '@/components/DrawCanvasTools'; // doit être un module Node, pas client !
import { createCanvas, loadImage } from 'canvas';
import { REAL_FOLDER, API_TOOLS_SERVER } from '@/constants';

export async function POST(req: NextRequest) {
  const gzFilename = req.headers.get('x-filename');
  const folder = req.headers.get('x-folder') || '';
  if (!gzFilename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }
  const savePath = path.join(REAL_FOLDER, folder, gzFilename);
  const buffer = Buffer.from(await req.arrayBuffer());

  try {
    // 1. Sauve le .gz
    if (folder.startsWith('/api/backend')) {
      // Just send the updated mask and let backend deal with it
      const mask_post_url = API_TOOLS_SERVER + '/vignette_mask/' + gzFilename;
      console.log('uploading mask_post_url', mask_post_url);
      await sendBufferToServer(mask_post_url, 'application/gzip', buffer);
      return NextResponse.json({ ok: true });
    } else {
      await fs.writeFile(savePath, buffer);
    }

    // 2. Relis la matrice
    const matrix = readMatrixFromCompressedBinary(buffer.buffer);

    // 3. Trouve le fichier image source
    const base = gzFilename.replace(/_mask\.gz$/, '');
    const scanFilename = base + '.jpg'; // adapte si besoin
    const imgPath = path.join(REAL_FOLDER, folder, scanFilename);

    // 4. Charge l’image source
    const img = await loadImage(imgPath);
    const width = img.width;
    const height = img.height;

    // 5. Génère le PNG mask (remplace l’ancien)
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const color = [255, 0, 0, 200]; // Rouge semi-transparent

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (matrix[y][x] === 1) {
          const index = (y * width + x) * 4;
          data[index] = color[0];
          data[index + 1] = color[1];
          data[index + 2] = color[2];
          data[index + 3] = color[3];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // 6. Save PNG
    const maskPngFilename = gzFilename.replace(/\.gz$/, '.png');
    const maskPngPath = path.join(REAL_FOLDER, folder, maskPngFilename);
    const bufferPng = canvas.toBuffer('image/png');
    await fs.writeFile(maskPngPath, bufferPng);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendBufferToServer(url: string, mimeType: string, buffer: Buffer) {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // Create a file from the buffer
    // The File constructor takes (parts, filename, options)
    const file = new File([buffer], path.basename(url), {
      type: mimeType,
    });

    // Append the file to the FormData
    formData.append('file', file);

    // Send the FormData as the request body
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header when sending FormData
      // It will be set automatically with the correct boundary
    });

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  } catch (error) {
    console.error('Error uploading buffer:', error);
    throw error;
  }
}
