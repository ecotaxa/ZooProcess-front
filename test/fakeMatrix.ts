import fs from 'fs/promises';

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
  console.log(`🟩 Fichier matrix généré à : ${filePath}`);
}