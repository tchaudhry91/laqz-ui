<script>
    import { getOTDBQuestion } from "./api";

    let categories = [
        {
            id: 0,
            name: "Random",
        },
        {
            id: 9,
            name: "General Knowledge",
        },
        {
            id: 10,
            name: "Entertainment: Books",
        },
        {
            id: 11,
            name: "Entertainment: Film",
        },
        {
            id: 12,
            name: "Entertainment: Music",
        },
        {
            id: 13,
            name: "Entertainment: Musicals & Theatres",
        },
        {
            id: 14,
            name: "Entertainment: Television",
        },
        {
            id: 15,
            name: "Entertainment: Video Games",
        },
        {
            id: 16,
            name: "Entertainment: Board Games",
        },
        {
            id: 17,
            name: "Science & Nature",
        },
        {
            id: 18,
            name: "Science: Computers",
        },
        {
            id: 19,
            name: "Science: Mathematics",
        },
        {
            id: 20,
            name: "Mythology",
        },
        {
            id: 21,
            name: "Sports",
        },
        {
            id: 22,
            name: "Geography",
        },
        {
            id: 23,
            name: "History",
        },
        {
            id: 24,
            name: "Politics",
        },
        {
            id: 25,
            name: "Art",
        },
        {
            id: 26,
            name: "Celebrities",
        },
        {
            id: 27,
            name: "Animals",
        },
        {
            id: 28,
            name: "Vehicles",
        },
        {
            id: 29,
            name: "Entertainment: Comics",
        },
        {
            id: 30,
            name: "Science: Gadgets",
        },
        {
            id: 31,
            name: "Entertainment: Japanese Anime & Manga",
        },
        {
            id: 32,
            name: "Entertainment: Cartoon & Animations",
        },
    ];

    let difficulties = ["any", "easy", "medium", "hard"];

    let selectedCategory;
    let selectedDifficulty;

    let questionText = "Question appears here";
    let questionCategory = "Category";
    let questionDifficulty = "Difficulty";
    let options = ["Jack", "Gates", "Clinton", "Dara"];
    let answer = "Answer";
    let showAnswer = false;

    async function handleGenerate() {
        let question = await getOTDBQuestion(
            selectedCategory,
            selectedDifficulty
        );
        console.log(question);
        questionText = question.question;
        questionText = question.question;
        questionCategory = question.category;
        questionDifficulty = question.difficulty;
        answer = question.correct_answer;

        let tempOptions = [];
        tempOptions.push(...question.incorrect_answers);
        tempOptions.push(question.correct_answer);
        options = shuffle(tempOptions);

        showAnswer = false;
    }

    function shuffle(array) {
        var currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }
</script>

<div class="box mt-5 half-width centerify">
    <div class="block">
        <h2 class="title has-text-centered">Endless Mode</h2>
    </div>

    <!-- Generation-->
    <div class="block box centerify">
        <div class="centerify">
            <div class="field">
                <label for="category" class="label">Category</label>
                <select bind:value={selectedCategory}>
                    {#each categories as category}
                        <option value={category}>
                            {category.name}
                        </option>
                    {/each}
                </select>

                <label for="difficulty" class="label mt-3">Difficulty</label>
                <select bind:value={selectedDifficulty}>
                    {#each difficulties as difficulty}
                        <option value={difficulty}>
                            {difficulty.toUpperCase()}
                        </option>
                    {/each}
                </select>
            </div>
        </div>
        <button
            on:click={handleGenerate}
            class="button is-primary mt-3 is-small"
            type="submit"
        >
            Generate
        </button>

        <!-- Question-->
        <div class="block mt-5 centerify has-text-centered">
            <h2 class="is-size-3 has-text-centered centerify">
                {questionText}
            </h2>
            <h2 class="is-size-7 has-text-centered">{questionCategory}</h2>
            <h2 class="is-size-7 has-text-centered mb-5">
                {questionDifficulty}
            </h2>
            {#each options as option}
                <h4 class="is-size-5 has-text-centered centerify">{option}</h4>
            {/each}
            <h2
                class="is-size-4 has-text-centered centerify {showAnswer
                    ? ''
                    : 'is-hidden'}"
            >
                Answer = {answer}
            </h2>

            <button
                class="button is-primary mt-3 centerify is-small"
                on:click={() => {
                    showAnswer = true;
                }}>Reveal Answer</button
            >
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
