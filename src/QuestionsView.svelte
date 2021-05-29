<script>
    import { navigate } from "svelte-navigator";

    import { getQuestions, deleteQuestion } from "./api";
    export let quizID;
    export let user;
    let questionsPromise = getQuestions(quizID, user);

    async function handleDeleteQuestion(id) {
        await deleteQuestion(quizID, id);
        questionsPromise = getQuestions(quizID, user);
    }
    function handleEditQuestion(id) {
        navigate("/update/quiz/" + quizID + "/question/" + id + "/");
    }
</script>

<div class="box mt-5 centerify">
    {#await questionsPromise then resp}
        <div class="table-container">
            <table class="table centerify is-striped">
                <thead>
                    <tr>
                        <th class="has-text-centered">ID</th>
                        <th>Text</th>
                        <th>Timer Seconds</th>
                        <th>Points</th>
                        <th>Image</th>
                        <th>Answer</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {#each resp.questions as q}
                        <tr>
                            <td>
                                {q.ID}
                            </td>
                            <td>
                                {q.text}
                            </td>
                            <td>
                                {q.timer_seconds}
                            </td>
                            <td>
                                {q.points}
                            </td>
                            <td>
                                {#if q.image_link}
                                    <a href={q.image_link}>IMG</a>
                                {:else}
                                    None
                                {/if}
                            </td>
                            <td>
                                {q.answer}
                            </td>
                            <td>
                                <button
                                    on:click={() => {
                                        handleEditQuestion(q.ID);
                                    }}
                                    class="button is-small is-primary"
                                    >Edit</button
                                >
                            </td>
                            <td>
                                <button
                                    on:click={() => {
                                        handleDeleteQuestion(q.ID);
                                    }}
                                    class="button is-small is-primary"
                                    >Delete</button
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
