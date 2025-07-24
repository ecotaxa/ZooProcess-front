import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Spinner } from '@heroui/react';
import { readMatrixFromCompressedBinary, mergeImageWithMatrix } from '@/components/DrawCanvasTools';

type VignetteLineProps = {
  data: {
    scan: string;
    matrix: string;
    mask?: string;
  };
  folder: string;
  apiUrl: string;
};

const VignetteLine: React.FC<VignetteLineProps> = ({ data, folder, apiUrl }) => {
  const [maskPath, setMaskPath] = useState<string | null>(data.mask || null);
  const scanRef = useRef<HTMLImageElement>(null);

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // 🔧 Pour éviter hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const maxHeight = 200;

  useEffect(() => {
    const processMask = async () => {
      if (!data.mask && scanRef.current) {
        try {
          const matrixUrl = `${folder}/${data.matrix}`;
          console.log('🔍 VignetteLine fetch matrix URL:', matrixUrl);

          const matrixRes = await fetch(matrixUrl);
          const buffer = await matrixRes.arrayBuffer();
          const matrix = readMatrixFromCompressedBinary(buffer);

          const img = scanRef.current;

          if (!img.complete) {
            img.onload = () => {
              const canvas = mergeImageWithMatrix(img, matrix);
              const dataUrl = canvas.toDataURL('image/png');
              setMaskPath(dataUrl);
            };
            return;
          }

          const canvas = mergeImageWithMatrix(img, matrix);
          const dataUrl = canvas.toDataURL('image/png');
          setMaskPath(dataUrl);
        } catch (err) {
          console.error('Erreur lors de la génération du mask :', err);
        }
      }
    };

    processMask();
  }, [data.mask, data.matrix, data.scan, folder]);

  return (
    <>
      <Card shadow="sm" className="p-4 my-4">
        <CardBody>
          <div className="flex flex-row gap-4 overflow-auto items-start w-full justify-start">
            {/* Image cachée utilisée pour merge */}
            <img
              ref={scanRef}
              src={`${folder}/${data.scan}`}
              alt="Scan for Processing"
              style={{ display: 'none' }}
            />

            {/* Image Scan affichée */}
            <div className="debug-border flex-shrink-0">
              <img
                src={`${folder}/${data.scan}`}
                alt="Scan Image"
                style={{ maxHeight: `${maxHeight}px` }}
                className="object-contain max-w-full"
              />
            </div>

            {/* Image Mask avec effet de survol */}
            <div
              className="debug-border relative flex-shrink-0"
              onMouseEnter={() => setZoomVisible(true)}
              onMouseLeave={() => setZoomVisible(false)}
              onMouseMove={e => {
                setZoomPosition({
                  x: e.clientX + 20,
                  y: e.clientY + 20,
                });
              }}
            >
              {maskPath ? (
                <img
                  src={maskPath}
                  alt="Mask Image"
                  style={{ maxHeight: `${maxHeight}px` }}
                  className="object-contain max-w-full"
                />
              ) : (
                <Spinner label="Génération du mask..." />
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ZOOM détaché et affiché uniquement côté client */}
      {isClient && zoomVisible && maskPath && (
        <div
          className="fixed z-50 pointer-events-none border border-gray-400 shadow-xl bg-white"
          style={{
            top: zoomPosition.y,
            left: zoomPosition.x,
          }}
        >
          <img
            src={maskPath}
            alt="Zoomed Mask"
            className="block"
            style={{
              maxWidth: 'none',
              maxHeight: 'none',
            }}
          />
        </div>
      )}

      {/* 
      // 🔧 Zone des vignettes désactivée temporairement
      <div className="mt-6 debug-border">
        <h4 className="text-lg font-semibold mb-2">Vignettes</h4>
        {loading ? (
          <Spinner label="Chargement des vignettes..." />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {vignettes.map((vignette, index) => (
              <div key={index} className="debug-border text-center">
                <Image src={vignette} alt={`Vignette ${index + 1}`} width="100%" />
                <small className="text-xs">{vignette.split('/').pop()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
      */}
    </>
  );
};

export default VignetteLine;
