<script>
    import { getPS, getQuiz } from "./api";

    export let user;
    export let quizID;
    export let code;
    let quizPromise = getQuiz(quizID, user);
    let psPromise = getPS(code);
    let quiz;
    let ps;
</script>

<div class="box mt-5">
    {#await quizPromise then resp}
        <div class="is-hidden">{(quiz = resp.quiz)}</div>
        <div class="block">
            <h1 class="title has-text-centered">Quiz: {quiz.name}</h1>
        </div>
    {/await}
    {#await psPromise then psResp}
        <div class="is-hidden">{(ps = psResp.play_session)}</div>
        <h1 class="is-size-7 has-text-centered">
            <strong>Quiz Master : </strong>
            {ps.quiz_master}
        </h1>
    {/await}
</div>
