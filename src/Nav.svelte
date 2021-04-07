<script>
    import { Link } from "svelte-navigator";
    import { auth, googleProvider } from "./firebase";

    let showLogout = false;
    export let user;

    const login = () => {
        auth.signInWithPopup(googleProvider);
    };

    const logout = () => {
        auth.signOut();
        user = null;
    };

    const toggleShowLogout = () => {
        showLogout = !showLogout;
    };
</script>

<div class="navbar">
    <Link to="/"><h1>LAQZ</h1></Link>
    <ul>
        {#if user}
            <li />
            <li>
                <div class="dropdown">
                    <img
                        on:click={toggleShowLogout}
                        src={user.photoURL}
                        alt={user.displayName}
                        class="avatar"
                    />
                    <div class="dropdown-content">
                        <button on:click={logout} class="btn">Logout</button>
                    </div>
                </div>
            </li>
        {:else}
            <button on:click={login} class="btn">Log In</button>
        {/if}
    </ul>
</div>

<style>
    h1 {
        color: var(--dark-color);
    }
    button {
        border-radius: 4px;
    }
    li {
        padding-right: 1rem;
        color: var(--dark-color);
    }
    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        padding: 12px 16px;
        z-index: 1;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }
</style>
