import { ajaxFetchCall, ajaxFetchFormCall } from "./utils";

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

export function updateQuestion(id, quizID, text, imageLink, audioLink, answer, points, timerSeconds) {
  return ajaxFetchCall("/quiz/" + quizID + "/editQuestion", {
    method: "PATCH",
    body: JSON.stringify({
      "id": parseInt(id),
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

export function getQuestions(quizID) {
  return ajaxFetchCall("/quiz/" + quizID + "/viewQuestions", {
    method: "GET",
  }, true);
}

export function deleteQuestion(quizID, questionID) {
  return ajaxFetchCall("/quiz/" + quizID + "/deleteQuestion/" + questionID + "/", {
    method: "DELETE",
  }, true);
}

export function getQuestion(quizID, questionID) {
  return ajaxFetchCall("/quiz/" + quizID + "/question/" + questionID + "/", {
    method: "GET",
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

export function joinPS(code) {
  return ajaxFetchCall("/ps/join/" + code, {
    method: "POST",
    body: JSON.stringify({})
  }, true);
}

export function addTeam(code, teamName) {
  return ajaxFetchCall("/ps/" + code + "/addTeam", {
    method: "POST",
    body: JSON.stringify({
      "team_name": teamName
    })
  }, true);
}

export function addPlayerToTeam(code, teamName, email) {
  return ajaxFetchCall("/ps/" + code + "/assignTeamToUser",
    {
      method: "POST",
      body: JSON.stringify({
        "team_name": teamName,
        "email": email,
      })
    }, true);
}

export function startPS(code) {
  return ajaxFetchCall("/ps/" + code + "/start",
    {
      method: "POST"
    }, true);
}


export function endPS(code) {
  return ajaxFetchCall("/ps/" + code + "/end",
    {
      method: "POST"
    }, true);
}

export function nextQuestion(code) {
  return ajaxFetchCall("/ps/" + code + "/next",
    {
      method: "POST"
    }, true);
}

export function prevQuestion(code) {
  return ajaxFetchCall("/ps/" + code + "/prev",
    {
      method: "POST"
    }, true);
}

export function revealAnswer(code) {
  return ajaxFetchCall("/ps/" + code + "/reveal",
    {
      method: "POST"
    }, true);
}

export function addPointsToTeam(code, points, team) {
  return ajaxFetchCall("/ps/" + code + "/addPoints",
    {
      method: "POST",
      body: JSON.stringify({
        "team_name": team,
        "points": parseInt(points)
      })
    }, true);
}

export function uploadAsset(formData) {
  return ajaxFetchFormCall("/quiz/upload",
    {
      method: "POST",
      body: formData
    }, true);
}