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

export function getQuiz(id, user) {
  let sendToken = false
  if (user) { sendToken = "true" };
  return ajaxFetchCall("/quiz/" + id + "/", {
    method: "GET",
  }, sendToken);
}

export function deleteQuiz(id) {
  return ajaxFetchCall("/quiz/" + id + "/", {
    method: "DELETE",
  }, true);
}

export function addQuestion(quizID, text, imageLink, audioLink, answer, points, timerSeconds) {
  return ajaxFetchCall("/quiz/" + quizID + "/addQuestion", {
    method: "POST",
    body: JSON.stringify({
      "quiz_id": parseInt(quizID),
      "text": text,
      "image_link": imageLink,
      "audio_link": audioLink,
      "answer": answer,
      "points": parseInt(points),
      "timer_seconds": parseInt(timerSeconds),
    })
  }, true);
}

export function toggleVisibility(quizID) {
  return ajaxFetchCall("/quiz/" + quizID + "/toggleVisibility", {
    method: "PATCH",
    body: JSON.stringify({
      "quiz_id": parseInt(quizID)
    })
  }, true);
}

export function getPS(code) {
  return ajaxFetchCall("/ps/" + code + "/", {
    method: "GET"
  }, true);
}

export function createPS(quizID) {
  return ajaxFetchCall("/ps/create", {
    method: "POST",
    body: JSON.stringify({
      "quiz_id": parseInt(quizID)
    })
  }, true);
}