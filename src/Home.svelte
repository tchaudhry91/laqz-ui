<script>
    import { ajaxFetchCall } from "./utils";
    const getHome = async () => {
        await ajaxFetchCall("http://localhost:8080/");
    };
</script>

<div>
    <button on:click={getHome} class="btn"> Get Home </button>
</div>
