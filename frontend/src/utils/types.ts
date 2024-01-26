export type Ocr = {
  height: number[];
  left: number[];
  top: number[];
  width: number[];
  words: string[];
};

export type APIGetResultsRes = {
  id: string;
  ocr: Record<number, Ocr>;
  photos: string[];
  status: string;
};

export type APIPostPDFRes = {
  fileId: string;
  jobId: string;
};

export type APIPostSearchRes = {
  photos: string[];
};

export type APIDeleteRes = {
  status: string;
  fileId: string;
};
