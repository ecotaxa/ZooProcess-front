import { useState, useRef, useCallback, useEffect } from 'react';
import { VariableSizeList as List, type ListChildComponentProps } from 'react-window';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

import VignetItem from './VignetItem.tsx';
import type { VignetteData } from 'api/interfaces.ts';
import {
  readMatrixFromCompressedBinary,
  saveMatrixAsCompressedBinary,
} from 'app/lib/DrawCanvasTools.ts';
import DrawCanvas from 'app/components/DrawCanvas.tsx';
import { saveMaskViaApi } from 'api/save-mask.ts';
// import { X } from 'framer-motion/dist/types.d-CtuPurYT';

// const VignetItem = dynamic(() => import('./VignetItem'), { ssr: false })

async function loadMatrixFromGz(url: string): Promise<number[][]> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return readMatrixFromCompressedBinary(buffer);
}

interface Props {
  initialVignettes: VignetteData[];
  folder: string;
  // itemHeight?: number; // Pour custom la hauteur d'une vignette
  // height?: number;     // Hauteur du viewport de la liste
}

export default function VignetteList({
  initialVignettes,
  folder,
  // itemHeight = 110, // à ajuster selon le rendu visuel de VignetItem
  // height = 700      // hauteur scrollable visible (px)
}: Readonly<Props>) {
  // const itemHeight = 110
  const calculatedHeight = typeof window !== 'undefined' ? window.innerHeight * 0.78 : 800;
  // const [vignettes, setVignettes] = useState<VignetteData[]>(initialVignettes);
  const vignettes = initialVignettes;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState<number | null>(null); // pour la modale édition
  const [editMatrix, setEditMatrix] = useState<number[][] | undefined>(undefined);

  // Materialize dependency: whenever editIndex changes, (re)load the corresponding matrix
  useEffect(() => {
    if (editIndex === null) return;
    // Guard against out-of-range
    if (editIndex < 0 || editIndex >= vignettes.length) return;

    const requestId = ++loadRequestIdRef.current;
    const gzFile = vignettes[editIndex].matrix;

    let matrixUrl: string;
    if (folder.startsWith('/api/vignette')) {
      matrixUrl = `${folder}/${gzFile}`;
    } else {
      matrixUrl = `/${folder}/${gzFile}`.replace(/\\/g, '/').replace(/\/\/+/, '/');
    }

    const load = async () => {
      try {
        const matrix = await loadMatrixFromGz(matrixUrl);
        if (loadRequestIdRef.current === requestId) {
          setEditMatrix(matrix);
        }
      } catch (e) {
        // Fallback to zero matrix sized to image if we cannot load the gz
        let imgPath: string;
        if (folder.startsWith('/api/vignette')) {
          imgPath = `${folder}/${vignettes[editIndex].scan}`;
        } else {
          imgPath = `/${folder}/${vignettes[editIndex].scan}`
            .replace(/\\/g, '/')
            .replace(/\/\/+/, '/');
        }
        const img = new window.Image();
        img.src = imgPath;
        img.onload = () => {
          if (loadRequestIdRef.current === requestId) {
            setEditMatrix(Array.from({ length: img.height }, () => Array(img.width).fill(0)));
          }
        };
      }
    };

    // Clear previous matrix while loading (optional)
    setEditMatrix(undefined);
    void load();
  }, [editIndex, vignettes, folder]);

  const [maskRefreshMap, setMaskRefreshMap] = useState<{ [mask: string]: number }>({});
  const [rowHeights, setRowHeights] = useState<{ [index: number]: number }>({});

  const [, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // to the automatic scroll
  const listRef = useRef<any>(null);
  const loadRequestIdRef = useRef(0);

  const updateVignette = useCallback((index: number, newData: Partial<VignetteData>) => {
    // setVignettes(prev => {
    //   const updated = [...prev];
    //   updated[index] = { ...updated[index], ...newData };
    //   return updated;
    // });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid interfering when typing in inputs/textareas or when contentEditable
      const target = e.target as HTMLElement | null;
      const isTypingContext =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          (target as HTMLElement).isContentEditable);
      if (isTypingContext) return;

      const modalOpen = editIndex !== null;

      if (e.key === 'ArrowLeft') {
        if (modalOpen && editIndex !== null) {
          const newIndex = Math.max(editIndex - 1, 0);
          if (newIndex !== editIndex) {
            setSelectedIndex(newIndex);
            handleEditMask(newIndex);
          }
        } else {
          setSelectedIndex(i => Math.max(i - 1, 0));
        }
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        if (modalOpen && editIndex !== null) {
          const newIndex = Math.min(editIndex + 1, vignettes.length - 1);
          if (newIndex !== editIndex) {
            setSelectedIndex(newIndex);
            handleEditMask(newIndex);
          }
        } else {
          setSelectedIndex(i => Math.min(i + 1, vignettes.length - 1));
        }
        e.preventDefault();
      } else if (!modalOpen && e.key === 'ArrowDown') {
        setSelectedIndex(i => Math.min(i + 1, vignettes.length - 1));
        e.preventDefault();
      } else if (!modalOpen && e.key === 'ArrowUp') {
        setSelectedIndex(i => Math.max(i - 1, 0));
        e.preventDefault();
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift+Tab => previous
          if (modalOpen && editIndex !== null) {
            const newIndex = Math.max(editIndex - 1, 0);
            if (newIndex !== editIndex) {
              setSelectedIndex(newIndex);
              handleEditMask(newIndex);
            }
          } else {
            setSelectedIndex(i => Math.max(i - 1, 0));
          }
        } else {
          // Tab => next
          if (modalOpen && editIndex !== null) {
            const newIndex = Math.min(editIndex + 1, vignettes.length - 1);
            if (newIndex !== editIndex) {
              setSelectedIndex(newIndex);
              handleEditMask(newIndex);
            }
          } else {
            setSelectedIndex(i => Math.min(i + 1, vignettes.length - 1));
          }
        }
        e.preventDefault();
      } else if (!modalOpen && e.key === 'Enter') {
        // Open the edit modal for the currently selected vignette
        handleEditMask(selectedIndex);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [vignettes.length, editIndex, selectedIndex]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(selectedIndex, 'center');
    }
  }, [selectedIndex]);

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
            // console.log('👀 imageLoaded', index, height);
            setRowHeights(prev => {
              const current = prev[index];
              if (Math.abs(current - height) < 2) return prev;
              if (current === height) return prev;

              const next = { ...prev, [index]: height };
              // console.log('🔁 setHeight', index, height);

              // requestAnimationFrame(() => {
              //   if (listRef.current) {
              //     listRef.current.resetAfterIndex(index, false); // ⛔ pas de scroll jump
              //   }
              // });
              setTimeout(() => {
                // console.log('🧯 resetAfterIndex', index, height);
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

  const getItemSize = (index: number) => {
    const h = rowHeights[index];
    let ret: number;
    if (!h || h < 96) {
      // console.warn('⚠️ Missing or too small height', h, ' for index', index, '→ fallback 120');
      ret = 120;
    } else {
      ret = h;
    }
    return ret + 8; // add some padding
  };

  // Modale
  const handleEditMask = (index: number) => {
    setEditIndex(index);
  };

  const handleCloseEdit = () => {
    loadRequestIdRef.current++;
    setEditIndex(null);
  };

  const handleApply = async (matrix: number[][]) => {
    if (editIndex == null) return;
    const srcFile = vignettes[editIndex].scan;
    try {
      await saveMaskViaApi(matrix, srcFile, folder);
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
  if (folder.startsWith('/api/vignette')) {
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
    <div className="relative w-full overflow-hidden bg-white">
      {vignettes.length} to validate
      <List
        ref={listRef}
        height={calculatedHeight}
        width="100%"
        itemCount={vignettes.length}
        itemSize={getItemSize}
        className="border rounded bg-white"
        itemKey={index => vignettes[index].scan}
      >
        {Row}
      </List>
      {editIndex !== null && (
        <Modal
          isOpen={true}
          onClose={handleCloseEdit}
          backdrop="blur"
          placement="center"
          scrollBehavior={'inside'}
          size={'5xl'}
          isDismissable={false}
        >
          <ModalContent className="h-full">
            <ModalHeader>Separate {editIndex}</ModalHeader>
            <ModalBody>
              <DrawCanvas
                imagePath={imagePath}
                initialMatrix={editMatrix}
                strokeColor="red"
                onApply={handleApply}
              />
            </ModalBody>
            <ModalFooter>
              <Button onPress={handleCloseEdit}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
