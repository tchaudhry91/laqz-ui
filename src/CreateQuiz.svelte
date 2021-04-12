<script>
    import { navigate } from "svelte-navigator";
    import { ajaxFetchCall } from "./utils";
    let name = "";
    let tagsString = "";

    let tags = [];

    const createQuiz = async (e) => {
        e.preventDefault();
        tags = tagsString.split(",");
        tags.forEach((t, i, arr) => {
            arr[i] = t.trim();
        });
        const reqBody = {
            name: name,
            tags: tags,
        };
        const resp = await ajaxFetchCall(
            "/quiz/",
            {
                method: "POST",
                body: JSON.stringify(reqBody),
            },
            true
        );
        navigate("/quiz/" + resp.quiz.ID);
    };
</script>

<div class="box mt-5 half-width centerify">
    <div class="block">
        <h2 class="title has-text-centered">Create a Quiz!</h2>
    </div>
    <div class="block">
        <div class="container">
            <div class="field">
                <label for="quizName" class="label">Quiz Name</label>
                <div id="quizName" class="control">
                    <input
                        bind:value={name}
                        class="input"
                        type="text"
                        placeholder="Quiz Name"
                    />
                </div>
            </div>
            <div class="field">
                <label for="quizTags" class="label"
                    >Tags (comma separated)</label
                >
                <input
                    bind:value={tagsString}
                    class="input"
                    id="quizTags"
                    type="text"
                    placeholder="General Knowledge"
                />
            </div>
            <div class="field is-grouped">
                <button
                    class="button is-primary centerify"
                    type="submit"
                    on:click={createQuiz}>Create</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .centerify {
        margin-right: auto;
        margin-left: auto;
    }

    .half-width {
        max-width: 60%;
    }
</style>
