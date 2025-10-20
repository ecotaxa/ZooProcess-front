export type RGBA = { r: number; g: number; b: number };

export function contourNonWhite(
  imageCtx: CanvasRenderingContext2D,
  overlayCtx: CanvasRenderingContext2D,
  whitePoints: number[][],
  startX: number,
  startY: number,
  fill: RGBA
) {
  // Contour-following paint: paint only boundary pixels of the 8-connected
  // non-white component that contains the seed. A boundary pixel is a
  // non-white pixel that has at least one 8-neighbor that is white
  // (within tolerance) or lies outside the canvas. White pixels are never painted.
  const { width, height } = imageCtx.canvas; // device pixels
  if (!Number.isFinite(startX) || !Number.isFinite(startY)) return;
  const sx = Math.floor(startX);
  const sy = Math.floor(startY);
  if (sx < 0 || sy < 0 || sx >= width || sy >= height) return;

  const imageDataView = imageCtx.getImageData(0, 0, width, height);
  const imageData = imageDataView.data;
  const overlayDataView = overlayCtx.getImageData(0, 0, width, height);
  const overlayData = overlayDataView.data;

  const fillR = Math.trunc(fill.r);
  const fillG = Math.trunc(fill.g);
  const fillB = Math.trunc(fill.b);

  const coordsToIdx = (x: number, y: number) => (y * width + x) * 4;

  const isWhite = (x: number, y: number) => {
    const i = coordsToIdx(x, y);
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    return (r == 255 && g == 255 && b == 255) || whitePoints[y][x] == 1;
  };

  const setPixel = (x: number, y: number) => {
    const i = coordsToIdx(x, y);
    const previous = imageData[i];
    overlayData[i] = fillR;
    overlayData[i + 1] = fillG;
    overlayData[i + 2] = fillB;
    overlayData[i + 3] = 192 - previous / 2;
  };

  // 8-connected BFS over the non-white components
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];
  const push = (x: number, y: number) => {
    const li = y * width + x;
    if (!visited[li]) {
      visited[li] = 1;
      queue.push(li);
    }
  };

  push(sx, sy);

  const dirs8 = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ] as const;

  while (queue.length) {
    const li = queue.shift()!;
    const y = Math.trunc(li / width);
    const x = li - y * width;

    let needPaint = false;
    for (let k = 0; k < 8; k++) {
      const nx = x + dirs8[k][0];
      const ny = y + dirs8[k][1];
      if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
        if (isWhite(nx, ny)) {
          needPaint = true;
        } else {
          push(nx, ny);
        }
      } else {
        // boundary pixel
        needPaint = true;
      }
    }
    if (needPaint) setPixel(x, y);
  }

  overlayCtx.putImageData(overlayDataView, 0, 0);
}
