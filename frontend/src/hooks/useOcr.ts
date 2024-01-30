import { useState } from "react";
import { initOCR } from "utils/constants";
import { Ocr } from "utils/types";

export const useOcr = () => {
  const [fileData, setFileData] = useState<{
    allPhotos: string[];
    ocr: Ocr;
    fileID: string | undefined;
  }>({
    // allPhoto: photo for each page of the PDF
    allPhotos: [],
    ocr: initOCR,
    fileID: undefined,
  });

  const handleSetFileData = ({ allPhotos, ocr, fileID }: typeof fileData) => {
    setFileData({
      allPhotos,
      ocr,
      fileID,
    });
  };

  const handleClearFileData = () => {
    setFileData({
      allPhotos: [],
      ocr: initOCR,
      fileID: undefined,
    });
  };

  return {
    fileData,
    setFileData: handleSetFileData,
    clearFileData: handleClearFileData,
  };
};
