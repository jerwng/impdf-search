import { useState } from "react";

export const usePhoto = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotoID, setselectedPhotoID] = useState<number | undefined>();

  const handleSetPhotos = ({ photos }: { photos: string[] }) => {
    setPhotos(photos);
  };

  const handleClearPhotos = () => {
    setPhotos([]);
  };

  const handleSetSelectedPhotoID = ({ photoId }: { photoId: number }) => {
    setselectedPhotoID(photoId);
  };

  const handleClearSelectedPhotoID = () => {
    setselectedPhotoID(undefined);
  };

  return {
    photos,
    selectedPhotoID,
    setPhotos: handleSetPhotos,
    clearPhotos: handleClearPhotos,
    setSelectedPhotoID: handleSetSelectedPhotoID,
    clearSelectedPhotoID: handleClearSelectedPhotoID,
  };
};
