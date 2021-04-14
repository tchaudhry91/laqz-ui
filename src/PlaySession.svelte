<script>
    import { addPlayerToTeam, addTeam, getPS, getQuiz, joinPS } from "./api";
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

    async function handleJoin(e) {
        e.preventDefault();
        await joinPS(code);
    }

    async function handleJoinTeam(teamName) {
        await addPlayerToTeam(code, teamName, user.email);
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
            <div class="block has-text-centered mt-6">
                <button class="button is-primary" on:click={handleJoin}
                    >Join</button
                >
            </div>
        {:else}
            <div class="block mt-6" />
        {/if}

        {#if isQuizMaster(user.email, ps) && ps.state == "INITIALIZED"}
            <div class="block has-text-centered">
                <button class="button is-link" on:click={handleShowAddTeamModal}
                    >Add Team</button
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
        {/if}

        <div class="block">
            <table class="table centerify is-striped">
                <thead>
                    <tr>
                        <th>Team</th>
                        <th class="has-text-centered" style="width:10rem"
                            >Players</th
                        >
                        <th>Points</th>
                        <th>Join</th>
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
                                    disabled={hasUserJoinedTeam(user.email, ps)}
                                    >Join</button
                                >
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/await}
</div>

<style>
    .centerify {
        margin-right: auto;
        margin-left: auto;
    }
</style>
