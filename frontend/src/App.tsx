import { TopNavbar } from "components/TopNavbar";
import { Inputs } from "components/inputs/Inputs";
import { Images } from "components/images/Images";
import { ImageModal } from "components/images/ImageModal";
import { Status } from "components/status/Status";

import { useStatus } from "hooks/useStatus";
import { usePhoto } from "hooks/usePhoto";

import {
  uapi_post_pdf,
  uapi_post_search,
  uapi_get_results,
  uapi_delete,
} from "utils/api";

import styled from "styled-components";
import { useOcr } from "hooks/useOcr";

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

  let pollingIntervalCount = 0;
  let pollingInterval: ReturnType<typeof setInterval>;

  /**
   * Handler for the Inputs sub-component.
   * Submit the file to server to start performing OCR.
   */
  const handleUpload = (file: File) => {
    const file_form_data = new FormData();
    file_form_data.append("file", file);

    setIsStatusLoading();

    /**
     * Delete previous uploaded file data from server
     */
    if (typeof fileData.fileID !== "undefined") {
      const searchBody = {
        fileID: fileData.fileID,
      };

      uapi_delete(searchBody);
    }

    uapi_post_pdf(file_form_data).then((res) => {
      /*
      Server responds with a jobID once the file is submitted for OCR in the background.
      Call polling function every 10s to check if OCR is done.
      */
      pollingIntervalCount = 0;
      pollingInterval = setInterval(() => pollingTimer(res.jobID), 10000);
    });
  };

  /**
   * Polling function to check if the OCR background job is completed.
   */
  const pollingTimer = (jobID: string) => {
    uapi_get_results(jobID).then((res) => {
      /**
       * Render the processed photo and stop polling cuntion once OCR background job
       * finishes and returns the values.
       */
      if (res.status === "Finished") {
        clearInterval(pollingInterval);
        setFileData({
          allPhotos: res.photos,
          ocr: res.ocr,
          fileID: res.id,
        });

        setPhotos({ photos: res.photos });
        clearIsStatusLoading();
        clearStatusMessage();
      }

      pollingIntervalCount += 1;

      // Stop polling if background job is not done in 5 mins (30000 seconds).
      if (pollingIntervalCount > 30) {
        clearInterval(pollingInterval);
        clearIsStatusLoading();
        setStatusMessage({
          message: "Timed out. 5 minute time limit reached.",
        });
        pollingIntervalCount = 0;
      }
    });
  };

  /**
   * Handler to delete the uploaded file.
   */
  const handleDeleteFileServer = () => {
    if (typeof fileData.fileID !== "undefined") {
      const searchBody = {
        fileID: fileData.fileID,
      };
      uapi_delete(searchBody);
    }

    clearFileData();

    clearPhotos();
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
  const handleSetSearchWords = (newSearchWord: string | undefined) => {
    if (!fileData.fileID) return;

    const newSearchWordArr = newSearchWord ? newSearchWord.split(" ") : [];

    if (newSearchWordArr.length === 0) {
      setPhotos({ photos: fileData.allPhotos });
    } else {
      const searchBody = {
        ocr: fileData.ocr,
        searchWord: newSearchWordArr,
        id: fileData.fileID,
      };

      uapi_post_search(searchBody)
        .then((res) => {
          setPhotos({ photos: res.photos });
        })
        .catch(async (err) => {
          const err_json = await err.json();
          setStatusMessage({ message: err_json.message });
        });
    }
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
