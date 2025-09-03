import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { SmartImage } from 'app/components/SmartImage';
import type { VignetteData } from 'api/interfaces.ts';

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
}: Readonly<Props>) {
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

  const scanSrc = `${folder}/${vignette.scan}`;
  const maskSrc = vignette.mask ? `${folder}/${vignette.mask}` : null;
  const score = Math.round(vignette.score * 100);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      tabIndex={0}
      className={`flex items-start gap-4 border-b p-1 rounded cursor-pointer transition-colors ${
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
          <SmartImage
            src={maskSrc || scanSrc}
            alt="Mask"
            onClick={e => {
              e.stopPropagation();
              onEditMask?.();
            }}
          />
        </div>
        <div
          style={{ writingMode: 'vertical-rl', textOrientation: 'upright', textAlign: 'center' }}
        >
          {score}
        </div>
        <div className="flex gap-4 ml-0 items-end justify-end">
          {vignette.vignettes?.map((img, i) => (
            <SmartImage
              key={img}
              src={
                folder.startsWith('/vignette')
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
