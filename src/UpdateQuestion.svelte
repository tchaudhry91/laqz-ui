<script>
    import { navigate } from "svelte-navigator";
    import { updateQuestion, uploadAsset, getQuestion } from "./api";
    import { onMount } from "svelte";

    export let quizID;
    export let questionID;

    onMount(async () => {
        const resp = await getQuestion(quizID, questionID);
        text = resp.question.text;
        answer = resp.question.answer;
        imageLink = resp.question.image_link;
        timer = resp.question.timer_seconds;
        points = resp.question.points;
    });

    let question = {};
    let files;
    let showLoading = false;
    let showNext = false;
    let messageText = "";

    let text;
    let answer;
    let points;
    let timer;
    let imageLink;

    async function updateQuestionHandler(e) {
        e.preventDefault();
        console.log(text);
        showLoading = true;
        await updateQuestion(
            questionID,
            quizID,
            text,
            imageLink,
            "",
            answer,
            points,
            timer
        );
        showLoading = false;
        showNext = true;
        messageText = "Question Updated Succesfully!";
    }

    async function handleUpload() {
        const formData = new FormData();
        formData.append("asset", files[0]);
        try {
            let resp;
            resp = await uploadAsset(formData);
            imageLink = resp.url;
        } catch (e) {
            console.log(e);
        }
    }

    function backToQuiz(e) {
        e.preventDefault();
        navigate("/quiz/" + quizID);
    }
</script>

<div class="box mt-5 centerify">
    <div class="block">
        <h2 class="has-text-centered title">Update Question</h2>
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
            <label for="fileupload" class="label">Accompanying Image</label>
            <input class="input" type="text" disabled bind:value={imageLink} />
            <div class="block mt-5">
                <input id="fileUpload" type="file" bind:files />
                <button on:click={handleUpload} class="button is-small"
                    >Upload</button
                >
            </div>
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
                        on:click={updateQuestionHandler}>Update</button
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
