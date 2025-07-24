import { readMatrixFromCompressedBinary } from '@/components/DrawCanvasTools';
import path from 'path';
import fs from 'fs/promises';
import { API_SERVER } from '@/constants';

export interface VignetteData {
  scan: string;
  matrix: string;
  mask?: string;
  vignettes?: string[];
}

export interface VignetteResponse {
  data: VignetteData[];
  folder: string;
}

export async function fetchVignetteData(): Promise<VignetteResponse> {
  const baseURL = API_SERVER;
  const fullUrl = `${baseURL}/vignettes`;

  console.log('🔍 fetchVignetteData:', { fullUrl });

  const response = await fetch(fullUrl, { cache: 'no-store' });

  if (!response.ok) throw new Error('Failed to fetch vignette data');

  const { data, folder } = await response.json();
  const folderPath = path.resolve('public', folder.replace(/^\/+/, ''));

  const dataUpdated = await Promise.all(
    data.map(async (item: VignetteData) => {
      if (!item.mask && item.matrix) {
        try {
          const matrixPath = path.join(folderPath, item.matrix);
          const buffer = await fs.readFile(matrixPath);
          const matrix = readMatrixFromCompressedBinary(new Uint8Array(buffer).buffer);
          const scanPath = path.join(folderPath, item.scan);
          const maskPath = await generateMask(scanPath, matrix, folderPath);
          return {
            ...item,
            mask: path.basename(maskPath),
          };
        } catch (err) {
          console.error(`Error generating mask for ${item.scan}`, err);
        }
      }
      return item;
    })
  );

  return { data: dataUpdated, folder };
}

export async function generateMask(
  imagePath: string,
  matrix: number[][],
  outputDir: string
): Promise<string> {
  const { createCanvas, loadImage } = await import('canvas');
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
  ctx.fillStyle = 'rgba(255, 0, 0, 255)';
  matrix.forEach(([x, y]) => {
    ctx.fillRect(x, y, 1, 1);
  });

  const maskFilename = `${path.parse(imagePath).name}_mask.png`;
  const outputPath = path.join(outputDir, maskFilename);
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);

  return outputPath;
}
