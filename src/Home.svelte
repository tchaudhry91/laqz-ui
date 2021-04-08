<script>
    import { ajaxFetchCall } from "./utils";
    import { Link } from "svelte-navigator";
    import { getMyQuizzes } from "./api";

    export let user;
    let myQuizzesPromise = getMyQuizzes();
</script>

<div>
    <div class="card card-med">
        <h3 class="card-heading">Create</h3>
        <Link to="/create/quiz"><h4 class="card-item">Quiz</h4></Link>
    </div>

    {#if user}
        <div class="card card-med">
            <h3 class="card-heading">My Quizzes</h3>
            {#await myQuizzesPromise then resp}
                {#each resp.quizzes as qz}
                    <Link to="/quiz/{qz.ID}/"
                        ><h4 class="card-item">{qz.name}</h4></Link
                    >
                {/each}
            {:catch error}
                {error.message}
            {/await}
        </div>
    {/if}
</div>

<style>
</style>
