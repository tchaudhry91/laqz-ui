import { ajaxFetchCall } from "./utils";

export function getMyQuizzes() {
  return ajaxFetchCall("/quiz/list/user/", {
    method: "GET",
  }, true);
};

export function getPublicQuizzes() {
  return ajaxFetchCall("/quiz/list", {
    method: "GET",
  }, false);
};

export function getQuiz(id) {
  return ajaxFetchCall("/quiz/" + id + "/", {
    method: "GET",
  }, true);
}

export function deleteQuiz(id) {
  return ajaxFetchCall("/quiz/" + id + "/", {
    method: "DELETE",
  }, true);
}