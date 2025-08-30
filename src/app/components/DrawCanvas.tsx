import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { RadioGroup } from '@mui/material';

interface DrawCanvasProps {
  imagePath: string;
  onApply?: (matrix: number[][]) => void;
  strokeColor?: string;
  initialMatrix?: number[][];
}

type Tool = 'brush' | 'eraser';

const CANVAS_POINT_SIZE = 3;
const MIN_ZOOM = 1;
const MAX_ZOOM = 20;
const ZOOM_FACTOR = 1.02;

const DrawCanvas: React.FC<DrawCanvasProps> = ({
  imagePath,
  onApply,
  strokeColor = 'red',
  initialMatrix,
}) => {
  const persistentMatrixRef = useRef<number[][] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastDrawPos = useRef<{ x: number; y: number } | null>(null);

  const [tool, setTool] = useState<Tool>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const [updateKey, setUpdateKey] = useState(0);
  const forceUpdate = () => setUpdateKey(k => k + 1);

  useEffect(() => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const matrix =
        initialMatrix?.length === height && initialMatrix[0]?.length === width
          ? initialMatrix.map(row => [...row])
          : Array.from({ length: height }, () => Array(width).fill(0));
      persistentMatrixRef.current = matrix;
      setCanvasSize({ width, height });
      setImage(img);
      forceUpdate();
    };
  }, [imagePath, initialMatrix]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && image) {
      const sx = scroll.x;
      const sy = scroll.y;
      const sw = canvasSize.width / zoom;
      const sh = canvasSize.height / zoom;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvasSize.width, canvasSize.height);
    }
  }, [image, scroll, zoom, canvasSize]);

  useEffect(() => {
    const ctx = overlayRef.current?.getContext('2d');
    if (!ctx || !persistentMatrixRef.current) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height);

    ctx.setTransform(zoom, 0, 0, zoom, -scroll.x * zoom, -scroll.y * zoom);
    ctx.fillStyle = strokeColor;

    for (let y = 0; y < persistentMatrixRef.current.length; y++) {
      for (let x = 0; x < persistentMatrixRef.current[y].length; x++) {
        if (persistentMatrixRef.current[y][x] === 1) {
          ctx.fillRect(
            x - CANVAS_POINT_SIZE / 2,
            y - CANVAS_POINT_SIZE / 2,
            CANVAS_POINT_SIZE,
            CANVAS_POINT_SIZE
          );
        }
      }
    }

    ctx.restore();
  }, [canvasSize, strokeColor, zoom, scroll, updateKey]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasWrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      lastMouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const offsetX = lastMouse.current.x;
      const offsetY = lastMouse.current.y;
      const imageX = offsetX / zoom + scroll.x;
      const imageY = offsetY / zoom + scroll.y;

      const zoomAroundPoint = (targetZoom: number) => {
        const newScrollX = imageX - offsetX / targetZoom;
        const newScrollY = imageY - offsetY / targetZoom;
        setScroll({
          x: Math.min(Math.max(newScrollX, 0), canvasSize.width - canvasSize.width / targetZoom),
          y: Math.min(Math.max(newScrollY, 0), canvasSize.height - canvasSize.height / targetZoom),
        });
        setZoom(targetZoom);
      };

      if (e.key === 'b') setTool('brush');
      if (e.key === 'e') setTool('eraser');
      if (e.key === 'c') cleanMatrix();
      if (e.key === '+') zoomAroundPoint(Math.min(zoom * ZOOM_FACTOR, MAX_ZOOM));
      if (e.key === '-') zoomAroundPoint(Math.max(zoom / ZOOM_FACTOR, MIN_ZOOM));
      if (e.key === '0') {
        setZoom(1);
        setScroll({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasSize, scroll, zoom]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!canvasWrapperRef.current) return;
      e.preventDefault();
      const rect = canvasWrapperRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const zoomIn = e.deltaY < 0;
      const mouseImageX = offsetX / zoom + scroll.x;
      const mouseImageY = offsetY / zoom + scroll.y;

      setZoom(prevZoom => {
        const newZoom = zoomIn
          ? Math.min(prevZoom * ZOOM_FACTOR, MAX_ZOOM)
          : Math.max(prevZoom / ZOOM_FACTOR, MIN_ZOOM);
        if (newZoom === prevZoom) return prevZoom;
        const newScrollX = mouseImageX - offsetX / newZoom;
        const newScrollY = mouseImageY - offsetY / newZoom;
        setScroll({
          x: Math.min(Math.max(newScrollX, 0), canvasSize.width - canvasSize.width / newZoom),
          y: Math.min(Math.max(newScrollY, 0), canvasSize.height - canvasSize.height / newZoom),
        });
        return newZoom;
      });
    };

    const target = canvasWrapperRef.current;
    target?.addEventListener('wheel', handleWheel, { passive: false });
    return () => target?.removeEventListener('wheel', handleWheel);
  }, [canvasSize, scroll, zoom]);

  const drawPoint = (x: number, y: number) => {
    if (!persistentMatrixRef.current) return;
    const px = Math.floor(x);
    const py = Math.floor(y);
    for (let dy = 0; dy < CANVAS_POINT_SIZE; dy++) {
      for (let dx = 0; dx < CANVAS_POINT_SIZE; dx++) {
        const fx = px + dx - Math.floor(CANVAS_POINT_SIZE / 2);
        const fy = py + dy - Math.floor(CANVAS_POINT_SIZE / 2);
        if (fx < 0 || fy < 0 || fx >= canvasSize.width || fy >= canvasSize.height) continue;
        if (persistentMatrixRef.current[fy]) {
          persistentMatrixRef.current[fy][fx] = tool === 'brush' ? 1 : 0;
        }
      }
    }
    forceUpdate();
  };

  const cleanMatrix = () => {
    if (!persistentMatrixRef.current) return;
    persistentMatrixRef.current = persistentMatrixRef.current.map(row => row.fill(0));
    forceUpdate();
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    lastDrawPos.current = null;
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastDrawPos.current = null;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!canvasWrapperRef.current || !isDrawing) return;
    const rect = canvasWrapperRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const imageX = offsetX / zoom + scroll.x;
    const imageY = offsetY / zoom + scroll.y;

    const prev = lastDrawPos.current;
    const curr = { x: imageX, y: imageY };

    if (prev) {
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.ceil(dist);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = prev.x + t * dx;
        const y = prev.y + t * dy;
        drawPoint(x, y);
      }
    } else {
      drawPoint(curr.x, curr.y);
    }

    lastDrawPos.current = curr;
  };

  const applyMatrix = () => {
    if (!persistentMatrixRef.current) return;
    const matrix = persistentMatrixRef.current.map(row => [...row]);
    if (onApply) onApply(matrix);
  };

  const getCursor = () => (tool === 'brush' ? 'crosshair' : 'not-allowed');

  return (
    <div style={{ display: 'flex', flexGrow: '1', gap: 12, minHeight: 0 }}>
      <div
        id="two_canvases"
        ref={containerRef}
        style={{
          border: '1px solid #ccc',
          display: 'flex',
          flexGrow: '1',
          alignSelf: 'stretch',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0,
          maxWidth: '100%',
          maxHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <div
          ref={canvasWrapperRef}
          style={{
            position: 'relative',
            width: canvasSize.width,
            height: canvasSize.height,
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              border: '1px solid #ccc',
            }}
          />
          <canvas
            ref={overlayRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerUp}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              cursor: getCursor(),
              border: '1px solid #ccc',
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          border: '1px solid #ccc',
          position: 'sticky',
          top: 0,
          maxHeight: '100vh',
          overflowY: 'auto',
          flexShrink: 0,
          alignSelf: 'flex-start',
        }}
      >
        <RadioGroup>
          <Button variant={tool === 'brush' ? 'faded' : undefined} onPress={() => setTool('brush')}>
            Pencil (b)
          </Button>
          <Button
            variant={tool === 'eraser' ? 'faded' : undefined}
            onPress={() => setTool('eraser')}
          >
            Eraser (e)
          </Button>
        </RadioGroup>
        <Button onPress={() => cleanMatrix()}>Clear (c)</Button>
        <Button onPress={() => setZoom(z => Math.min(z * ZOOM_FACTOR, MAX_ZOOM))}>Zoom (+)</Button>
        <Button
          onPress={() => {
            setZoom(1);
            setScroll({ x: 0, y: 0 });
          }}
        >
          No zoom (0)
        </Button>
        <Button onPress={() => setZoom(z => Math.max(z / ZOOM_FACTOR, MIN_ZOOM))}>Zoom (-)</Button>
        <Button onPress={applyMatrix}>Apply</Button>
        <div style={{ marginTop: 8, fontSize: 12 }}>Zoom: x{zoom.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default DrawCanvas;
