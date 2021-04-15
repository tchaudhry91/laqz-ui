<script>
    import { Link } from "svelte-navigator";
    import { auth, googleProvider } from "./firebase";

    export let user;

    let showMenu = false;

    const login = () => {
        auth.signInWithPopup(googleProvider);
    };

    const logout = () => {
        auth.signOut();
        user = null;
    };

    function toggleMenu() {
        showMenu = !showMenu;
    }
</script>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <Link to="/">
            <h1 class="navbar-item title has-text-light">LAQZ</h1>
        </Link>
        <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            on:click={toggleMenu}
        >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
        </a>
    </div>

    <div class="navbar-menu {showMenu ? 'is-active' : ''}">
        <div class="navbar-start">
            <Link class="navbar-item" to="/">Home</Link>

            <div class="navbar-item has-dropdown is-hoverable">
                <div class="navbar-link">Create</div>

                <div class="navbar-dropdown">
                    <Link class="navbar-item" to="/create/quiz">Quiz</Link>
                </div>
            </div>
        </div>

        <div class="navbar-end">
            {#if !user}
                <div class="navbar-item">
                    <div class="buttons">
                        <button
                            on:click={login}
                            class="button is-light is-primary"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            {:else}
                <div class="navbar-item has-dropdown is-hoverable">
                    <div class="navbar-link">
                        {user.displayName}
                    </div>
                    <div class="navbar-dropdown">
                        <div on:click={logout} class="navbar-item">
                            <h1 class="is-clickable">Logout</h1>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</nav>
