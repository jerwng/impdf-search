// Utils file for submitting and deleting photo

import {
  uapi_delete,
  uapi_get_results,
  uapi_post_pdf,
  uapi_post_search,
} from "./api";
import {
  APIGetResultsRes,
  APIPostPDFRes,
  FileData,
  PhotoHandleFilterRes,
  PhotoHandleUploadRes,
} from "./types";

export const uphoto_handleUpload = ({
  fileID,
  file,
}: {
  fileID: string | undefined;
  file: File;
}) => {
  const uploadFormData = new FormData();
  uploadFormData.append("file", file);

  return new Promise<PhotoHandleUploadRes>((resolve, reject) => {
    Promise.all([
      // Delete file is conditionally called, only when an existing fileID is provided
      ...(fileID ? [uapi_delete({ fileID })] : []),
      uapi_post_pdf(uploadFormData),
    ])
      .then((results) => {
        // Post PDF result is always at the last index in results array
        const postRes = results.at(-1) as APIPostPDFRes;
        let pollingIntervalCount = 0;

        const pollingInterval = setInterval(() => {
          pollingIntervalCount++;

          if (pollingIntervalCount > 30) {
            reject({ message: "Timed out. 5 minute time limit reached." });
            clearInterval(pollingInterval);
            return;
          }

          uphoto_handleGetResults({ jobID: postRes.jobID })
            .then((res) => {
              if (res.status === "Finished") {
                resolve({
                  allPhotos: res.photos,
                  ocr: res.ocr,
                  fileID: res.id,
                });
                clearInterval(pollingInterval);
              }
            })
            .catch((err) => {
              reject(err);
              clearInterval(pollingInterval);
            });
        }, 10000);
      })
      .catch(async (err) => {
        const err_json = await err.json();
        reject({ message: err_json.message });
      });
  });
};

export const uphoto_handleGetResults = ({ jobID }: { jobID: string }) => {
  return new Promise<APIGetResultsRes>((resolve, reject) => {
    uapi_get_results(jobID)
      .then((res) => {
        resolve(res);
      })
      .catch(async (err) => {
        const err_json = await err.json();
        reject({ message: err_json.message });
      });
  });
};

export const uphoto_handleDelete = ({ fileID }: { fileID: string }) => {
  return new Promise<void>((resolve, reject) => {
    uapi_delete({
      fileID,
    })
      .then(() => {
        resolve();
      })
      .catch(async (err) => {
        const err_json = await err.json();
        reject({ message: err_json.message });
      });
  });
};

export const uphoto_handleFilter = ({
  fileData,
  searchWord,
}: {
  fileData: FileData;
  searchWord: string | undefined;
}) => {
  const searchWordArr = searchWord ? searchWord.split(" ") : [];

  return new Promise<PhotoHandleFilterRes>((resolve, reject) => {
    if (!fileData.fileID) {
      reject({ message: "File ID is undefined" });
      return;
    }

    if (searchWordArr.length === 0) {
      resolve({ photos: fileData.allPhotos });
      return;
    }

    uapi_post_search({
      ocr: fileData.ocr,
      searchWord: searchWordArr,
      id: fileData.fileID,
    })
      .then((res) => {
        resolve({ photos: res.photos });
      })
      .catch(async (err) => {
        const err_json = await err.json();
        reject({ message: err_json.message });
      });
  });
};
