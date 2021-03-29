<script>
    import { ajaxFetchCall } from "./utils";
    const getHome = async () => {
        await ajaxFetchCall("http://localhost:8080/");
    };
</script>

<div>
    <div class="card card-med">
        <h3 class="card-heading">Create</h3>
        <h4 class="card-item">Quiz</h4>
    </div>
</div>

<style>
</style>
