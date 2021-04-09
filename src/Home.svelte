<script>
    import { ajaxFetchCall } from "./utils";
    import { Link } from "svelte-navigator";
    import { getMyQuizzes } from "./api";
    import QuizView from "./QuizView.svelte";
    import { getTags, getCollaborators } from "./utils";

    export let user;
    let myQuizzesPromise = getMyQuizzes();
</script>

<div class="home-base container">
    {#if user}
        <h1 class="subtitle centerify block">My Quizzes</h1>
        <div class="columns is-mobile is-centered is-vcentered">
            {#await myQuizzesPromise then resp}
                {#each resp.quizzes as qz}
                    <div class="column is-narrow">
                        <div class="card home-card">
                            <div class="card-header card-header-dark">
                                <p
                                    class="card-header-title has-text-white has-background-dark"
                                >
                                    {qz.name}
                                </p>
                            </div>
                            <div class="card-content fixed-content-size">
                                <p class="is-size-6">
                                    <b>Tags: </b>{getTags(qz.tags)}
                                </p>
                                <p class="is-size-7">
                                    <b>By: </b>
                                    {getCollaborators(qz.collaborators)}
                                </p>
                            </div>
                            <footer class="card-footer">
                                <div class="card-footer-item">
                                    <Link to="/quiz/{qz.ID}/">View</Link>
                                </div>
                            </footer>
                        </div>
                    </div>
                {/each}
            {:catch error}
                {error.message}
            {/await}
        </div>
    {/if}

    <h1 class="subtitle centerify block">Public Quizzes</h1>
</div>

<style>
    .home-card {
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-right: 1rem;
        margin-left: 1rem;
        max-width: 200px;
    }

    .fixed-content-size {
        height: 200px;
    }

    .centerify {
        text-align: center;
        margin: auto;
    }

    .home-base {
        margin-top: 1rem;
    }
</style>
