<script>
    import { navigate } from "svelte-navigator";

    import { getQuiz, deleteQuiz, toggleVisibility } from "./api";
    import { getTags, getCollaborators } from "./utils";
    export let quizID;
    export let user;

    let quizPromise = getQuiz(quizID);

    let isPublishLoading = false;

    async function handleDeleteQuiz() {
        await deleteQuiz(quizID);
        navigate("/");
    }

    function checkCollaborator(collaborators) {
        let found = false;
        collaborators.forEach((c, id, arr) => {
            if (c.email === user.email) {
                found = true;
            }
        });
        return found;
    }

    function handleBuildQuestionsClick() {
        navigate("/create/quiz/" + quizID + "/question");
    }

    async function handleToggleVisibility() {
        isPublishLoading = true;
        await toggleVisibility(quizID);
        quizPromise = getQuiz(quizID);
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
            </div>
            {#if checkCollaborator(resp.quiz.collaborators)}
                <div class="block is-centered has-text-centered">
                    <button
                        class="button is-info {isPublishLoading === false
                            ? ''
                            : 'is-loading'}"
                        on:click={handleToggleVisibility}
                    >
                        {resp.quiz.private === true
                            ? "Publish"
                            : "Unpublish"}</button
                    >
                    <button
                        class="button is-primary"
                        on:click={handleBuildQuestionsClick}
                        >Add Questions</button
                    >
                    <button class="button is-danger" on:click={handleDeleteQuiz}
                        >Delete</button
                    >
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
