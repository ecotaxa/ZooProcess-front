import React, { useRef, useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@heroui/button';
import { RadioGroup } from '@mui/material';
import { Kbd, Slider } from '@heroui/react';

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
const WHEEL_ZOOM_SPEED = 0.002;
const STEP_ZOOM_FACTOR = 1.2;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

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
  const spaceHeldRef = useRef(false);
  const isPanningRef = useRef(false);
  const lastPanPos = useRef<{ x: number; y: number } | null>(null);
  const prevImagePathRef = useRef<string | null>(null);

  const [tool, setTool] = useState<Tool>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const [updateKey, setUpdateKey] = useState(0);
  const forceUpdate = () => setUpdateKey(k => k + 1);

  useEffect(() => {
    const img = new Image();
    const shouldReset = prevImagePathRef.current !== imagePath;
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
      if (shouldReset) {
        setZoom(1);
        setScroll({ x: 0, y: 0 });
      }
      prevImagePathRef.current = imagePath;
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
      if (e.code === 'Space') {
        spaceHeldRef.current = true;
        e.preventDefault();
      }
      const offsetX = lastMouse.current.x;
      const offsetY = lastMouse.current.y;
      const imageX = offsetX / zoom + scroll.x;
      const imageY = offsetY / zoom + scroll.y;

      const zoomAroundPoint = (targetZoom: number) => {
        const newZoom = clamp(targetZoom, MIN_ZOOM, MAX_ZOOM);
        const newScrollX = imageX - offsetX / newZoom;
        const newScrollY = imageY - offsetY / newZoom;
        setScroll({
          x: clamp(newScrollX, 0, canvasSize.width - canvasSize.width / newZoom),
          y: clamp(newScrollY, 0, canvasSize.height - canvasSize.height / newZoom),
        });
        setZoom(newZoom);
      };

      if (e.key === 'b') setTool('brush');
      if (e.key === 'e') setTool('eraser');
      if (e.key === 'c') cleanMatrix();
      if (e.key === '+') zoomAroundPoint(zoom * STEP_ZOOM_FACTOR);
      if (e.key === '-') zoomAroundPoint(zoom / STEP_ZOOM_FACTOR);
      if (e.key === '0') {
        setZoom(1);
        setScroll({ x: 0, y: 0 });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceHeldRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvasSize, scroll, zoom]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!canvasWrapperRef.current) return;

      const zooming = e.ctrlKey; // Only zoom when user intends to (e.g., pinch on trackpad)

      if (zooming) {
        e.preventDefault();
        const rect = canvasWrapperRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const factor = Math.exp(-e.deltaY * WHEEL_ZOOM_SPEED);
        const targetZoom = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);

        const imageX = offsetX / zoom + scroll.x;
        const imageY = offsetY / zoom + scroll.y;

        const newScrollX = imageX - offsetX / targetZoom;
        const newScrollY = imageY - offsetY / targetZoom;
        setScroll({
          x: clamp(newScrollX, 0, canvasSize.width - canvasSize.width / targetZoom),
          y: clamp(newScrollY, 0, canvasSize.height - canvasSize.height / targetZoom),
        });
        setZoom(targetZoom);
      } else {
        // Allow default scrolling of the container/page
      }
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
    // Start panning with middle mouse or Space+Left
    const isMiddle = e.button === 1;
    const isSpaceLeft = e.button === 0 && spaceHeldRef.current;
    if (isMiddle || isSpaceLeft) {
      isPanningRef.current = true;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      return;
    }

    // Otherwise start drawing
    setIsDrawing(true);
    lastDrawPos.current = null;
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastDrawPos.current = null;
    isPanningRef.current = false;
    lastPanPos.current = null;
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!canvasWrapperRef.current) return;

    // Panning mode (Space+Left or Middle mouse)
    if (isPanningRef.current && lastPanPos.current) {
      const dx = e.clientX - lastPanPos.current.x;
      const dy = e.clientY - lastPanPos.current.y;
      lastPanPos.current = { x: e.clientX, y: e.clientY };

      const maxX = canvasSize.width - canvasSize.width / zoom;
      const maxY = canvasSize.height - canvasSize.height / zoom;

      let newScrollX = scroll.x;
      let newScrollY = scroll.y;
      let updateInternal = false;

      if (maxX > 0) {
        newScrollX = clamp(scroll.x - dx / zoom, 0, maxX);
        updateInternal = true;
      } else if (containerRef.current) {
        // No internal horizontal pan range; pan the outer container
        containerRef.current.scrollBy({ left: -dx, top: 0, behavior: 'auto' });
      }

      if (maxY > 0) {
        newScrollY = clamp(scroll.y - dy / zoom, 0, maxY);
        updateInternal = true;
      } else if (containerRef.current) {
        // No internal vertical pan range; pan the outer container
        containerRef.current.scrollBy({ left: 0, top: -dy, behavior: 'auto' });
      }

      if (updateInternal) {
        setScroll({ x: newScrollX, y: newScrollY });
      }
      return;
    }

    if (!isDrawing) return;

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

  // Helpers for UI-centered zooming
  const zoomAtPoint = (target: number, offsetX: number, offsetY: number) => {
    const newZoom = clamp(target, MIN_ZOOM, MAX_ZOOM);
    const imageX = offsetX / zoom + scroll.x;
    const imageY = offsetY / zoom + scroll.y;
    const newScrollX = imageX - offsetX / newZoom;
    const newScrollY = imageY - offsetY / newZoom;
    setScroll({
      x: clamp(newScrollX, 0, canvasSize.width - canvasSize.width / newZoom),
      y: clamp(newScrollY, 0, canvasSize.height - canvasSize.height / newZoom),
    });
    setZoom(newZoom);
  };

  const zoomStep = (dir: 1 | -1) => {
    const rect = canvasWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const target = dir === 1 ? zoom * STEP_ZOOM_FACTOR : zoom / STEP_ZOOM_FACTOR;
    zoomAtPoint(target, cx, cy);
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
          alignItems: 'flex-start', // TODO: Hack to prevent the canvas from being cut off at the top.
          justifyContent: 'center',
          minWidth: 0,
          maxWidth: '100%',
          maxHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <div
          ref={canvasWrapperRef}
          tabIndex={0}
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
          <Button
            variant={tool === 'brush' ? 'faded' : undefined}
            onPress={() => setTool('brush')}
            aria-keyshortcuts="b"
            endContent={<Kbd>B</Kbd>}
          >
            Pencil
          </Button>
          <Button
            variant={tool === 'eraser' ? 'faded' : undefined}
            onPress={() => setTool('eraser')}
            aria-keyshortcuts="e"
            endContent={<Kbd>E</Kbd>}
          >
            Eraser
          </Button>
        </RadioGroup>
        <Button onPress={() => cleanMatrix()} aria-keyshortcuts="c" endContent={<Kbd>C</Kbd>}>
          Clear
        </Button>
        <ButtonGroup size="sm" className="gap-0 flex-col items-stretch">
          <Button
            size="sm"
            onPress={() => zoomStep(-1)}
            aria-keyshortcuts="-"
            endContent={<Kbd>-</Kbd>}
          >
            Zoom out
          </Button>
          <Button
            size="sm"
            onPress={() => {
              setZoom(1);
              setScroll({ x: 0, y: 0 });
            }}
            aria-keyshortcuts="0"
            endContent={<Kbd>0</Kbd>}
          >
            Reset
          </Button>
          <Button
            size="sm"
            onPress={() => zoomStep(1)}
            aria-keyshortcuts="+"
            endContent={<Kbd>+</Kbd>}
          >
            Zoom in
          </Button>
        </ButtonGroup>
        <Slider
          size="sm"
          label={`Zoom`}
          aria-label="Zoom"
          classNames={{ label: 'text-xs', value: 'text-xs' }}
          minValue={MIN_ZOOM}
          maxValue={MAX_ZOOM}
          step={1}
          value={zoom}
          getValue={zoom => `x${zoom}`}
          onChange={val => {
            const v = Array.isArray(val) ? val[0] : val;
            const rect = canvasWrapperRef.current?.getBoundingClientRect();
            if (!rect) return;
            const target = Number(v);
            zoomAtPoint(target, rect.width / 2, rect.height / 2);
          }}
          tabIndex={-1}
          onMouseLeave={() => setTimeout(() => canvasWrapperRef.current?.focus(), 0)}
        />
        <Button onPress={applyMatrix}>Save</Button>
      </div>
    </div>
  );
};

export default DrawCanvas;
