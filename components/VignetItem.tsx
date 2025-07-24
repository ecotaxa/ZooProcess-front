import { useEffect, useRef, useState } from 'react';
import { VignetteData } from '@/components/lib/api';
import ResizeObserver from 'resize-observer-polyfill';
import { SmartImage } from '@/components/SmartImage';

const MAX_IMAGE_WIDTH = 200; // px
const MASK_OFFSET = 16; // px de séparation entre scan et mask

interface Props {
  vignette: VignetteData;
  folder: string;
  onUpdate: (data: Partial<VignetteData>) => void;
  index?: number;
  selected?: boolean;
  onClick?: () => void;
  onEditMask?: () => void;
  onImageLoaded?: (height: number) => void;
  maskRefreshKey?: number;
}

export default function VignetItem({
  vignette,
  folder,
  onUpdate,
  index = 0,
  selected = false,
  onClick,
  onEditMask,
  onImageLoaded,
  maskRefreshKey,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTallScan, setIsTallScan] = useState(false);

  function handleScanLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight / naturalWidth > 5) {
      setIsTallScan(true);
    }
  }

  // 1. Observer la visibilité pour le masque
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // 2. Observer la hauteur réelle du container (scan + mask)
  useEffect(() => {
    if (!containerRef.current || !onImageLoaded) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const height = Math.ceil(entry.contentRect.height);
        if (height > 0) {
          onImageLoaded(height);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onImageLoaded]);

  // 3. Générer le masque si nécessaire
  useEffect(() => {
    if (!isVisible) return;

    if (!vignette.mask) {
      const folderParam = folder.replace(/^\/+/g, '');
      fetch(
        `/api/generatedMask?scan=${encodeURIComponent(vignette.scan)}&folder=${encodeURIComponent(
          folderParam
        )}&matrix=${encodeURIComponent(vignette.matrix || '')}`
      )
        .then(async res => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return await res.json();
        })
        .then((data: { mask: string }) => {
          if (data.mask) {
            onUpdate({ mask: data.mask });
          }
        })
        .catch(err => {
          console.error('❌ Error generating mask', err);
        });
    }
  }, [isVisible, vignette.scan, vignette.mask, folder, vignette.matrix, onUpdate]);

  let scanSrc, maskSrc;
  if (folder.startsWith('/api/backend')) {
    scanSrc = `${folder}/${vignette.scan}`;
    maskSrc = vignette.mask
      ? `${folder}/${vignette.mask}` + (maskRefreshKey ? `?t=${maskRefreshKey}` : '')
      : '';
  } else {
    scanSrc = `/${folder}/${vignette.scan}`.replace(/\\/g, '/').replace(/\/\/+/, '/');
    maskSrc = vignette.mask
      ? `/${folder}/${vignette.mask}`.replace(/\\/g, '/').replace(/\/\/+/, '/') +
        (maskRefreshKey ? `?t=${maskRefreshKey}` : '')
      : '';
  }

  return (
    <div
      ref={containerRef}
      style={{ padding: '8px 0' }}
      onClick={onClick}
      tabIndex={0}
      className={`flex items-start gap-4 border-b p-2 rounded cursor-pointer transition-colors ${
        selected
          ? 'bg-blue-400 text-white ring-4 ring-blue-800 z-10'
          : index % 2 === 0
            ? 'bg-white'
            : 'bg-gray-50'
      }`}
    >
      {/* pseudo grille */}
      <div className="flex gap-4">
        <div style={{ maxWidth: 200, maxHeight: 200 }}>
          <SmartImage src={scanSrc} alt="Scan" />
        </div>
        <div style={{ maxWidth: 200, maxHeight: 200 }}>
          {maskSrc ? (
            <SmartImage
              src={maskSrc}
              alt="Mask"
              onClick={e => {
                e.stopPropagation();
                onEditMask?.();
              }}
            />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400 text-xs rounded border bg-gray-200">
              No mask
            </div>
          )}
        </div>
        <div className="ml-8" />
        <div className="flex  gap-4 ml-4 items-end justify-end">
          {vignette.vignettes?.map((img, i) => (
            <SmartImage
              key={i}
              src={
                folder.startsWith('/api/backend')
                  ? `${folder}/${img}`
                  : `/${folder}/${img}`.replace(/\\/g, '/').replace(/\/\/+/, '/')
              }
              alt={`Vignette ${i}`}
            />
          ))}
        </div>

        {/* Nom du fichier */}
        {/* <div className="ml-2 flex-1">
    <span className="font-mono text-xs">{vignette.scan}</span>
  </div> */}
      </div>
    </div>
  );
}
