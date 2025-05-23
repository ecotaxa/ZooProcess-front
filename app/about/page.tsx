"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import DrawCanvas from "@/components/DrawCanvas";

import {
  mergeImageWithMatrix,
  saveMatrixAsCompressedBinary,
  readMatrixFromCompressedBinary,
  readMatrixFromBinary,
  saveMatrixAsBinary
} from "@/components/DrawCanvasTools";

export default function TestCanvasPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [latestMatrix, setLatestMatrix] = useState<number[][] | null>(null);

  const imagePath = "/test/apero2023_pp_wp2_001_st01_d_d1_1_567.jpg";

  const handleApply = (matrix: number[][]) => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const resultCanvas = mergeImageWithMatrix(img, matrix);
      const dataUrl = resultCanvas.toDataURL("image/png");
      setImageUrl(dataUrl);
      setLatestMatrix(matrix);
      onClose();
    };
  };

  const handleSaveMatrix = () => {
    if (latestMatrix) {
      saveMatrixAsBinary(latestMatrix, "masque.bin");
    }
  };

  
  const handleSaveMatrixCompressed = () => {
    if (latestMatrix) {
      saveMatrixAsCompressedBinary(latestMatrix, "masque_compressé.gz");
    }
  };

  const handleSaveImage = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "fusion-result.png";
      link.click();
    }
  };

  const handleImportBinaryMatrix = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const matrix = readMatrixFromBinary(buffer);
    setLatestMatrix(matrix);
  };


  const handleImportCompressedBinaryMatrix = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const matrix = readMatrixFromCompressedBinary(buffer);
    setLatestMatrix(matrix);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Masquage avec compression</h1>

      <img
        src={imagePath}
        alt="Miniature"
        className="w-48 cursor-pointer border border-gray-400 rounded"
        onClick={onOpen}
      />

      <div className="flex items-center gap-4 flex-wrap mb-4">
        <Button onPress={onOpen} color="primary">
          Éditer le masque
        </Button>

        <label className="text-sm">
          <span className="mr-2">Importer un masque compressé(.gz) :</span>
          <input type="file" accept=".bin" onChange={handleImportCompressedBinaryMatrix} />
        </label>

        <label className="text-sm">
          <span className="mr-2">Importer un masque (.bin) :</span>
          <input type="file" accept=".bin" onChange={handleImportBinaryMatrix} />
        </label>
        
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="full" backdrop="blur">
        <ModalContent>
          <ModalHeader>Masquage interactif</ModalHeader>
          <ModalBody>
            <div
              style={{
                margin: "0 auto",
                maxWidth: "75vw",
                maxHeight: "75vh",
                overflow: "auto",
              }}
            >
              <DrawCanvas
                imagePath={imagePath}
                strokeColor="red"
                initialMatrix={latestMatrix ?? undefined}
                onApply={handleApply}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Fermer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {imageUrl && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Résultat fusionné</h2>
          <div className="overflow-auto border p-2 inline-block max-w-full">
            <img
              src={imageUrl}
              alt="Fusion"
              className="block"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button color="primary" onPress={handleSaveImage}>
              Télécharger l’image
            </Button>
            <Button color="secondary" onPress={handleSaveMatrixCompressed}>
              Sauvegarder le masquecompressé (.gz)
            </Button>
            <Button color="tertiary" onPress={handleSaveMatrix}>
              Sauvegarder le masque (.bin)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
