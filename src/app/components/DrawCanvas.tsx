import React, { useRef, useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@heroui/button';
import { RadioGroup } from '@mui/material';
import { Kbd, Slider } from '@heroui/react';

interface DrawCanvasProps {
  imagePath: string;
  onApply?: (matrix: number[][]) => void;
  onCancel?: () => void;
  strokeColor?: string;
  initialMatrix?: number[][];
}

type Tool = 'brush' | 'eraser';

const CANVAS_POINT_SIZE = 1.1; // slightly larger than 1 to avoid aliasing, ends up in manual drawing of width 2
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 20;
const ZOOM_FACTOR = 1.02;
const WHEEL_ZOOM_SPEED = 0.002;
const STEP_ZOOM_FACTOR = 1.2;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const DrawCanvas: React.FC<DrawCanvasProps> = ({
  imagePath,
  onApply,
  onCancel,
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
  const lastCenteredImagePathRef = useRef<string | null>(null);

  const [tool, setTool] = useState<Tool>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const [updateKey, setUpdateKey] = useState(0);
  const forceUpdate = () => setUpdateKey(k => k + 1);

  // Track whether the user modified the overlay since the image was loaded
  const [dirtySinceLoad, setDirtySinceLoad] = useState(false);

  // Device Pixel Ratio for HiDPI-aware canvases
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Compute scroll bounds for a given zoom so that when zoom < 1 the image can be centered
  const getScrollBounds = (z: number) => {
    const viewW = canvasSize.width / z;
    const viewH = canvasSize.height / z;

    const availW = canvasSize.width - viewW; // >=0 when zoomed-in, <0 when zoomed-out
    const availH = canvasSize.height - viewH;

    let minX: number, maxX: number, minY: number, maxY: number;
    if (availW >= 0) {
      minX = 0;
      maxX = availW;
    } else {
      const extraW = -availW; // how much larger the view is than the image
      minX = -extraW / 2;
      maxX = extraW / 2;
    }

    if (availH >= 0) {
      minY = 0;
      maxY = availH;
    } else {
      const extraH = -availH;
      minY = -extraH / 2;
      maxY = extraH / 2;
    }

    return { minX, maxX, minY, maxY };
  };

  const clampScrollToBounds = (x: number, y: number, z: number) => {
    const { minX, maxX, minY, maxY } = getScrollBounds(z);
    return {
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY),
    };
  };

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
        // Set initial zoom so the image fills roughly 3/4 of the container
        let initialZoom = 1;
        const container = containerRef.current;
        if (container) {
          const cw = container.clientWidth;
          const ch = container.clientHeight;
          if (cw > 0 && ch > 0) {
            const fitScale = 0.75 * Math.min(cw / width, ch / height);
            initialZoom = clamp(fitScale, MIN_ZOOM, MAX_ZOOM);
          }
        }
        setZoom(initialZoom);
        setScroll({ x: 0, y: 0 });
      }
      // New image or matrix loaded -> reset dirty flag
      setDirtySinceLoad(false);
      prevImagePathRef.current = imagePath;
      forceUpdate();
    };
  }, [imagePath, initialMatrix]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && image && canvasRef.current) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Clear the full backing store (device pixels)
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.imageSmoothingEnabled = false; // Disable image smoothing for pixel-perfect rendering
      // Scale drawing for device pixel ratio; visual zoom is applied via CSS size
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(image, 0, 0);
      // Draw an inner frame around the canvas in logical pixels
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ccc';
      const inset = ctx.lineWidth / 2; // keep stroke fully inside the canvas
      ctx.strokeRect(inset, inset, canvasSize.width - 2 * inset, canvasSize.height - 2 * inset);
      ctx.restore();
    }
  }, [image, scroll, zoom, canvasSize, dpr]);

  useEffect(() => {
    const ctx = overlayRef.current?.getContext('2d');
    if (!ctx || !persistentMatrixRef.current) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, overlayRef.current!.width, overlayRef.current!.height);

    // Draw in logical pixel space and scale to device pixels via DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = strokeColor;

    for (let y = 0; y < persistentMatrixRef.current.length; y++) {
      for (let x = 0; x < persistentMatrixRef.current[y].length; x++) {
        if (persistentMatrixRef.current[y][x] === 1) {
          ctx.fillRect(x, y, CANVAS_POINT_SIZE, CANVAS_POINT_SIZE);
        }
      }
    }

    ctx.restore();
  }, [canvasSize, strokeColor, zoom, scroll, updateKey, dpr]);

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
      const imageX = offsetX / zoom;
      const imageY = offsetY / zoom;

      const zoomAroundPoint = (targetZoom: number) => {
        const newZoom = clamp(targetZoom, MIN_ZOOM, MAX_ZOOM);
        const newScrollX = imageX - offsetX / newZoom;
        const newScrollY = imageY - offsetY / newZoom;
        const clamped = clampScrollToBounds(newScrollX, newScrollY, newZoom);
        setScroll(clamped);
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
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        applyMatrix();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceHeldRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
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

        const imageX = offsetX / zoom;
        const imageY = offsetY / zoom;

        const newScrollX = imageX - offsetX / targetZoom;
        const newScrollY = imageY - offsetY / targetZoom;
        const clamped = clampScrollToBounds(newScrollX, newScrollY, targetZoom);
        setScroll(clamped);
        setZoom(targetZoom);
      } else {
        // Allow default scrolling of the container/page
      }
    };

    const target = canvasWrapperRef.current;
    target?.addEventListener('wheel', handleWheel, { passive: false });
    return () => target?.removeEventListener('wheel', handleWheel);
  }, [canvasSize, scroll, zoom]);

  // Center the outer scrollbars when the image is larger than the viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !image) return;

    // Only center once per imagePath to avoid overriding user's manual scroll
    if (lastCenteredImagePathRef.current === imagePath) return;

    const center = () => {
      if (!container) return;
      const needsH = container.scrollWidth > container.clientWidth;
      const needsV = container.scrollHeight > container.clientHeight;
      if (needsH || needsV) {
        const left = Math.max(0, Math.floor((container.scrollWidth - container.clientWidth) / 2));
        const top = Math.max(0, Math.floor((container.scrollHeight - container.clientHeight) / 2));
        container.scrollTo({ left, top });
      }
      lastCenteredImagePathRef.current = imagePath;
    };

    // Wait for layout, then schedule after paint with a bit more delay to avoid race conditions
    requestAnimationFrame(() => {
      setTimeout(center, 50);
    });
  }, [imagePath, image, canvasSize]);

  const drawPoint = (x: number, y: number) => {
    if (!persistentMatrixRef.current) return;
    const px = Math.floor(x);
    const py = Math.floor(y);
    const point_size = tool === 'brush' ? CANVAS_POINT_SIZE : CANVAS_POINT_SIZE * 5;
    for (let dy = 0; dy < point_size; dy++) {
      for (let dx = 0; dx < point_size; dx++) {
        const fx = px + dx - Math.floor(point_size / 2);
        const fy = py + dy - Math.floor(point_size / 2);
        if (fx < 0 || fy < 0 || fx >= canvasSize.width || fy >= canvasSize.height) continue;
        if (persistentMatrixRef.current[fy]) {
          persistentMatrixRef.current[fy][fx] = tool === 'brush' ? 1 : 0;
        }
      }
    }
    // Mark as modified on any drawing action
    setDirtySinceLoad(true);
    forceUpdate();
  };

  const cleanMatrix = () => {
    if (!persistentMatrixRef.current) return;
    persistentMatrixRef.current = persistentMatrixRef.current.map(row => row.fill(0));
    setDirtySinceLoad(true);
    forceUpdate();
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    // Ensure canvas wrapper has keyboard focus so Esc key works while interacting
    canvasWrapperRef.current?.focus();
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

      // When zoomed, the canvas is larger than the viewport and lives inside a scrollable container.
      // To pan reliably at any zoom level, scroll the outer container by the drag delta.
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: -dx, top: -dy, behavior: 'auto' });
      }
      return;
    }

    if (!isDrawing) return;

    const rect = canvasWrapperRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const imageX = offsetX / zoom;
    const imageY = offsetY / zoom;

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
    // After saving, consider the state clean relative to this load
    setDirtySinceLoad(false);
  };

  // Helpers for UI-centered zooming
  const zoomAtPoint = (target: number, offsetX: number, offsetY: number) => {
    const newZoom = clamp(target, MIN_ZOOM, MAX_ZOOM);
    const imageX = offsetX / zoom;
    const imageY = offsetY / zoom;
    const newScrollX = imageX - offsetX / newZoom;
    const newScrollY = imageY - offsetY / newZoom;
    const clamped = clampScrollToBounds(newScrollX, newScrollY, newZoom);
    setScroll(clamped);
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

  // Build a lightweight SVG-based eraser cursor and memoize it
  const eraserCursor = React.useMemo(() => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'>
  <g transform='rotate(-25 12 12)'>
    <rect x='5' y='9' width='10' height='8' rx='2' fill='#f3a6bb' stroke='#333' stroke-width='1'/>
    <rect x='10' y='9' width='5' height='8' rx='2' fill='#f8dde6'/>
    <path d='M5 16 L15 16' stroke='#333' stroke-width='0.5' opacity='0.4'/>
  </g>
</svg>`;
    // Hotspot roughly at the bottom-left tip (scaled for 32x32 from 24x24: 6->8, 18->24)
    const hotspotX = 8; // tune for perceived tip
    const hotspotY = 24;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") ${hotspotX} ${hotspotY}, crosshair`;
  }, []);

  const getCursor = () => (tool === 'brush' ? 'crosshair' : eraserCursor);

  return (
    <div style={{ display: 'flex', flexGrow: '1', gap: 12, minHeight: 0 }}>
      <div
        id="flex_canvases"
        ref={containerRef}
        style={{
          border: '1px solid #ccc',
          display: 'flex',
          flexGrow: '1',
          alignSelf: 'stretch',
          position: 'relative',
          alignItems: 'flex-start', // TODO: Hack to prevent the canvas from being cut off at the top.
          justifyContent: 'center',
          maxWidth: '100%',
          maxHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <div
          id="canvases"
          ref={canvasWrapperRef}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              e.preventDefault();
              applyMatrix();
            }
          }}
          style={{
            position: 'relative',
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <canvas
            ref={canvasRef}
            width={Math.floor(canvasSize.width * dpr)}
            height={Math.floor(canvasSize.height * dpr)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              border: '1px solid #ccc',
              // Visual size follows zoom via CSS, backing store stays at image size × DPR
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
            }}
          />
          <canvas
            ref={overlayRef}
            width={Math.floor(canvasSize.width * dpr)}
            height={Math.floor(canvasSize.height * dpr)}
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerUp}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              cursor: getCursor(),
              border: '1px solid #ccc',
              // Visual size follows zoom via CSS, backing store stays at image size × DPR
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
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
          alignItems: 'center',
          gap: 8,
          position: 'relative',
          // top: 0,
          maxHeight: '100vh',
          overflowY: 'auto',
          flexShrink: 0,
          alignSelf: 'center',
        }}
      >
        <RadioGroup>
          <Button
            variant={tool === 'brush' ? 'faded' : undefined}
            onPress={() => setTool('brush')}
            aria-keyshortcuts="p"
            title="Pencil (P)"
            aria-label="Select Pencil tool (shortcut: P)"
            endContent={<Kbd>P</Kbd>}
          >
            Pencil
          </Button>
          <Button
            variant={tool === 'eraser' ? 'faded' : undefined}
            onPress={() => setTool('eraser')}
            aria-keyshortcuts="e"
            title="Eraser (E)"
            aria-label="Select Eraser tool (shortcut: E)"
            endContent={<Kbd>E</Kbd>}
          >
            Eraser
          </Button>
        </RadioGroup>
        <Button
          onPress={() => cleanMatrix()}
          aria-keyshortcuts="c"
          title="Clear drawing (C)"
          aria-label="Clear the drawing (shortcut: C)"
          endContent={<Kbd>C</Kbd>}
        >
          Clear
        </Button>
        <ButtonGroup size="sm" className="gap-0 flex-col items-stretch">
          <Button
            size="sm"
            onPress={() => zoomStep(-1)}
            aria-keyshortcuts="-"
            title="Zoom out (-)"
            aria-label="Zoom out (shortcut: -)"
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
            title="Reset zoom (0)"
            aria-label="Reset zoom to 100% (shortcut: 0)"
            endContent={<Kbd>0</Kbd>}
          >
            No Zoom
          </Button>
          <Button
            size="sm"
            onPress={() => zoomStep(1)}
            aria-keyshortcuts="+"
            title="Zoom in (+)"
            aria-label="Zoom in (shortcut: +)"
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
          step={0.1}
          value={zoom}
          getValue={v => {
            const num = Array.isArray(v) ? v[0] : v;
            return `x${Number(num).toFixed(2)}`;
          }}
          onChange={val => {
            const v = Array.isArray(val) ? val[0] : val;
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;
            const target = Number(v);
            zoomAtPoint(target, rect.width / 2, rect.height / 2);
          }}
          tabIndex={-1}
          onMouseLeave={() => setTimeout(() => containerRef.current?.focus(), 0)}
        />
        {onCancel && (
          <Button
            onPress={onCancel}
            title="Discard"
            aria-label="Discard changes"
            isDisabled={!dirtySinceLoad}
          >
            Discard
          </Button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            onPress={applyMatrix}
            title="Save (Esc, Enter)"
            aria-label="Save the current drawing"
            aria-keyshortcuts="Escape Enter"
            isDisabled={!dirtySinceLoad}
            endContent={
              dirtySinceLoad ? (
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: '#f31260',
                    display: 'inline-block',
                    marginLeft: 1,
                  }}
                />
              ) : null
            }
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawCanvas;
