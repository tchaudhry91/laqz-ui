<script>
    import Nav from "./Nav.svelte";
    import Home from "./Home.svelte";
    import CreateQuiz from "./CreateQuiz.svelte";
    import { Router, Route } from "svelte-navigator";
    import { authState } from "rxfire/auth";
    import { auth, googleProvider } from "./firebase";
    import QuizView from "./QuizView.svelte";

    let user;
    const unsubscribe = authState(auth).subscribe((u) => (user = u));
</script>

<main>
    <Router primary={false}>
        <Nav {user} />
        <div class="container">
            <Route path="/">
                <Home {user} />
            </Route>
            <Route path="/create/*">
                <Route path="/quiz">
                    <CreateQuiz />
                </Route>
            </Route>
            <Route path="/quiz/:id" let:params>
                <QuizView quizID={params.id} user={user}/>
            </Route>
        </div>
    </Router>
</main>

<style>
</style>
