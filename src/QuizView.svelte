<script>
    import { navigate } from "svelte-navigator";

    import { getQuiz, deleteQuiz, toggleVisibility, createPS } from "./api";
    import { getTags, getCollaborators } from "./utils";
    export let quizID;
    export let user;
    let code;

    let quizPromise = getQuiz(quizID, user);

    let isPublishLoading = false;

    async function handleDeleteQuiz() {
        await deleteQuiz(quizID);
        navigate("/");
    }

    function checkCollaborator(u, collaborators) {
        if (u === null || u === undefined) {
            u = { email: "" };
        }
        let found = false;
        collaborators.forEach((c, id, arr) => {
            if (c.email === u.email) {
                found = true;
            }
        });
        return found;
    }

    function handleBuildQuestionsClick() {
        navigate("/create/quiz/" + quizID + "/question");
    }

    function handleViewQuestionsClick() {
        navigate("/quiz/" + quizID + "/view");
    }

    async function handlePlay() {
        // Create a new PlaySession
        const resp = await createPS(quizID);

        // navigate to play page
        navigate("/quiz/" + quizID + "/play/" + resp.play_session.code);
    }

    async function handleJoin() {
        // navigate to play page
        navigate("/quiz/" + quizID + "/play/" + code);
    }

    async function handleToggleVisibility() {
        isPublishLoading = true;
        await toggleVisibility(quizID);
        quizPromise = getQuiz(quizID, user);
        isPublishLoading = false;
    }
</script>

<div class="box mt-5 centerify">
    {#await quizPromise then resp}
        <div class="block has-text-centered">
            <h1 class="title centerify">{resp.quiz.name}</h1>
            <h4 class="is-size-6 centerify">
                By: {getCollaborators(resp.quiz.collaborators)}
            </h4>
            <h4 class="is-size-6 centerify">
                Tags: {getTags(resp.quiz.tags)}
            </h4>
            <h4 class="is-size-6 centerify">
                Questions: {resp.quiz.questions.length}
            </h4>
        </div>
        {#if checkCollaborator(user, resp.quiz.collaborators)}
            <div class="block is-centered has-text-centered">
                <button
                    class="button is-info is-small {isPublishLoading === false
                        ? ''
                        : 'is-loading'}"
                    on:click={handleToggleVisibility}
                >
                    {resp.quiz.private === true
                        ? "Publish"
                        : "Unpublish"}</button
                >
                <button
                    class="button is-primary is-small"
                    on:click={handleBuildQuestionsClick}>Add Questions</button
                >
                <button
                    class="button is-primary is-small"
                    on:click={handleViewQuestionsClick}>View/Edit</button
                >
                <button
                    class="button is-danger is-small"
                    on:click={handleDeleteQuiz}>Delete</button
                >
            </div>
        {/if}
        <div class="block is-centered has-text-centered">
            <button class="button is-primary" on:click={handlePlay}>
                Start
            </button>
        </div>
        <div class="block is-centered has-text-centered">
            <div class="field">
                <label for="codeInp" class="label"
                    >Join an existing session with Code</label
                >
                <div id="codeInp" class="control">
                    <input
                        bind:value={code}
                        style="max-width: 6rem"
                        class="input"
                        type="number"
                        min="10000"
                        max="99999"
                        placeholder="12345"
                    />
                    <button class="button is-link" on:click={handleJoin}
                        >Join</button
                    >
                </div>
            </div>
        </div>
    {:catch error}
        {error.message}
    {/await}
</div>

<style>
    .centerify {
        margin-right: auto;
        margin-left: auto;
    }
</style>
