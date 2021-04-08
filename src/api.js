import { ajaxFetchCall } from "./utils";

export function getMyQuizzes() {
  return ajaxFetchCall("/quiz/list/user/", {
    method: "GET",
  });
};

export function getQuiz(id) {
  return ajaxFetchCall("/quiz/" + id + "/", {
    method: "GET",
  });
}

export function deleteQuiz(id) {
  return ajaxFetchCall("/quiz/" + id + "/", {
    method: "DELETE",
  });
}