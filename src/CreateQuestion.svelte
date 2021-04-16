<script>
    import { navigate } from "svelte-navigator";
    import { addQuestion } from "./api";

    export let quizID;

    let text;
    let answer;
    let points = 10;
    let timer = 30;
    let showLoading = false;
    let showNext = false;
    let messageText = "";

    async function addQuestionHandler(e) {
        e.preventDefault();
        showLoading = true;
        await addQuestion(quizID, text, "", "", answer, points, timer);
        showLoading = false;
        showNext = true;
        messageText = "Question Added Succesfully!";
    }

    function backToQuiz(e) {
        e.preventDefault();
        navigate("/quiz/" + quizID);
    }
</script>

<div class="box mt-5 centerify">
    <div class="block">
        <h2 class="has-text-centered title">Add a Question</h2>
    </div>
    <div class="block">
        <div class="field">
            <label for="qtext" class="label">Question</label>
            <textarea
                bind:value={text}
                class="textarea"
                placeholder="Question Text"
            />
        </div>
        <div class="field">
            <label for="qtimer" class="label"> Timer Seconds </label>
            <input
                bind:value={timer}
                class="input"
                type="number"
                min="30"
                placeholder="30"
            />
        </div>
        <div class="field">
            <label for="qpoints" class="label"> Points </label>
            <input
                bind:value={points}
                class="input"
                type="number"
                min="0"
                placeholder="10"
            />
        </div>
        <div class="field">
            <label class="label" for="qanswer">Answer</label>
            <input
                class="input"
                bind:value={answer}
                id="qanswer"
                type="text"
                placeholder=""
            />
        </div>
        <div class="block">
            <div
                class="has-text-centered block {messageText === ''
                    ? 'is-hidden'
                    : ''}"
            >
                <article class="message is-info">
                    <div class="message-body">{messageText}</div>
                </article>
            </div>
            {#if showNext}
                <div class="has-text-centered">
                    <button
                        type="button"
                        class="button is-success"
                        on:click={backToQuiz}
                    >
                        Back to Quiz
                    </button>
                </div>
            {:else}
                <div class="has-text-centered ">
                    <button
                        class="button is-primary {showLoading === true
                            ? 'is-loading'
                            : ''}"
                        type="submit"
                        on:click={addQuestionHandler}>Add</button
                    >
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .centerify {
        margin-right: auto;
        margin-left: auto;
    }
</style>
