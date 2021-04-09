<script>
    import { navigate } from "svelte-navigator";

    import { getQuiz, deleteQuiz } from "./api";
    import { getTags, getCollaborators } from "./utils";
    export let quizID;
    export let user;

    const quizPromise = getQuiz(quizID);

    async function handleDeleteQuiz() {
        let resp = await deleteQuiz(quizID);
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
</script>

<div class="container-column">
    {#await quizPromise then resp}
        <h1 class="centerify">{resp.quiz.name}</h1>
        <h4 class="centerify">
            By: {getCollaborators(resp.quiz.collaborators)}
        </h4>
        <h4 class="centerify">Tags: {getTags(resp.quiz.tags)}</h4>
        {#if checkCollaborator(resp.quiz.collaborators)}
            <button
                class="btn btn-danger btn-small centerify"
                on:click={handleDeleteQuiz}>Delete</button
            >
            <button
                class="btn btn-dark centerify"
                on:click={handleBuildQuestionsClick}>Add Questions</button
            >
        {/if}
    {:catch error}
        {error.message}
    {/await}
</div>

<style>
    .centerify {
        text-align: center;
        margin-right: auto;
        margin-left: auto;
    }
</style>
