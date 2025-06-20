import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs'; // pour le check existsSync
import pLimit from 'p-limit';

import { 
          readMatrixFromCompressedBinary, 
          // readMatrixFromCompressedFile, 
          // createZeroMatrix, 
          // writeCompressedMatrix 
        } from '@/components/DrawCanvasTools';
// import pako from 'pako';
import { createCanvas, loadImage } from 'canvas';
import { createZeroMatrix, readMatrixFromCompressedFile, writeCompressedMatrix } from '@/lib/DrawCanvasToolsNode';

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



export async function writeFakeMatrix(filePath: string, width = 64, height = 64) {
  // HEADER
  const buffer = new ArrayBuffer(8 + Math.ceil((width * height) / 8));
  const view = new DataView(buffer);

  view.setUint32(0, width, true);   // Little Endian
  view.setUint32(4, height, true);  // Little Endian

  // DATA (un carré 16x16 au centre)
  let byteIdx = 8, bitIdx = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let inSquare =
        x >= width / 2 - 8 && x < width / 2 + 8 &&
        y >= height / 2 - 8 && y < height / 2 + 8;
      if (inSquare) {
        const byteOffset = byteIdx + ((y * width + x) >> 3);
        const bitOffset = (y * width + x) % 8;
        const current = view.getUint8(byteOffset);
        view.setUint8(byteOffset, current | (1 << bitOffset));
      }
    }
  }

  // Écriture du buffer dans le fichier
  await fs.writeFile(filePath, Buffer.from(buffer));
  // console.log(`🟩 Fichier matrix généré à : ${filePath}`);
}
export async function fetchVignetteData(
  projectId: string,
  sampleId: string,
  subsampleId: string
): Promise<VignetteResponse> {
  const baseURL = process.env.NEXT_PUBLIC_API_SERVER!;
  const fullUrl = `${baseURL}/vignettes/${projectId}/${sampleId}/${subsampleId}`;

  console.log('🔍 fetchVignetteData:', { fullUrl, projectId, sampleId, subsampleId });

  const response = await fetch(fullUrl, { cache: 'no-store' });

  if (!response.ok) {
    console.debug("Response status:", response.status);
    console.debug("Response text:", response.statusText);
    console.debug("Response body:", await response.text());
    console.error("Error fetching vignette data");
    throw new Error('Failed to fetch vignette data');
  }

  const { data, folder } = await response.json();
  let folderClean;
  if (folder.startsWith("/api/backend")) {
    folderClean = folder;
  } else {
    folderClean = folder.replace(/^\/+/, '');
  }
  const folderPath = path.resolve('public', folderClean);

  // SQUINCHOLE PATCH : Limite à 5 en parallèle
  const limit = pLimit(5);

  const dataUpdated = await Promise.all(
    data.map((item: VignetteData) => limit(async (): Promise<VignetteData> => {
      if (!item.mask && item.matrix) {
        try {
          const matrixPath = path.join(folderPath, item.matrix);
          const scanPath = path.join(folderPath, item.scan);
          const maskFilename = `${path.parse(scanPath).name}_mask.png`;
          const maskPath = path.join(folderPath, maskFilename);

          // (1) MASK PNG : skip si déjà là
          if (fsSync.existsSync(maskPath)) {
            return { ...item, mask: maskFilename };
          }

          // (2) Génère le matrix.gz si absent :
          let mustWriteGz = false;
          if (!fsSync.existsSync(matrixPath)) {
            // Charge l'image pour dimensions
            const img = await loadImage(scanPath);
            await writeCompressedMatrix(matrixPath, img.width, img.height);
            mustWriteGz = true;
            console.log(`🟦 Matrix gz créé pour ${item.scan}: ${matrixPath}`);
          }

          // (3) Charge matrix : sécurité/robustesse
          let matrix: number[][];
          try {
            matrix = await readMatrixFromCompressedFile(matrixPath);
            // Vérifie la taille
            const img = await loadImage(scanPath);
            if (
              !Array.isArray(matrix) ||
              matrix.length !== img.height ||
              matrix[0].length !== img.width
            ) {
              throw new Error('Matrix dimensions mismatch');
            }
          } catch (err) {
            // Fallback all zero
            const img = await loadImage(scanPath);
            console.warn(`⚠️ Matrix KO for ${item.scan}, using all zero [${img.width}x${img.height}]`);
            matrix = createZeroMatrix(img.width, img.height);
          }

          // (4) Génère le mask PNG
          const generatedMaskPath = await generateMaskFromMatrix(scanPath, matrix, folderPath);

          return { ...item, mask: path.basename(generatedMaskPath) };
        } catch (err) {
          console.error(`Error generating mask for ${item.scan}`, err);
        }
      }
      return item;
    }))
  );

  return { data: dataUpdated, folder };
}


export async function generateMaskFromCompressedMatrix(
  scanPath: string,
  matrixPath: string,
  outputDir: string
): Promise<string> {
  // const compressed = await fs.readFile(matrixPath);
  // const decompressed = pako.inflate(compressed);
  // const matrix = readMatrixFromCompressedBinary(decompressed.buffer);
  const buffer = await fs.readFile(matrixPath);
const matrix = readMatrixFromCompressedBinary(buffer.buffer); // ou buffer si ta fonction accepte Buffer

  const image = await loadImage(scanPath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  ctx.fillStyle = 'rgba(255,0,0,1)';
  matrix.forEach(([x, y]) => {
    ctx.fillRect(x, y, 1, 1);
  });

  const maskFilename = `${path.parse(scanPath).name}_mask.png`;
  const outputPath = path.join(outputDir, maskFilename);
  const bufferPng = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, bufferPng);

  console.log('✅ Mask generated at:', outputPath);
  return outputPath;
}

export async function generateMaskFromMatrix(
  scanPath: string,
  matrix: number[][],
  outputDir: string
): Promise<string> {
  const image = await loadImage(scanPath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  // ctx.fillStyle = 'rgba(255,0,0,1)';
  // matrix.forEach(([x, y]) => {
  //   ctx.fillRect(x, y, 1, 1);
  // });
const width = image.width;
const height = image.height;
const imageData = ctx.getImageData(0, 0, width, height);
const data = imageData.data;

const color = [255, 0, 0, 200]; // rouge avec alpha

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (matrix[y][x] === 1) {
      const index = (y * width + x) * 4;
      data[index]     = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = color[3];
    }
  }
}
ctx.putImageData(imageData, 0, 0);


  const maskFilename = `${path.parse(scanPath).name}_mask.png`;
  const outputPath = path.join(outputDir, maskFilename);
  const bufferPng = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, bufferPng);

  console.log('✅ Mask generated at:', outputPath);
  return outputPath;
}
