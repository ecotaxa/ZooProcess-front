import React, { useRef, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Button, ButtonGroup } from '@heroui/button';
import { Kbd, Slider } from '@heroui/react';
import { contourNonWhite } from 'app/utils/objectContour.ts';
import { RGB_CONTOUR_COLORS } from 'app/utils/contourColors';

export interface DrawCanvasProps {
  imagePath: string;
  initialMatrix: number[][];
  strokeColor: string;
  onApply?: (matrix: number[][]) => any;
  onCancel?: () => void;
  onPreview?: (matrix: number[][]) => Promise<any>;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

type Tool = 'brush' | 'eraser';

const CANVAS_POINT_SIZE = 1.1; // slightly larger than 1 to avoid aliasing, ends up in manual drawing of width 2
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;
const WHEEL_ZOOM_SPEED = 0.002;
const STEP_ZOOM_FACTOR = 1.2;
const INACTIVITY_TIMEOUT = 2000; // show objects contours after this inactivity

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const DrawCanvas: React.FC<DrawCanvasProps> = ({
  imagePath,
  initialMatrix,
  strokeColor,
  onApply,
  onCancel,
  onPreview,
  onNavigatePrev,
  onNavigateNext,
}: Readonly<DrawCanvasProps>) => {
  // Paint data
  const persistentMatrixRef = useRef<number[][] | null>(null);
  // Image
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Painting overlay
  const overlayRef = useRef<HTMLCanvasElement>(null);
  // Div containing the 2 canvases
  const containerRef = useRef<HTMLDivElement>(null);
  // Div containing above div
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const lastMouse = useRef({ x: 0, y: 0 });
  const lastDrawPos = useRef<{ x: number; y: number } | null>(null);
  const spaceHeldRef = useRef(false);

  const isPanningRef = useRef(false);
  const lastPanPos = useRef<{ x: number; y: number } | null>(null);

  const reqIdRef = useRef(0);

  const [tool, setTool] = useState<Tool>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  // ROIs and features returned by onPreview callback;
  type RoiWithFeatures = {
    object_bx: number;
    object_by: number;
    object_width: number;
    object_height: number;
    object_xstart: number;
    object_ystart: number;
  };
  const [rois, setRois] = useState<RoiWithFeatures[]>([]);

  const [updateKey, setUpdateKey] = useState(0);
  const forceUpdate = () => setUpdateKey(k => k + 1);

  // Track whether the user modified the overlay since the image was loaded
  const [dirtySinceLoad, setDirtySinceLoad] = useState(false);
  // Mirror dirtySinceLoad into a ref to avoid stale closures inside global event listeners
  const dirtySinceLoadRef = useRef(false);
  useEffect(() => {
    dirtySinceLoadRef.current = dirtySinceLoad;
  }, [dirtySinceLoad]);
  const [ready, setReady] = useState(false);

  // Feedback after inactivity following drawing/erasing
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetInactivityTimer = React.useCallback(() => {
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(async () => {
      try {
        if (!persistentMatrixRef.current) return;
        const matrix = persistentMatrixRef.current.map(row => [...row]);
        const ret = await onPreview?.(matrix);
        setRois(ret.rois);
      } catch (e) {
        // avoid breaking the timer if preview callback throws
        console.error('onPreview callback failed:', e);
      }
    }, INACTIVITY_TIMEOUT);
  }, [onPreview]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current !== null) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Device Pixel Ratio for HiDPI-aware canvases
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = async () => {
        try {
          // Ensure pixels are decoded before first paint to avoid flashes
          if (img.decode) await img.decode();
        } catch {}
        resolve(img);
      };
      img.onerror = err => reject(err);
    });
  }

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
    const reqId = ++reqIdRef.current;
    setReady(false);
    let canceled = false;

    const run = async () => {
      try {
        // Always load image first
        const img = await loadImage(imagePath);

        const width = img.width;
        const height = img.height;

        // Copy the provided initialMatrix (assumed to be correctly sized)
        const matrix: number[][] = initialMatrix.map(r => [...r]);

        if (canceled || reqIdRef.current !== reqId) return;

        persistentMatrixRef.current = matrix;
        setCanvasSize({ width, height });
        setImage(img);

        // New image or matrix loaded -> reset dirty flag and clear ROIs
        setDirtySinceLoad(false);
        setRois([]);
        setReady(true);
        forceUpdate();

        // Immediately fetch ROIs so they are drawn as soon as the image is loaded
        void (async () => {
          try {
            if (!onPreview) return;
            // Work on a copy to avoid future mutations during drawing
            const matrixForPreview = matrix.map(r => [...r]);
            const ret = await onPreview(matrixForPreview);
            if (!canceled && reqIdRef.current === reqId && ret && Array.isArray(ret.rois)) {
              setRois(ret.rois);
            }
          } catch (e) {
            console.error('initial onPreview failed:', e);
          }
        })();
      } catch (e) {
        console.error('Failed loading assets', e);
      }
    };

    void run();
    return () => {
      canceled = true;
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

    // Ensure no smoothing is applied when canvas is scaled
    ctx.imageSmoothingEnabled = false;
    // Draw in logical pixel space and scale to device pixels via DPR
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = strokeColor;

    let thereAreSeparators = false;
    for (let y = 0; y < persistentMatrixRef.current.length; y++) {
      for (let x = 0; x < persistentMatrixRef.current[y].length; x++) {
        if (persistentMatrixRef.current[y][x] === 1) {
          ctx.fillRect(x, y, CANVAS_POINT_SIZE, CANVAS_POINT_SIZE);
          thereAreSeparators = true;
        }
      }
    }

    // Draw ROI contour points only if several of them are present
    if (rois.length > 1 || thereAreSeparators) {
      rois.forEach((r, idx) => {
        const colorHex = RGB_CONTOUR_COLORS[idx % RGB_CONTOUR_COLORS.length] ?? '#00FF00';

        const imageCtx = canvasRef.current?.getContext('2d');
        const overlayCtx = overlayRef.current?.getContext('2d');
        if (overlayCtx && imageCtx) {
          const sx = Math.floor(r.object_xstart * dpr);
          const sy = Math.floor(r.object_ystart * dpr);
          try {
            // Paint only the boundary pixels of the non-white region for this ROI, using its designated color
            contourNonWhite(imageCtx, overlayCtx, persistentMatrixRef.current!, sx, sy, colorHex);
          } catch (err) {
            console.error('floodFillWithTolerance failed:', err);
          }
        }
      });
    }

    ctx.restore();
  }, [canvasSize, strokeColor, zoom, scroll, updateKey, dpr, rois]);

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
      const zoomAroundPoint = (targetZoom: number) => {
        const c = containerRef.current;
        const w = canvasWrapperRef.current;
        if (!c || !w) {
          setZoom(clamp(targetZoom, MIN_ZOOM, MAX_ZOOM));
          return;
        }
        const containerRect = c.getBoundingClientRect();
        const wrapperRect = w.getBoundingClientRect();
        const viewportOffsetX = lastMouse.current.x + wrapperRect.left - containerRect.left;
        const viewportOffsetY = lastMouse.current.y + wrapperRect.top - containerRect.top;
        zoomAtPoint(targetZoom, viewportOffsetX, viewportOffsetY);
      };

      const requestNav = (dir: 'prev' | 'next') => {
        e.preventDefault();
        handleNavigate(dir);
      };

      if (e.key === 'b') setTool('brush');
      if (e.key === 'e') setTool('eraser');
      if (e.key === 'c') clearMatrix();
      if (e.key === '+') zoomAroundPoint(zoom * STEP_ZOOM_FACTOR);
      if (e.key === '-') zoomAroundPoint(zoom / STEP_ZOOM_FACTOR);
      if (e.key === '0') {
        setZoom(1);
        setScroll({ x: 0, y: 0 });
      }
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        void applyMatrix(true);
        return;
      }
      if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        requestNav('prev');
        return;
      }
      if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
        requestNav('next');
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
      if (!containerRef.current) return;

      const scrolling = e.ctrlKey; // Only zoom when user intends to (e.g., pinch on trackpad)

      if (scrolling) {
        // Allow default scrolling of the container/page
      } else {
        e.preventDefault();
        const c = containerRef.current;
        if (!c) return;
        const rect = c.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const factor = Math.exp(-e.deltaY * WHEEL_ZOOM_SPEED);
        const targetZoom = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM);

        zoomAtPoint(targetZoom, offsetX, offsetY);
      }
    };

    const target = canvasWrapperRef.current;
    target?.addEventListener('wheel', handleWheel, { passive: false });
    return () => target?.removeEventListener('wheel', handleWheel);
  }, [canvasSize, scroll, zoom]);

  // After the editor is mounted and assets are ready, compute an initial auto-zoom that fits the image.
  useEffect(() => {
    if (!ready || !image) return;

    let canceled = false;

    const doAutoZoom = () => {
      if (canceled) return;
      const container = containerRef.current;
      if (!container) {
        // Try again on the next frame if the container isn't mounted yet
        requestAnimationFrame(doAutoZoom);
        return;
      }
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw <= 0 || ch <= 0) {
        // Defer until layout stabilizes
        setTimeout(doAutoZoom, 50);
        return;
      }

      const width = canvasSize.width;
      const height = canvasSize.height;
      if (width <= 0 || height <= 0) return;

      const fitScale = 0.95 * Math.min(cw / width, ch / height);
      const z = clamp(fitScale, MIN_ZOOM, MAX_ZOOM);

      // Commit initial zoom and reset scroll synchronously so layout reflects the new size immediately
      flushSync(() => {
        setZoom(z);
        setScroll({ x: 0, y: 0 });
      });

      // Center the outer scrollbars after zooming to keep the image centered in view
      requestAnimationFrame(() => {
        setTimeout(() => {
          const c = containerRef.current;
          if (!c) return;
          const needsH = c.scrollWidth > c.clientWidth;
          const needsV = c.scrollHeight > c.clientHeight;
          if (needsH || needsV) {
            const left = Math.max(0, Math.floor((c.scrollWidth - c.clientWidth) / 2));
            const top = Math.max(0, Math.floor((c.scrollHeight - c.clientHeight) / 2));
            c.scrollTo({ left, top });
          }
        }, 50);
      });
    };

    // Kick off auto-zoom computation
    doAutoZoom();

    return () => {
      canceled = true;
    };
  }, [ready, imagePath, image, canvasSize]);

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
    resetInactivityTimer();
  };

  const clearMatrix = () => {
    if (!persistentMatrixRef.current) return;
    persistentMatrixRef.current = persistentMatrixRef.current.map(row => row.fill(0));
    setDirtySinceLoad(true);
    forceUpdate();
    resetInactivityTimer();
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    // Ensure the canvas wrapper has keyboard focus so Esc key works while interacting.
    // But do not let it scroll the container
    canvasWrapperRef.current?.focus({ preventScroll: true });
    // Start panning with middle mouse
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

  const applyMatrix = async (closeAfter = false) => {
    if (!persistentMatrixRef.current) return;
    const matrix = persistentMatrixRef.current.map(row => [...row]);
    try {
      const result = onApply ? onApply(matrix) : undefined;
      // After initiating save, consider the state clean relative to this load
      setDirtySinceLoad(false);
      if (closeAfter) {
        // If onApply returned a Promise, wait for it before closing
        if (result && typeof (result as any).then === 'function') {
          await (result as Promise<any>);
        }
        onCancel?.();
      }
      return result;
    } catch (e) {
      // Do not close on error
      throw e;
    }
  };

  // Navigate to previous/next item, auto-saving if there are unsaved changes
  const handleNavigate = (dir: 'prev' | 'next') => {
    const cb = dir === 'prev' ? onNavigatePrev : onNavigateNext;
    if (!cb) return;
    const doNav = async () => {
      try {
        if (dirtySinceLoadRef.current) {
          await applyMatrix();
        }
      } finally {
        cb();
      }
    };
    void doNav();
  };

  // Helpers for UI-centered zooming (anchor is relative to the scroll container viewport)
  const zoomAtPoint = (target: number, viewportOffsetX: number, viewportOffsetY: number) => {
    const c = containerRef.current;
    const newZoom = clamp(target, MIN_ZOOM, MAX_ZOOM);
    const oldZoom = zoom;

    if (!c) {
      // If container isn't ready, just commit the zoom synchronously
      flushSync(() => setZoom(newZoom));
      return;
    }

    // Compute the desired scroll based on preserving the anchor point position during scale
    const scale = newZoom / oldZoom;
    const leftBefore = c.scrollLeft;
    const topBefore = c.scrollTop;
    const desiredLeft = leftBefore * scale + viewportOffsetX * (scale - 1);
    const desiredTop = topBefore * scale + viewportOffsetY * (scale - 1);

    // Commit zoom synchronously so scroll metrics reflect the new size immediately
    flushSync(() => setZoom(newZoom));

    // Clamp using the new (post-zoom) scroll metrics
    const maxLeft = Math.max(0, c.scrollWidth - c.clientWidth);
    const maxTop = Math.max(0, c.scrollHeight - c.clientHeight);
    const left = clamp(desiredLeft, 0, maxLeft);
    const top = clamp(desiredTop, 0, maxTop);

    // Set scroll instantly (avoid scrollTo to dodge any smooth-scroll or UA quirks)
    c.scrollLeft = left;
    c.scrollTop = top;
  };

  const zoomStep = (dir: 1 | -1) => {
    const c = containerRef.current;
    if (!c) return;
    const cx = c.clientWidth / 2;
    const cy = c.clientHeight / 2;
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

  if (!ready) return <div>...</div>;

  return (
    <div
      style={{
        display: 'flex',
        flexGrow: '1',
        gap: 12,
        minHeight: 0,
      }}
    >
      <div
        id="flex_canvases"
        ref={containerRef}
        style={{
          border: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'auto',
          width: '100%',
          overflowAnchor: 'none',
        }}
      >
        <div
          id="canvases"
          ref={canvasWrapperRef}
          tabIndex={0}
          style={{
            width: canvasSize.width * zoom,
            height: canvasSize.height * zoom,
            position: 'relative',
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
              imageRendering: 'pixelated',
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
              imageRendering: 'pixelated',
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
        <Button
          onPress={() => clearMatrix()}
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
            const c = containerRef.current;
            if (!c) return;
            const target = Number(v);
            zoomAtPoint(target, c.clientWidth / 2, c.clientHeight / 2);
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
            onPress={() => applyMatrix(true)}
            title="Save (Esc, Enter, Tab, Arrows)"
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
        <ButtonGroup size="sm" className="gap-0 flex-col items-stretch">
          <Button
            size="sm"
            onPress={() => handleNavigate('prev')}
            isDisabled={!onNavigatePrev}
            title="Previous (Left Arrow, Shift-Tab)"
            aria-label="Navigate to previous"
            endContent={<Kbd aria-hidden>←</Kbd>}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onPress={() => handleNavigate('next')}
            isDisabled={!onNavigateNext}
            title="Next (Right Arrow, Tab)"
            aria-label="Navigate to next"
            endContent={<Kbd aria-hidden>→</Kbd>}
          >
            Next
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default DrawCanvas;
