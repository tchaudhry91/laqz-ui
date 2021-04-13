<script>
    import { navigate } from "svelte-navigator";

    import { getQuiz, deleteQuiz, toggleVisibility, createPS } from "./api";
    import { getTags, getCollaborators } from "./utils";
    export let quizID;
    export let user;

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

    async function handlePlay() {
        // Create a new PlaySession
        const resp = await createPS(quizID);

        // navigate to play page
        navigate("/quiz/" + quizID + "/play/" + resp.play_session.code);
    }

    async function handleToggleVisibility() {
        isPublishLoading = true;
        await toggleVisibility(quizID);
        quizPromise = getQuiz(quizID, user);
        isPublishLoading = false;
    }
</script>

<div class="container margin-top">
    <div class="box">
        {#await quizPromise then resp}
            <div class="block">
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
                        class="button is-info is-small {isPublishLoading ===
                        false
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
                        on:click={handleBuildQuestionsClick}
                        >Add Questions</button
                    >
                    <button
                        class="button is-danger is-small"
                        on:click={handleDeleteQuiz}>Delete</button
                    >
                </div>
                <div class="block is-centered has-text-centered">
                    <button class="button is-link" on:click={handlePlay}>
                        Play!
                    </button>
                </div>
            {/if}
        {:catch error}
            {error.message}
        {/await}
    </div>
</div>

<style>
    .margin-top {
        margin-top: 1.5rem;
    }
    .centerify {
        text-align: center;
        margin-right: auto;
        margin-left: auto;
    }
</style>
