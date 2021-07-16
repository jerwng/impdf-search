export function uapi_test() {
  console.log("hello world 123");
}

export function uapi_post_pdf(pdf) {
  return new Promise(function (resolve, reject) {
    fetch("http://localhost:5000/pdf/", {
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