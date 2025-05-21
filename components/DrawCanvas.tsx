import React, { useRef, useEffect, useState, useCallback } from "react";
import pako from "pako";


interface DrawCanvasProps {
  imagePath: string;
  onApply?: (matrix: number[][]) => void;
  strokeColor?: string;
  initialMatrix?: number[][];
}

type Tool = "brush" | "eraser";

const CANVAS_POINT_SIZE = 3;
const MIN_ZOOM = 1;
const MAX_ZOOM = 20;

export function mergeImageWithMatrix(
  backgroundImg: HTMLImageElement,
  binaryMatrix: number[][]
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
        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = 255;
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

const DrawCanvas: React.FC<DrawCanvasProps> = ({ imagePath, onApply, strokeColor = "red", initialMatrix }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      setCanvasSize({ width: img.width, height: img.height });
      setImage(img);
    };
  }, [imagePath]);

  useEffect(() => {
    if (initialMatrix && overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.fillStyle = strokeColor;
      for (let y = 0; y < initialMatrix.length; y++) {
        for (let x = 0; x < initialMatrix[y].length; x++) {
          if (initialMatrix[y][x] === 1) {
            ctx.fillRect(x, y, CANVAS_POINT_SIZE, CANVAS_POINT_SIZE);
          }
        }
      }
    }
  }, [initialMatrix, canvasSize, strokeColor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b') setTool('brush');
      if (e.key === 'e') setTool('eraser');
      if (e.key === '+') setZoom(z => Math.min(z + 1, MAX_ZOOM));
      if (e.key === '-') setZoom(z => Math.max(z - 1, MIN_ZOOM));
      if (e.key === '0') setZoom(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      // Ignore trackpad zoom on Mac (pinch gesture) unless ctrl or meta are pressed
      if (e.ctrlKey || e.metaKey) return;

      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left) / zoom;
      const offsetY = (e.clientY - rect.top) / zoom;
      const direction = e.deltaY < 0 ? 1 : -1;

      setZoom(prevZoom => {
        const newZoom = Math.min(Math.max(prevZoom + direction, MIN_ZOOM), MAX_ZOOM);
        const dx = offsetX * (newZoom - prevZoom);
        const dy = offsetY * (newZoom - prevZoom);
        containerRef.current!.scrollLeft += dx;
        containerRef.current!.scrollTop += dy;
        return newZoom;
      });
    };
    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel);
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [zoom]);

  useEffect(() => {
    if (canvasRef.current && image) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.drawImage(image, 0, 0);
    }
  }, [image, canvasSize, zoom]);

  const drawPoint = (x: number, y: number) => {
    const ctx = overlayRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = tool === "brush" ? strokeColor : "transparent";
    if (tool === "brush") {
      ctx.fillRect(x, y, CANVAS_POINT_SIZE, CANVAS_POINT_SIZE);
    } else {
      ctx.clearRect(x, y, CANVAS_POINT_SIZE, CANVAS_POINT_SIZE);
    }
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!isDrawing || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);
    drawPoint(x, y);
  };

  const applyMatrix = () => {
    const ctx = overlayRef.current?.getContext("2d");
    if (!ctx || !overlayRef.current || !image) return;
    const imageData = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
    const data = imageData.data;
    const matrix: number[][] = [];

    for (let y = 0; y < canvasSize.height; y++) {
      const row: number[] = [];
      for (let x = 0; x < canvasSize.width; x++) {
        const index = (y * canvasSize.width + x) * 4;
        const isRed = data[index] === 255 && data[index + 1] === 0 && data[index + 2] === 0;
        row.push(isRed ? 1 : 0);
      }
      matrix.push(row);
    }

    if (onApply) onApply(matrix);
  };

  const getCursor = () => {
    return tool === "brush" ? "crosshair" : "not-allowed";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>
        <div
          ref={containerRef}
          style={{
            maxWidth: "75vw",
            maxHeight: "75vh",
            border: "1px solid #ccc",
            position: "relative",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
              position: "relative",
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: canvasSize.width * zoom,
                height: canvasSize.height * zoom,
                zIndex: 1,
              }}
            />
            <canvas
              ref={overlayRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: canvasSize.width * zoom,
                height: canvasSize.height * zoom,
                zIndex: 2,
                cursor: getCursor(),
              }}
              onMouseDown={handlePointerDown}
              onMouseUp={handlePointerUp}
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerUp}
            />
          </div>
        </div>
        <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <div><strong>Zoom:</strong> x{zoom} | <strong>Trait:</strong> {CANVAS_POINT_SIZE}px</div>
          <button onClick={() => setTool("brush")}>Crayon (b)</button>
          <button onClick={() => setTool("eraser")}>Gomme (e)</button>
          <button onClick={() => setZoom((z) => Math.min(z + 10, MAX_ZOOM))}>Zoom +10</button>
          <button onClick={() => setZoom(1)}>Taille originale (0)</button>
          <button onClick={() => setZoom((z) => Math.max(z - 10, MIN_ZOOM))}>Zoom -10</button>
          <button onClick={applyMatrix}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default DrawCanvas;
