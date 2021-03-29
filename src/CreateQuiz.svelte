<script>
    import { navigate } from "svelte-navigator";
    import { ajaxFetchCall } from "./utils";
    let name = "";

    const createQuiz = async (e) => {
        e.preventDefault();
        const reqBody = {
            name: name,
        };
        await ajaxFetchCall("/quiz/", {
            method: "POST",
            body: JSON.stringify(reqBody),
        });
        navigate("/");
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
