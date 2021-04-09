<script>
    import Nav from "./Nav.svelte";
    import Home from "./Home.svelte";
    import CreateQuiz from "./CreateQuiz.svelte";
    import { Router, Route, useParams } from "svelte-navigator";
    import { authState } from "rxfire/auth";
    import { auth, googleProvider } from "./firebase";
    import QuizView from "./QuizView.svelte";
    import CreateQuestion from "./CreateQuestion.svelte";

    let user;
    const unsubscribe = authState(auth).subscribe((u) => (user = u));
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css"
        integrity="sha512-byErQdWdTqREz6DLAA9pCnLbdoGGhXfU6gm1c8bkf7F51JVmUBlayGe2A31VpXWQP+eiJ3ilTAZHCR3vmMyybA=="
        crossorigin="anonymous"
    />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
        crossorigin="anonymous"
    />
</svelte:head>

<main>
    <Router primary={false}>
        <Nav {user} />
        <div class="container is-fluid">
            <Route path="/">
                <Home {user} />
            </Route>
            <Route path="/create/*">
                <Route path="/quiz">
                    <CreateQuiz />
                </Route>
                <Route path="/quiz/:id/question" let:params>
                    <CreateQuestion quizID={params.id} {user} />
                </Route>
            </Route>
            <Route path="/quiz/:id" let:params>
                <QuizView quizID={params.id} {user} />
            </Route>
        </div>
    </Router>
</main>
