import { useState, useRef, useCallback, useEffect } from 'react';
import { VariableSizeList as List, type ListChildComponentProps } from 'react-window';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';

import VignetItem from './VignetItem.tsx';
import type { VignetteData } from 'api/interfaces.ts';
import { readMatrixFromCompressedBinary } from 'app/lib/DrawCanvasTools.ts';
import DrawCanvas from 'app/components/DrawCanvas.tsx';
import { saveMaskViaApi, simulateMaskViaApi } from 'api/save-mask.ts';
import { getVignettes } from 'api/zooprocess-api.ts';
import { useAuth } from 'app/stores/auth-context.tsx';

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
  const { authState } = useAuth();
  const calculatedHeight = typeof window !== 'undefined' ? window.innerHeight * 0.78 : 800;
  const vignettes = initialVignettes;
  vignettes.sort((a, b) => {
    return b.score - a.score; // descending by score
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState<number | null>(null); // pour la modale édition
  const [imagePath, setImagePath] = useState<string>('');
  const [editMatrix, setEditMatrix] = useState<number[][] | undefined>(undefined);
  const [rowHeights, setRowHeights] = useState<{ [index: number]: number }>({});

  // Background image preload cache
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  // to the automatic scroll
  const listRef = useRef<any>(null);
  const loadRequestIdRef = useRef(0);
  // Preload a single URL once
  const preloadUrl = useCallback((url: string) => {
    if (typeof window === 'undefined') return;
    const cache = preloadedUrlsRef.current;
    if (!url || cache.has(url)) return;
    cache.add(url);
    const run = () => {
      const img = new window.Image();
      img.decoding = 'async';
      img.loading = 'eager' as any; // hint only
      img.src = url;
      // no onload needed; browser will cache
    };
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(run, { timeout: 1500 });
    } else {
      setTimeout(run, 20);
    }
  }, []);

  // Load the matrix and only set the imagePath after a successful load
  useEffect(() => {
    // Reset when there's no valid selection
    if (editIndex === null || editIndex < 0 || editIndex >= vignettes.length) {
      loadRequestIdRef.current++;
      setEditMatrix(undefined);
      setImagePath('');
      return;
    }

    const requestId = ++loadRequestIdRef.current;
    const ev = vignettes[editIndex];
    const gzFile = ev.matrix;

    const imgPath = folder.startsWith('/api/vignette')
      ? `${folder}/${ev.scan}`
      : `/${folder}/${ev.scan}`.replaceAll(/\\/, '/').replace(/\/\/+/, '/');

    function setMatrix(img: HTMLImageElement) {
      if (!canceled && loadRequestIdRef.current === requestId) {
        const img_height = img.naturalHeight;
        const img_width = img.naturalWidth;
        const blankMatrix = Array.from({ length: img_height }, () => new Array(img_width).fill(0));
        setEditMatrix(blankMatrix);
        setImagePath(imgPath);
      }
    }

    let canceled = false;
    if (gzFile == null) {
      const img = new Image();
      img.src = imgPath;
      img.decoding = 'async';
      img.loading = 'eager' as any; // hint only
      if (img.complete) {
        setTimeout(() => setMatrix(img), 5);
      } else {
        img.onload = () => {
          setMatrix(img);
        };
      }
    } else {
      const matrixUrl = `${folder}/${gzFile}`;
      const load = async () => {
        loadMatrixFromGz(matrixUrl).then(matrix => {
          if (!canceled && loadRequestIdRef.current === requestId) {
            setEditMatrix(matrix);
            setImagePath(imgPath);
          }
        });
      };
      void load();
    }
    return () => {
      canceled = true;
    };
  }, [editIndex, vignettes, folder]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid interfering when typing in inputs/textareas or when contentEditable
      const target = e.target as HTMLElement | null;
      const isTypingContext =
        !!target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isTypingContext) return;

      const modalOpen = editIndex !== null;

      // When the edit modal is open, it fully manages navigation and shortcuts
      if (modalOpen) return;

      // List-level navigation when no modal is open
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedIndex(i => Math.max(i - 1, 0));
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedIndex(i => Math.min(i + 1, vignettes.length - 1));
        e.preventDefault();
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          setSelectedIndex(i => Math.max(i - 1, 0));
        } else {
          setSelectedIndex(i => Math.min(i + 1, vignettes.length - 1));
        }
        e.preventDefault();
      } else if (e.key === 'Enter') {
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

  // Global preload: fetch ALL images (mask and scan) in background, chunked
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!vignettes || !vignettes.length) return;

    let canceled = false;
    const CHUNK = 50; // number of items per idle slice
    let i = 0;

    const processChunk = () => {
      if (canceled) return;
      const end = Math.min(i + CHUNK, vignettes.length);
      for (let j = i; j < end; j++) {
        const v = vignettes[j];
        if (!v) continue;
        if (v.scan) preloadUrl(`${folder}/${v.scan}`);
        if (v.mask) preloadUrl(`${folder}/${v.mask}`);
      }
      i = end;
      if (i < vignettes.length) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(processChunk, { timeout: 1500 });
        } else {
          setTimeout(processChunk, 20);
        }
      }
    };

    // start immediately to not wait for scroll events
    processChunk();

    return () => {
      canceled = true;
    };
  }, [vignettes, folder, preloadUrl]);

  // Item renderer for react-window
  const Row = ({ index, style }: ListChildComponentProps) => {
    return (
      <div style={style}>
        <VignetItem
          key={index}
          vignette={vignettes[index]}
          folder={folder}
          onUpdate={() => {}}
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
      // e.g. /api/vignette/689c42f9e63c0c86d9cc0df6/689c42f9e63c0c86d9cc0df7/689c42f9e63c0c86d9cc0dfa/
      const img_address = folder.split('/').slice(-3);
      // e.g. v10_cut:apero2023_tha_bioness_005_st20_d_n1_d3_1_x1045yDD7wB9h4A.png
      const img_name = srcFile.split(':').slice(-1)[0];
      // Re-fetch the vignette data
      getVignettes(authState.accessToken!, img_address[0], img_address[1], img_address[2], img_name)
        .then(rrsp => {
          vignettes[editIndex] = rrsp.data[0];
        });
    } catch (err) {
      alert('Erreur sauvegarde mask: ' + err);
    }
  };

  const handlePreview = async (matrix: number[][]) => {
    if (editIndex == null) return;
    const srcFile = vignettes[editIndex].scan;
    try {
      return await simulateMaskViaApi(matrix, srcFile, folder);
    } catch (err) {
      alert('Erreur simulation mask: ' + err);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div className="mb-2">
        {vignettes.length} objects to validate
        <span className="ml-2 text-xs text-gray-500">
          To be sure to review all images, you can scroll page by page using Space or Page Down
        </span>
      </div>
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
              {!editMatrix && <span>No vignette?</span>}
              {editMatrix && (
                <DrawCanvas
                  key={imagePath}
                  imagePath={imagePath}
                  initialMatrix={editMatrix}
                  strokeColor="red"
                  onPreview={handlePreview}
                  onApply={handleApply}
                  onCancel={handleCloseEdit}
                  onNavigatePrev={() => {
                    if (editIndex === null) return;
                    const newIndex = Math.max(editIndex - 1, 0);
                    if (newIndex !== editIndex) {
                      setSelectedIndex(newIndex);
                      handleEditMask(newIndex);
                    }
                  }}
                  onNavigateNext={() => {
                    console.log('onNavigateNext ', editIndex, vignettes.length);
                    if (editIndex === null) return;
                    const newIndex = Math.min(editIndex + 1, vignettes.length - 1);
                    if (newIndex !== editIndex) {
                      setSelectedIndex(newIndex);
                      handleEditMask(newIndex);
                    }
                  }}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
