// Utils file for submitting and deleting photo

import { uapi_delete, uapi_post_search } from "./api";
import { FileData, PhotoHandleFilterRes } from "./types";

export const uphoto_handleDelete = ({ fileID }: { fileID: string }) => {
  uapi_delete({
    fileID,
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
