<script>
    export let title = "Tab Title"
    export let active = false;
</script>


<div class="tab" class:active={active}>
    <h2>{title}</h2>
</div>

<style>
    .tab {
        max-width: 240px;
        flex: 1;
        cursor: pointer;
        text-align: center;
    }
    h2 {
        color: #D4D9DD;
        padding-bottom: 32px;
        border-bottom: 2px solid #D4D9DD;
        font-weight: 600;
        font-size: 16px;
        line-height: 17px;
    }
    .active h2 {
        color: #1B2125;
        border-color: #1B2125;
    }
</style>