<script>
    import { onDestroy, afterUpdate } from "svelte";

    import {
        addPlayerToTeam,
        addPointsToTeam,
        addTeam,
        getPS,
        getQuiz,
        joinPS,
        nextQuestion,
        prevQuestion,
        revealAnswer,
        startPS,
        endPS,
    } from "./api";
    import { LAQZWSURL } from "./config";
    import {
        getCollaborators,
        isPlayer,
        isQuizMaster,
        hasUserJoinedTeam,
    } from "./utils";

    export let user;
    export let quizID;
    export let code;
    let quizPromise = getQuiz(quizID, user);
    let psPromise = getPS(code);
    let quiz;
    let ps;
    let teamName;

    let showAddTeamModal = false;

    let ws = new WebSocket(LAQZWSURL + "/ps/ws/" + code);
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

    function handleShowAddTeamModal() {
        showAddTeamModal = true;
    }
    function cancelAddTeamModal() {
        showAddTeamModal = false;
    }

    async function handleAddTeam(e) {
        e.preventDefault();
        try {
            await addTeam(code, teamName);
        } finally {
            showAddTeamModal = false;
        }
    }

    async function handleStart() {
        await startPS(code);
    }

    async function handleEnd() {
        await endPS(code);
        hideTimer();
    }

    async function handleJoin(e) {
        e.preventDefault();
        await joinPS(code);
    }

    async function handleNext() {
        clearInterval(timerInterval);
        timerInterval = null;
        await nextQuestion(code);
    }

    async function handlePrev() {
        clearInterval(timerInterval);
        timerInterval = null;
        await prevQuestion(code);
    }

    async function handleJoinTeam(teamName) {
        await addPlayerToTeam(code, teamName, user.email);
    }

    async function reveal() {
        clearInterval(timerInterval);
        await revealAnswer(code);
    }

    let showTimer = false;
    let timerPercent = 0;
    let secondsElapsed = 0;
    let timerInterval;

    function showTimerIfNotVisible(node, state) {
        if (state == "FINISHED") {
            return;
        }
        showTimer = true;
    }

    function hideTimer() {
        showTimer = false;
    }

    function updateTimer(total_seconds) {
        timerPercent = Math.ceil(
            ((secondsElapsed * 1.0) / total_seconds) * 100
        );
        if (timerPercent >= 100) {
            timerPercent = 100;
            clearInterval(timerInterval);
        }
        secondsElapsed += 1;
    }

    function handleAddPoints(teamName, points) {
        addPointsToTeam(code, points, teamName);
    }

    afterUpdate(async () => {
        psPromise.then((resp) => {
            if (timerInterval) {
                return;
            }
            if (resp.play_session.current_question) {
                secondsElapsed = 0;
                timerInterval = setInterval(function () {
                    updateTimer(
                        resp.play_session.current_question.timer_seconds
                    );
                }, 1000);
            }
        });
    });

    onDestroy(() => {
        clearInterval(timerInterval);
    });
</script>

<div class="box mt-5 centerify">
    {#await quizPromise then resp}
        <div class="is-hidden">{(quiz = resp.quiz)}</div>
        <div class="block">
            <h1 class="title has-text-centered">Quiz: {quiz.name}</h1>
        </div>
        <div class="block">
            <h1 class="subtitle has-text-centered">Join Code: {code}</h1>
        </div>
    {/await}
    <progress
        class="progress {timerPercent == 100
            ? 'is-danger'
            : 'is-info'} {showTimer ? '' : 'is-hidden'}"
        value={timerPercent}
        max="100">{timerPercent}%</progress
    >
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
        {#if ps && ps.current_question}
            <div
                class="box has-background-light mt-5 mb-5 has-text-centered centerify"
            >
                <h1 use:showTimerIfNotVisible={ps.state} class="subtitle">
                    Q{ps.current_question_index + 1}: {ps.current_question.text}
                    <span class="tag is-primary is-light"
                        >{ps.current_question.points} points</span
                    >
                </h1>
                {#if ps.current_answer}
                    <h1 class="is-size-6">
                        Answer: {ps.current_answer}
                    </h1>
                {:else if isQuizMaster(user.email, ps)}
                    <div class="block">
                        <button
                            on:click={reveal}
                            class="button is-dark is-small"
                            >Reveal Answer</button
                        >
                    </div>
                {/if}
            </div>
        {/if}
        {#if !isPlayer(user.email, ps.users) && ps.state == "INITIALIZED"}
            <div class="block has-text-centered mt-6">
                <button class="button is-primary is-small" on:click={handleJoin}
                    >Join</button
                >
            </div>
        {:else}
            <div class="block mt-6" />
        {/if}

        {#if isQuizMaster(user.email, ps) && ps.state == "INITIALIZED"}
            <div class="block has-text-centered">
                <button
                    class="button is-dark is-small"
                    on:click={handleShowAddTeamModal}>Add Team</button
                >
                <button class="button is-dark is-small" on:click={handleStart}
                    >Start</button
                >
            </div>
            <div class="modal {showAddTeamModal === true ? 'is-active' : ''}">
                <div class="modal-background" />
                <div class="modal-content">
                    <div class="field">
                        <h1 class="subtitle has-text-light">Enter Team Name</h1>
                        <input
                            bind:value={teamName}
                            class="input"
                            type="text"
                            placeholder="Langoors"
                        />
                    </div>
                    <div class="block">
                        <button
                            on:click={handleAddTeam}
                            class=" button is-centered has-text-centered is-primary is-light"
                            >Add</button
                        >
                        <button
                            on:click={cancelAddTeamModal}
                            class=" button is-centered has-text-centered is-danger is-light"
                            >Cancel</button
                        >
                    </div>
                </div>
            </div>
        {:else if isQuizMaster(user.email, ps) && (ps.state == "INPROGRESS" || ps.state == "FINISHED")}
            <div class="block has-text-centered">
                <button on:click={handlePrev} class="button is-dark is-small"
                    >Prev</button
                >
                <button on:click={handleNext} class="button is-dark is-small"
                    >Next</button
                >
            </div>
        {/if}
        {#if isQuizMaster(user.email, ps) && ps.state != "FINISHED"}
            <div class="block has-text-centered">
                <button on:click={handleEnd} class="button is-danger is-small"
                    >End Session</button
                >
            </div>
        {/if}
        {#if ps.state == "FINISHED"}
            <div class="block has-text-centered">
                <h1 class="subtitle">Session has ended</h1>
            </div>
        {:else}
            <div class="block has-text-centered">
                <h1 class="subtitle">Session is Live</h1>
            </div>
        {/if}

        <div class="block">
            <div class="container table-wrapper">
                <table class="table centerify is-striped">
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th class="has-text-centered" style="width:10rem"
                                >Players</th
                            >
                            <th>Points</th>
                            <th>Join</th>
                            {#if isQuizMaster(user.email, ps)}
                                <th>Award</th>
                            {/if}
                        </tr>
                    </thead>
                    <tbody>
                        {#each ps.teams as team}
                            <tr>
                                <td>
                                    {team.name}
                                </td>
                                <td class="has-text-centered">
                                    {#each team.users as u}
                                        <span>
                                            <figure
                                                style="display:inline-block"
                                                class="image is-32x32"
                                            >
                                                <img
                                                    class="is-rounded"
                                                    alt={u.name}
                                                    src={u.avatar_url}
                                                />
                                            </figure>
                                        </span>
                                    {/each}
                                </td>
                                <td class="has-text-centered">
                                    {team.points}
                                </td>
                                <td>
                                    <button
                                        on:click={() => {
                                            handleJoinTeam(team.name);
                                        }}
                                        class="button is-small is-primary"
                                        disabled={hasUserJoinedTeam(
                                            user.email,
                                            ps
                                        )}>Join</button
                                    >
                                </td>
                                {#if isQuizMaster(user.email, ps) && ps.state == "INPROGRESS"}
                                    <td
                                        ><button
                                            class="button is-small is-primary"
                                            on:click={() => {
                                                handleAddPoints(
                                                    team.name,
                                                    psResp.play_session
                                                        .current_question.points
                                                );
                                            }}
                                            >{ps.current_question.points} points</button
                                        ></td
                                    >
                                {/if}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/await}
</div>

<style>
    .centerify {
        margin-right: auto;
        margin-left: auto;
    }
    .table-wrapper {
        overflow-x: auto;
    }
</style>
