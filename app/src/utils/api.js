// TODO: Change API URL in production

export function uapi_test() {
  return new Promise(function (resolve, reject) {
    fetch("https://impdf-searcher.herokuapp.com/test/", {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        resolve(res);
      } else {
        throw res;
      }
    }).catch((err) => {
      reject(err)
    })
  })
}

export function uapi_get_results(jobID) {
  return new Promise((resolve, reject) => {
    fetch(`https://impdf-searcher.herokuapp.com/results/${jobID}/`, {
      method: "GET"
    }).then((res) => {
      if (res.ok) {
        resolve(res.json())
      } else {
        throw res;
      }

    }).catch((err) => {
      reject(err)
    })
  })
}

export function uapi_post_pdf(pdf) {
  return new Promise(function (resolve, reject) {
    fetch("https://impdf-searcher.herokuapp.com/pdf/", {
      method: "POST",
      body: pdf
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw res
      }
    }).then((res_json) => {
      resolve(res_json)
    }).catch((err) => {
      reject(err);
    })
    
  });
}

export function uapi_post_search(searchBody) {
  return new Promise(function (resolve, reject) {
    fetch("https://impdf-searcher.herokuapp.com/search/", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw res
      }
    }).then((res_json) => {
      resolve(res_json)
    }).catch((err) => {
      reject(err)
    })
  })
}

export function uapi_delete_disconnect(searchBody) {
  return new Promise(function (resolve, reject){
    fetch("https://impdf-searcher.herokuapp.com/disconnect/", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchBody)
    }).then((res) => {
      if (res.ok) {
        resolve(res);
      } else {
        throw res;
      }
    }).catch((err) => {
      reject(err)
    })
  })
}