import { TopNavbar } from "components/TopNavbar";
import { Inputs } from "components/inputs/Inputs";
import { Images } from "components/images/Images";
import { ImageModal } from "components/images/ImageModal";
import { Status } from "components/status/Status";

import { useStatus } from "hooks/useStatus";
import { usePhoto } from "hooks/usePhoto";

import styled from "styled-components";
import { useOcr } from "hooks/useOcr";
import {
  uphoto_handleDelete,
  uphoto_handleFilter,
  uphoto_handleUpload,
} from "utils/photo";

function App() {
  const { fileData, setFileData, clearFileData } = useOcr();

  const {
    isStatusLoading,
    statusMessage,
    setStatusMessage,
    clearStatusMessage,
    setIsStatusLoading,
    clearIsStatusLoading,
  } = useStatus();

  const {
    photos,
    selectedPhotoID,
    setPhotos,
    clearPhotos,
    setSelectedPhotoID,
    clearSelectedPhotoID,
  } = usePhoto();

  /**
   * Handler for the Inputs sub-component.
   * Submit the file to server to start performing OCR.
   */
  const handleUpload = (file: File) => {
    setIsStatusLoading();
    clearStatusMessage();

    uphoto_handleUpload({
      fileID: fileData.fileID,
      file,
    })
      .then((res) => {
        setFileData(res);
        setPhotos({ photos: res.allPhotos });
      })
      .catch((err) => {
        setStatusMessage({ message: err.message });
      })
      .finally(() => {
        clearIsStatusLoading();
      });
  };

  /**
   * Handler to delete the uploaded file.
   */
  const handleDeleteFileServer = () => {
    if (fileData.fileID === undefined) return;

    setIsStatusLoading();
    clearStatusMessage();

    uphoto_handleDelete({
      fileID: fileData.fileID,
    })
      .then(() => {
        clearFileData();
        clearPhotos();
      })
      .catch((err) => {
        setStatusMessage({ message: err.message });
      })
      .finally(() => {
        clearIsStatusLoading();
      });
  };

  /**
   * Handler to enlarge the clicked photo into a modal.
   */
  const handleClickThumbnail = (id: number) => {
    setSelectedPhotoID({ photoId: id });
  };

  /**
   * Handler to filter the list of photos to the ones containing the inputted search word.
   */
  const handleSetSearchWords = (searchWord: string | undefined) => {
    if (!fileData.fileID) return;

    setIsStatusLoading();
    clearStatusMessage();

    uphoto_handleFilter({
      fileData,
      searchWord,
    })
      .then((res) => {
        setPhotos({ photos: res.photos });
      })
      .catch((err) => {
        setStatusMessage({ message: err.message });
      })
      .finally(() => {
        clearIsStatusLoading();
      });
  };

  const handleImageModalClose = () => {
    clearSelectedPhotoID();
  };

  return (
    <AppContainer>
      <TopNavbar />
      <Inputs
        onFileSubmit={handleUpload}
        onSearchWords={handleSetSearchWords}
        onFileDelete={handleDeleteFileServer}
        isFileLoading={isStatusLoading}
        isSearchDisabled={fileData.allPhotos.length === 0}
      />
      <Images photos={photos} onClick={handleClickThumbnail} />
      <ImageModal
        selectedPhotoURL={
          selectedPhotoID !== undefined ? photos[selectedPhotoID] : undefined
        }
        onModalClose={handleImageModalClose}
      />
      <Status isLoading={isStatusLoading} message={statusMessage} />
    </AppContainer>
  );
}

const AppContainer = styled.div``;

export default App;
