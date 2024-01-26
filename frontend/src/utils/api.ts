import {
  Ocr,
  APIPostPDFRes,
  APIGetResultsRes,
  APIPostSearchRes,
  APIDeleteRes,
} from "./types";

const url = process.env.REACT_APP_API_URL;

export function uapi_test() {
  return new Promise(function (resolve, reject) {
    fetch(`${url}/test/`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          resolve(res);
        } else {
          throw res;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function uapi_get_results(jobID: string) {
  return new Promise<APIGetResultsRes>((resolve, reject) => {
    fetch(`${url}/results/${jobID}/`, {
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          throw res;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function uapi_post_pdf(pdf: FormData) {
  return new Promise<APIPostPDFRes>(function (resolve, reject) {
    fetch(`${url}/pdf/`, {
      method: "POST",
      body: pdf,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((res_json) => {
        resolve(res_json);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function uapi_post_search(searchBody: {
  ocr: Ocr;
  searchWord: string[];
  id: string;
}) {
  return new Promise<APIPostSearchRes>(function (resolve, reject) {
    fetch(`${url}/search/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchBody),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((res_json) => {
        resolve(res_json);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function uapi_delete(searchBody: { fileID: string }) {
  return new Promise<APIDeleteRes>(function (resolve, reject) {
    fetch(`${url}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchBody),
    })
      .then((res) => {
        if (res.ok) {
          resolve(res.json());
        } else {
          throw res;
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
