<script>
    import { navigate } from "svelte-navigator";

    import { getQuiz, deleteQuiz } from "./api";
    export let quizID;
    export let user;

    const quizPromise = getQuiz(quizID);

    function getTags(tt) {
        let tags = [];
        tt.forEach((t, id, arr) => {
            tags.push(t.name);
        });
        return tags.join(", ");
    }

    function getCollaborators(cc) {
        let collaborators = [];
        cc.forEach((c, id, arr) => {
            collaborators.push(c.name);
        });
        return collaborators.join(", ");
    }

    async function handleDeleteQuiz() {
        let resp = await deleteQuiz(quizID);
        console.log(resp);
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
        {/if}
    {:catch error}
        {error.message}
    {/await}
</div>

<style>
    .centerify {
        text-align: center;
        margin: auto;
    }
</style>
