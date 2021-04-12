<script>
    import { ajaxFetchCall } from "./utils";
    import { Link } from "svelte-navigator";
    import { getMyQuizzes, getPublicQuizzes } from "./api";
    import QuizView from "./QuizView.svelte";
    import { getTags, getCollaborators } from "./utils";

    export let user;

    let showPublicQuizzes = true;
    let showPrivateQuizzes = false;

    let myQuizzesPromise = getMyQuizzes();
    let publicQuizzesPromise = getPublicQuizzes();

    function setPublic(e) {
        e.preventDefault();
        showPrivateQuizzes = false;
        showPublicQuizzes = true;
    }

    function setPrivate(e) {
        e.preventDefault();
        showPublicQuizzes = false;
        showPrivateQuizzes = true;
    }
</script>

<div class="home-base container">
    <div class="tabs">
        <ul>
            <li class={showPublicQuizzes === true ? "is-active" : ""}>
                <a href={"#"} on:click={setPublic}>Public Quizzes</a>
            </li>
            <li class={showPrivateQuizzes === true ? "is-active" : ""}>
                <a href={"#"} on:click={setPrivate}>My Quizzes</a>
            </li>
        </ul>
    </div>
    <!-- Public Quizzes-->
    {#if showPublicQuizzes}
        <div class="container-flex is-centered">
            {#await publicQuizzesPromise then resp}
                {#each resp.quizzes as qz}
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
                {/each}
            {:catch error}
                {error.message}
            {/await}
        </div>
    {/if}

    <!-- My Quizzes-->
    {#if showPrivateQuizzes}
        {#if user}
            <div class="container-flex is-centered">
                {#await myQuizzesPromise then resp}
                    {#each resp.quizzes as qz}
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
                    {/each}
                {:catch error}
                    {error.message}
                {/await}
            </div>
        {:else}
            <h1 class="subtitle centerify block">
                Please Login to see your quizzes
            </h1>
        {/if}
    {/if}
</div>

<style>
    .home-card {
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-right: 1rem;
        margin-left: 1rem;
        width: 250px;
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

    .container-flex {
        display: flex;
        flex-wrap: wrap;
    }
</style>
