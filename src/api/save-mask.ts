import pako from 'pako';

export async function saveMaskViaApi(matrix: number[][], gzFilename: string, folder: string) {
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

  // Envoie via fetch POST vers l'API
  const res = await fetch('/api/save-mask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Filename': gzFilename, // on transmet le nom du fichier
      'X-Folder': folder, // on transmet le dossier racine (ex: "test/1")
    },
    body: compressed,
  });

  if (!res.ok) {
    throw new Error(`Erreur API save-mask: ${await res.text()}`);
  }
}
