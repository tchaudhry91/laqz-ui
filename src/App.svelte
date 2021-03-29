<script>
    import Nav from "./Nav.svelte";
    import Home from "./Home.svelte";
    import { Router, Route } from "svelte-navigator";
</script>

<main>
    <Router primary={false}>
        <Nav />
        <div class="container">
            <Route path="/">
                <Home />
            </Route>
            <Route path="/create/*">
                <Route path="/quiz" />
            </Route>
        </div>
    </Router>
</main>

<style>
</style>
