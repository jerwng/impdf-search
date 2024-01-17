// TODO: Change API URL in production

const url = "https://impdf-search-035cd26011cd.herokuapp.com";

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

export function uapi_get_results(jobID) {
  return new Promise((resolve, reject) => {
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

export function uapi_post_pdf(pdf) {
  return new Promise(function (resolve, reject) {
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

export function uapi_post_search(searchBody) {
  return new Promise(function (resolve, reject) {
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

export function uapi_delete(searchBody) {
  return new Promise(function (resolve, reject) {
    fetch(`${url}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchBody),
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
