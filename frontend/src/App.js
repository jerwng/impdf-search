import React, { useState } from "react";
import "./css/App.css";

import { TopNavbar } from "components/TopNavbar";
import { Inputs } from "components/inputs/Inputs";
import { Images } from "components/images/Images";
import { ImageModal } from "components/images/ImageModal";
import { Status } from "components/status/Status";
import { StatusSpinner } from "components/status/StatusSpinner";
import { StatusMessage } from "components/status/StatusMessage";

import {
  uapi_post_pdf,
  uapi_post_search,
  uapi_get_results,
  uapi_delete,
} from "utils/api";

/**
 * Main parent component for the web app. Parent component for the Navbar, Input and Image sub-components.
 *
 * @returns {<div>} The main parent component for the web app.
 */
function App() {
  const [fileData, setFileData] = useState({
    // allPhoto: photo for each page of the PDF
    allPhotos: [],
    ocr: {},
    fileID: undefined,
  });

  // displayedPhotos: photos filtered by the search bar.
  const [displayedPhotos, setDisplayedPhotos] = useState([]);
  const [selectedPhotoID, setselectedPhotoID] = useState(undefined);
  const [spinnerShow, setSpinnerShow] = useState(false);
  const [statusMessage, setStatusMessage] = useState(undefined);

  let pollingIntervalCount = 0;
  let pollingInterval;

  /**
   * Handler for the Inputs sub-component.
   * Submit the file to server to start performing OCR.
   *
   * @param {File} file The uploaded file selected by the user.
   */
  const handleUpload = (file) => {
    const file_form_data = new FormData();
    file_form_data.append("file", file);

    setSpinnerShow(true);

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
   *
   * @param {String} jobID The jobID for the OCR background job.
   */
  const pollingTimer = (jobID) => {
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

        setDisplayedPhotos(res.photos);
        setSpinnerShow(false);
        setStatusMessage(undefined);
      }

      pollingIntervalCount += 1;

      // Stop polling if background job is not done in 5 mins.
      if (pollingIntervalCount > 30) {
        clearInterval(pollingInterval);
        setSpinnerShow(false);
        setStatusMessage("Timeout");
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

    setFileData({
      allPhotos: [],
      ocr: {},
      fileID: undefined,
    });

    setDisplayedPhotos([]);
  };

  /**
   * Handler to enlarge the clicked photo into a modal.
   * @param {Number} id The id for the clicked photo.
   */
  const handleClickThumbnail = (id) => {
    setselectedPhotoID(id);
  };

  /**
   * Handler to filter the list of photos to the ones containing the inputted search word.
   *
   * @param {String} newSearchWord
   */
  const handleSetSearchWords = (newSearchWord) => {
    const newSearchWordArr =
      typeof newSearchWord !== "undefined" ? newSearchWord.split(" ") : [];

    if (newSearchWordArr.length === 0) {
      setDisplayedPhotos(fileData.allPhotos);
    } else {
      const searchBody = {
        ocr: fileData.ocr,
        searchWord: newSearchWordArr,
        id: fileData.fileID,
      };

      uapi_post_search(searchBody)
        .then((res) => {
          setDisplayedPhotos(res.photos);
        })
        .catch(async (err) => {
          const err_json = await err.json();
          setStatusMessage(err_json.message);
        });
    }
  };

  const handleImageModalClose = () => {
    handleClickThumbnail(undefined);
  };

  return (
    <div className="App">
      <TopNavbar />
      <Inputs
        onFileSubmit={handleUpload}
        onSearchWords={handleSetSearchWords}
        onFileDelete={handleDeleteFileServer}
        isLoading={spinnerShow}
        isSearchDisabled={fileData.allPhotos.length === 0}
      />
      <Images photos={displayedPhotos} onClick={handleClickThumbnail} />
      <ImageModal
        selectedPhotoURL={
          selectedPhotoID !== undefined
            ? displayedPhotos[selectedPhotoID]
            : undefined
        }
        onModalClose={handleImageModalClose}
      />
      <Status
        status={
          spinnerShow
            ? StatusSpinner()
            : statusMessage
            ? StatusMessage()
            : undefined
        }
      />
    </div>
  );
}

export default App;
