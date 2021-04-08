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
        const resp = await ajaxFetchCall("/quiz/", {
            method: "POST",
            body: JSON.stringify(reqBody),
        });
        navigate("/quiz/" + resp.quiz.ID);
    };
</script>

<div class="container-column">
    <h2 class="centerify">Create a Quiz!</h2>
    <div class="form-container">
        <form class="form-inline">
            <div class="form-group">
                <label for="quizName">Quiz Name</label>
                <input
                    bind:value={name}
                    id="quizName"
                    type="text"
                    placeholder="Quiz Name"
                />
                <label for="quizTags">Tags (comma separated)</label>
                <input
                    bind:value={tagsString}
                    id="quizTags"
                    type="text"
                    placeholder="General Knowledge"
                />
            </div>
            <div class="centerify">
                <button
                    class="btn btn-dark centerify"
                    type="submit"
                    on:click={createQuiz}>Create</button
                >
            </div>
        </form>
    </div>
</div>

<style>
    .centerify {
        text-align: center;
        margin: auto;
    }
</style>
