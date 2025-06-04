
import pako from "pako";
// import fs from 'fs/promises';


/** 
color = [R,G,B,A]
*/
export function mergeImageWithMatrix(
  backgroundImg: HTMLImageElement,
  binaryMatrix: number[][],
  color: [number, number, number, number] = [255, 255, 255, 255] // ⬅️ default white
): HTMLCanvasElement {
  const width = backgroundImg.width;
  const height = backgroundImg.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D");

  ctx.drawImage(backgroundImg, 0, 0);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (binaryMatrix[y][x] === 1) {
        data[index] = color[0];     // R
        data[index + 1] = color[1]; // G
        data[index + 2] = color[2]; // B
        data[index + 3] = color[3]; // A
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function saveMatrixAsCompressedBinary(matrix: number[][], filename = "matrix.gz") {
  const height = matrix.length;
  const width = matrix[0]?.length || 0;
  const rowBytes = Math.ceil(width / 8);
  const raw = new Uint8Array(8 + height * rowBytes);

  const view = new DataView(raw.buffer);
  view.setUint32(0, width, true);
  view.setUint32(4, height, true);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const byteIndex = 8 + y * rowBytes + (x >> 3);
      const bit = 7 - (x % 8);
      if (matrix[y][x]) {
        raw[byteIndex] |= 1 << bit;
      }
    }
  }

  const compressed = pako.deflate(raw);

  const blob = new Blob([compressed], { type: "application/gzip" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}



 

export function saveMatrixToFile(matrix: number[][], filename = "matrix.json") {
  const blob = new Blob([JSON.stringify(matrix)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function saveMatrixAsBinary(matrix: number[][], filename = "matrix.bin") {
  const height = matrix.length;
  const width = matrix[0]?.length || 0;
  const rowBytes = Math.ceil(width / 8);
  const buffer = new Uint8Array(8 + height * rowBytes);

  // Stocker dimensions (4 octets pour width, 4 pour height)
  const view = new DataView(buffer.buffer);
  view.setUint32(0, width, true);   // Little endian
  view.setUint32(4, height, true);

  // Encoder les bits ligne par ligne
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const byteIndex = 8 + y * rowBytes + (x >> 3);
      const bit = 7 - (x % 8);
      if (matrix[y][x]) {
        buffer[byteIndex] |= 1 << bit;
      }
    }
  }

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Read the mask matrix
 * How to use it 
 * import { readMatrixFromCompressedBinary } from "@/components/DrawCanvas";
 * const buffer = await file.arrayBuffer();
 * const matrix = readMatrixFromCompressedBinary(buffer); 
 */
export function readMatrixFromBinary(buffer: ArrayBuffer): number[][] {
  const view = new DataView(buffer);
  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const rowBytes = Math.ceil(width / 8);
  const data = new Uint8Array(buffer, 8); // skip header

  const matrix: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const byte = data[y * rowBytes + (x >> 3)];
      const bit = 7 - (x % 8);
      row.push((byte >> bit) & 1);
    }
    matrix.push(row);
  }

  return matrix;
}


export function readMatrixFromCompressedBinary(buffer: ArrayBuffer): number[][] {
  const decompressed = pako.inflate(new Uint8Array(buffer));
  const view = new DataView(decompressed.buffer, decompressed.byteOffset, decompressed.byteLength);

  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const rowBytes = Math.ceil(width / 8);
  const data = new Uint8Array(decompressed.buffer, decompressed.byteOffset + 8);

  const matrix: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const byte = data[y * rowBytes + (x >> 3)];
      const bit = 7 - (x % 8);
      row.push((byte >> bit) & 1);
    }
    matrix.push(row);
  }

  return matrix;
}



