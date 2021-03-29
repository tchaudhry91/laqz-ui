import { auth } from "./firebase";
import { LAQZBackendURL } from "./config";
export async function ajaxFetchCall(url, reqObj) {
  url = LAQZBackendURL + url
  let token = "";
  token = await auth.currentUser.getIdToken();
  const defaultObj = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: token,
    },
  };

  const ajaxObj = { ...defaultObj, ...reqObj };
  return fetch(url, ajaxObj)
    .then(async (response) => {
      if (response.ok) {
        if (response.status === 204) {
          return Promise.resolve(null);
        }
        let r = await response.text();
        try {
          let j = JSON.parse(r);
          // localStorage[url] = JSON.stringify(j);
          return Promise.resolve(j);
        } catch (err) {
          return Promise.resolve(r);
        }
      } else {
        return Promise.reject(response);
      }
    })
    .then((json) => {
      if (json && json.error) {
        console.error("Error:", json.error, "URL:", url, "request object:", JSON.stringify(ajaxObj));
        return Promise.reject(json.error);
      } else return Promise.resolve(json);
    })
    .catch((err) => Promise.reject(err));
}