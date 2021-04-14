<script>
    import { getPS, getQuiz, joinPS } from "./api";
    import { getCollaborators, isPlayer } from "./utils";

    export let user;
    export let quizID;
    export let code;
    let quizPromise = getQuiz(quizID, user);
    let psPromise = getPS(code);
    let quiz;
    let ps;

    let ws = new WebSocket("ws://localhost:8080/ps/ws/" + code);
    ws.onopen = function (e) {
        console.log(code + ":Connection established");
    };

    ws.onmessage = function (event) {
        psPromise = getPS(code);
    };

    ws.onclose = function (event) {
        if (event.wasClean) {
            console.log(
                `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log("[close] Connection died");
        }
    };

    ws.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };

    async function handleJoin(e) {
        e.preventDefault();
        await joinPS(code);
    }
</script>

<div class="box mt-5">
    {#await quizPromise then resp}
        <div class="is-hidden">{(quiz = resp.quiz)}</div>
        <div class="block">
            <h1 class="title has-text-centered">Quiz: {quiz.name}</h1>
        </div>
        <div class="block">
            <h1 class="subtitle has-text-centered">Join Code: {code}</h1>
        </div>
    {/await}
    {#await psPromise then psResp}
        <div class="is-hidden">{(ps = psResp.play_session)}</div>
        <h1 class="is-size-7 has-text-centered">
            <strong>Quiz Master : </strong>
            {ps.quiz_master}
        </h1>
        <h1 class="is-size-7 has-text-centered">
            <strong>Players : </strong>
            {getCollaborators(ps.users)}
        </h1>

        {#if !isPlayer(user.email, ps.users)}
            <div class="block">
                <button class="is-primary is-large" on:click={handleJoin}
                    >Join</button
                >
            </div>
        {/if}
    {/await}
</div>
