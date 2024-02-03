export type Ocr = {
  height: number[];
  left: number[];
  top: number[];
  width: number[];
  words: string[];
};

export type APIGetResultsRes = {
  id: string;
  ocr: Ocr;
  photos: string[];
  status: string;
};

export type APIPostPDFRes = {
  fileID: string;
  jobID: string;
};

export type APIPostSearchRes = {
  photos: string[];
};

export type APIDeleteRes = {
  status: string;
  fileID: string;
};

export type PhotoHandleFilterRes = {
  photos: string[];
};

export type PhotoHandleUploadRes = {
  allPhotos: string[];
  ocr: Ocr;
  fileID: string;
};

export interface FileData {
  allPhotos: string[];
  ocr: Ocr;
  fileID: string | undefined;
}
