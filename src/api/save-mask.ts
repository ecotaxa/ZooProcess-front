import pako from 'pako';

export async function saveMaskViaApi(matrix: number[][], srcFilename: string, folder: string) {
  const blob = new Blob([getCompressedArrayFromMatrix(matrix)]);

  const mask_post_url = folder.replace('vignette', 'vignette_mask') + '/' + srcFilename;
  await sendBlobToServer(mask_post_url, 'application/gzip', blob);
}

export async function simulateMaskViaApi(matrix: number[][], srcFilename: string, folder: string) {
  const blob = new Blob([getCompressedArrayFromMatrix(matrix)]);

  const mask_maybe_post_url = folder.replace('vignette', 'vignette_mask_maybe') + '/' + srcFilename;
  return await sendBlobToServer(mask_maybe_post_url, 'application/gzip', blob);
}

function getCompressedArrayFromMatrix(matrix: number[][]) {
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
  return compressed;
}

async function sendBlobToServer(url: string, mimeType: string, buffer: Blob) {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // Create a file from the buffer
    // The File constructor takes (parts, filename, options)
    const file = new File([buffer], 'mask', {
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
    // console.log('Upload successful:', result);
    return result;
  } catch (error) {
    // console.error('Error uploading buffer:', error);
    throw error;
  }
}
