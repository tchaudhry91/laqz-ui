<script>
    import { navigate } from "svelte-navigator";

    export let quizID;

    let text;
    let answer;
    let showLoading = false;
    let showNext = false;

    async function addQuestion(e) {
        e.preventDefault();
        showLoading = true;
        await new Promise((r) => setTimeout(r, 500));
        showLoading = false;
        showNext = true;
    }

    function backToQuiz(e) {
        e.preventDefault();
        navigate("/quiz/" + quizID);
    }
</script>

<div class="container-column">
    <h2 class="centerify">Add a Question</h2>
    <form class="form-container">
        <div class="form-group">
            <label for="qtext">Question</label>
            <textarea bind:value={text} placeholder="Question Text" />
            <label for="qanswer">Answer</label>
            <input
                bind:value={answer}
                id="qanswer"
                type="text"
                placeholder=""
            />
        </div>
        {#if showLoading}
            <div class="centerify loader" />
        {:else if showNext}
            <div class="centerify">
                <h3 class="centerify">Added!</h3>
                <div>
                    <button
                        type="button"
                        class="btn btn-dark centerify"
                        on:click={backToQuiz}
                    >
                        Back to Quiz
                    </button>
                </div>
            </div>
        {:else}
            <div class="centerify">
                <button
                    class="btn btn-dark centerify"
                    type="submit"
                    on:click={addQuestion}>Add</button
                >
            </div>
        {/if}
    </form>
</div>

<style>
    .centerify {
        text-align: center;
        margin-right: auto;
        margin-left: auto;
    }
</style>
