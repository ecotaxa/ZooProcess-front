import { useState, useRef, useCallback, useEffect } from 'react';
import VignetItem from '@/components/VignetItem.tsx';
import { VignetteData } from '@/components/lib/api.ts';
import { VariableSizeList as List, ListChildComponentProps } from 'react-window';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

import {
  readMatrixFromCompressedBinary,
  saveMatrixAsCompressedBinary,
} from '@/components/DrawCanvasTools.tsx';
import DrawCanvas from '@/components/DrawCanvas.tsx';
import { saveMaskViaApi } from '@/lib/save-mask.ts';
// import { X } from 'framer-motion/dist/types.d-CtuPurYT';

// const VignetItem = dynamic(() => import('./VignetItem'), { ssr: false })

async function loadMatrixFromGz(url: string): Promise<number[][]> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return readMatrixFromCompressedBinary(buffer);
}

// Fonction utilitaire pour sauvegarder le matrix .gz côté front
function saveMaskGzClient(matrix: number[][], filename: string) {
  saveMatrixAsCompressedBinary(matrix, filename);
}
interface Props {
  initialVignettes: VignetteData[];
  folder: string;
  // itemHeight?: number; // Pour custom la hauteur d'une vignette
  // height?: number;     // Hauteur du viewport de la liste
}

export default function VignetList({
  initialVignettes,
  folder,
  // itemHeight = 110, // à ajuster selon le rendu visuel de VignetItem
  // height = 700      // hauteur scrollable visible (px)
}: Props) {
  // const itemHeight = 110
  const calculatedHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const [vignettes, setVignettes] = useState<VignetteData[]>(initialVignettes);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState<number | null>(null); // pour la modale édition
  const [editMatrix, setEditMatrix] = useState<number[][] | undefined>(undefined);
  const [zoomMaskSrc, setZoomMaskSrc] = useState<string | null>(null);
  // const selectedVignette = vignettes[selectedIndex];
  const [maskRefreshMap, setMaskRefreshMap] = useState<{ [mask: string]: number }>({});
  const [rowHeights, setRowHeights] = useState<{ [index: number]: number }>({});

  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // to the automaitc scroll
  const listRef = useRef<any>(null);

  const updateVignette = useCallback((index: number, newData: Partial<VignetteData>) => {
    setVignettes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newData };
      return updated;
    });
  }, []);

  useEffect(() => {
    const selectedVignette = vignettes[selectedIndex];
    if (selectedVignette?.mask) {
      if (folder.startsWith('/api/backend')) {
        setZoomMaskSrc(`${folder}/${selectedVignette.mask}`);
      } else {
        setZoomMaskSrc(
          `/${folder}/${selectedVignette.mask}`.replace(/\\/g, '/').replace(/\/\/+/, '/')
        );
      }
    } else {
      setZoomMaskSrc(null);
    }
  }, [selectedIndex, vignettes, folder]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex(i => Math.min(i + 1, vignettes.length - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(i => Math.max(i - 1, 0));
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vignettes.length]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(selectedIndex, 'center');
    }
  }, [selectedIndex]);

  const handleMaskHover = useCallback((maskSrc: string | null) => {
    setZoomMaskSrc(maskSrc);
  }, []);

  // Item renderer pour react-window
  const Row = ({ index, style }: ListChildComponentProps) => {
    const maskName = vignettes[index].mask || '';
    const maskRefreshKey = maskRefreshMap[maskName] || 0;

    return (
      <div style={style}>
        <VignetItem
          key={index}
          vignette={vignettes[index]}
          folder={folder}
          onUpdate={(newData: any) => updateVignette(index, newData)}
          index={index}
          selected={index === selectedIndex} // move scroll on this ligne and show the zoomed scan with its segmentation lines on the right side
          onClick={() => setSelectedIndex(index)}
          onEditMask={() => {
            setSelectedIndex(index);
            handleEditMask(index);
          }} // open the editor
          onImageLoaded={(height: number) => {
            console.log('👀 imageLoaded', index, height);

            setRowHeights(prev => {
              const current = prev[index];
              if (Math.abs(current - height) < 2) return prev;
              if (current === height) return prev;

              const next = { ...prev, [index]: height };
              console.log('🔁 setHeight', index, height);

              // requestAnimationFrame(() => {
              //   if (listRef.current) {
              //     listRef.current.resetAfterIndex(index, false); // ⛔ pas de scroll jump
              //   }
              // });
              setTimeout(() => {
                console.log('🧯 resetAfterIndex', index, height);
                listRef.current?.resetAfterIndex(index, false);
              }, 0);

              return next;
            });
          }}
          maskRefreshKey={maskRefreshKey}
        />
      </div>
    );
  };

  // const getItemSize = (index: number) => rowHeights[index] || 120; // 120px par défaut
  // const getItemSize = (index: number) => Math.max(rowHeights[index] || 0, 96);
  // const getItemSize = (index: number) => Math.max(rowHeights[index] || 120, 96);
  // const getItemSize = (index: number) => {
  //   const h = rowHeights[index];
  //   return h && h > 0 ? h : 120; // minimum safe fallback
  // };
  const getItemSize = (index: number) => {
    const h = rowHeights[index];
    if (!h || h < 96) {
      console.warn('⚠️ Missing or too small height', h, ' for index', index, '→ fallback 120');
      return 120;
    }
    return h;
  };

  // Modale
  const handleEditMask = async (index: number) => {
    setEditIndex(index);
    setEditMatrix(undefined); // Reset pour forcer rechargement
    const gzFile = vignettes[index].matrix;
    let matrixUrl;
    if (folder.startsWith('/api/backend')) {
      matrixUrl = `${folder}/${gzFile}`;
    } else {
      matrixUrl = `/${folder}/${gzFile}`.replace(/\\/g, '/').replace(/\/\/+/, '/');
    }
    try {
      const matrix = await loadMatrixFromGz(matrixUrl); // Utilise ta fonction de chargement .gz
      setEditMatrix(matrix);
    } catch (e) {
      // fallback matrice zéro si erreur
      let imgPath;
      if (folder.startsWith('/api/backend')) {
        imgPath = `${folder}/${vignettes[index].scan}`;
      } else {
        imgPath = `/${folder}/${vignettes[index].scan}`.replace(/\\/g, '/').replace(/\/\/+/, '/');
      }
      const img = new window.Image();
      img.src = imgPath;
      img.onload = () => {
        setEditMatrix(Array.from({ length: img.height }, () => Array(img.width).fill(0)));
      };
    }
  };

  const handleCloseEdit = () => {
    setEditIndex(null);
    setEditMatrix(undefined);
  };

  const handleApply = async (matrix: number[][]) => {
    if (editIndex == null) return;
    const gzFile = vignettes[editIndex].matrix;
    try {
      await saveMaskViaApi(matrix, gzFile, folder);
      setMaskRefreshMap(prev => ({
        ...prev,
        [vignettes[editIndex].mask!]: Date.now(),
      }));
      handleCloseEdit();
      // Optionnel: reload la vignette ou toast
    } catch (err) {
      alert('Erreur sauvegarde mask: ' + err);
    }
  };

  const editVignette = editIndex !== null ? vignettes[editIndex] : null;
  let imagePath;
  if (folder.startsWith('/api/backend')) {
    imagePath = editVignette ? `${folder}/${editVignette.scan}` : '';
  } else {
    imagePath = editVignette
      ? `/${folder}/${editVignette.scan}`.replace(/\\/g, '/').replace(/\/\/+/, '/')
      : '';
  }

  useEffect(() => {
    if (!imagePath) return;

    const img = new window.Image();
    img.src = imagePath;
    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  }, [imagePath]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* <div className="absolute inset-0 pl-[320px]"> */}
      <List
        ref={listRef}
        height={calculatedHeight}
        itemCount={vignettes.length}
        itemSize={getItemSize}
        width="100%"
        className="border rounded bg-white"
        itemKey={index => vignettes[index].scan}
      >
        {Row}
      </List>
      {/* </div> */}

      {zoomMaskSrc && (
        <div
          className="fixed left-0 top-0 h-full flex items-center z-50 pointer-events-none"
          style={{ width: '320px' }}
        >
          <img
            src={zoomMaskSrc}
            alt="Mask zoom"
            className="max-h-[80vh] max-w-[300px] m-6 rounded shadow-2xl bg-white"
            style={{
              border: '4px solid white',
              boxShadow: '0 0 20px #0006',
            }}
            draggable={false}
          />
        </div>
      )}
      {editIndex !== null && editMatrix && (
        <Modal
          isOpen={editIndex !== null && !!editMatrix}
          onClose={handleCloseEdit}
          backdrop="blur"
          placement="center"
          className="!max-w-none !w-auto !h-auto"
        >
          <ModalContent className="h-full">
            <ModalHeader>Mask edit</ModalHeader>
            <ModalBody className="flex-1 overflow-auto flex justify-center items-center p-2">
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: 'calc(100vw - 64px)',
                  maxHeight: 'calc(100vh - 64px)',
                }}
              >
                <DrawCanvas
                  imagePath={imagePath}
                  initialMatrix={editMatrix}
                  strokeColor="red"
                  onApply={handleApply}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={handleCloseEdit}>Fermer</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
