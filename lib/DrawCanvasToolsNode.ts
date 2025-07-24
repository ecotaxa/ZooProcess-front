import pako from 'pako';
import fs from 'fs/promises';

import { readMatrixFromBinary, readMatrixFromCompressedBinary } from '@/components/DrawCanvasTools';

export async function readMatrixFromUniversalFile(filePath: string): Promise<number[][]> {
  try {
    const buffer = await fs.readFile(filePath);
    // console.log("Header buffer (hex):", Buffer.from(buffer).toString('hex').slice(0, 16));

    const headerHex = buffer.slice(0, 2).toString('hex');
    if (headerHex === '789c' || headerHex === '78da') {
      // deflate
      const decompressed = pako.inflate(buffer);
      return readMatrixFromCompressedBinary(decompressed.buffer);
    } else if (headerHex === '1f8b') {
      // gzip
      const decompressed = pako.ungzip(buffer);
      return readMatrixFromCompressedBinary(decompressed.buffer);
    } else {
      // RAW
      return readMatrixFromCompressedBinary(buffer.buffer);
    }
  } catch (err) {
    console.error('❌ Failed to read compressed matrix file:', err);
    throw err;
  }
}

export async function writeCompressedMatrix(filePath: string, width = 64, height = 64) {
  // Génère le buffer raw
  const buffer = new ArrayBuffer(8 + Math.ceil((width * height) / 8));
  const view = new DataView(buffer);
  view.setUint32(0, width, true);
  view.setUint32(4, height, true);

  // (remplis les bits comme tu veux, carré, points, etc.)

  // Compresse en gzip
  const gzipped = pako.gzip(new Uint8Array(buffer));
  await fs.writeFile(filePath, Buffer.from(gzipped));
  console.log(`🟩 Fichier matrix GZIP généré à : ${filePath}`);
}

export function createZeroMatrix(width: number, height: number): number[][] {
  return Array.from({ length: height }, () => Array(width).fill(0));
}

/**
 * Lit un fichier compressé contenant des coordonnées x,y en octets
 * @param filePath Chemin vers le fichier compressé (.gz ou pako.deflate)
 * @returns Liste de coordonnées [x, y] en nombre entiers
 */
export async function readMatrixFromCompressedFile(filePath: string): Promise<number[][]> {
  try {
    const buffer = await fs.readFile(filePath);
    // console.log("Header buffer (hex):", Buffer.from(buffer).toString('hex').slice(0, 16));

    const decompressed = pako.inflate(buffer); // Uint8Array

    return readMatrixFromBinary(decompressed.buffer);

    // const matrix: number[][] = [];
    // for (let i = 0; i < decompressed.length; i += 2) {
    //   const x = decompressed[i];
    //   const y = decompressed[i + 1];
    //   if (y !== undefined) matrix.push([x, y]);
    // }

    // return matrix;
  } catch (err) {
    console.error('❌ Failed to read compressed matrix file:', err);
    throw err;
  }
}
