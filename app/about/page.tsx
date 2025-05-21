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
import DrawCanvas, { mergeImageWithMatrix } from "@/components/DrawCanvas";

export default function TestCanvasPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const imagePath = "/test/apero2023_pp_wp2_001_st01_d_d1_1_567.jpg";

  const handleApply = (matrix: number[][]) => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      const resultCanvas = mergeImageWithMatrix(img, matrix);
      const dataUrl = resultCanvas.toDataURL("image/png");
      setImageUrl(dataUrl);
      onClose();
    };
  };

  const handleSave = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "fusion-result.png";
    link.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Masquage Image</h1>

      <img
        src={imagePath}
        alt="Miniature"
        className="w-48 cursor-pointer border border-gray-400 rounded"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="full" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Masquage interactif</ModalHeader>
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
                onApply={handleApply}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {imageUrl && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Image fusionnée</h2>
          <div className="overflow-auto border p-2 inline-block max-w-full">
            <img
              src={imageUrl}
              alt="Fusion"
              className="block"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="mt-4">
            <Button color="primary" onPress={handleSave}>
              Sauvegarder l’image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
