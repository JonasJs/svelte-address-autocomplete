


<script>
    import { onMount } from "svelte";

    export let name = "";
    export let label = "Tex Label";
    export let type= "text";

    export let value = "";
	
    let inputElement;
    let countries = []

    onMount(() => {
        if(type === 'select'){
            fetch('https://restcountries.eu/rest/v2/all')
            .then((response) => response.json())
            .then((data) => {
                countries = data;
            });
        } else {
            inputElement.type = type;
        }

    });

</script>


<div class="form-group">
    <label>{label}</label>
    {#if type === 'select'}
        <select>
            {#each countries as {name}}
                <option value={name}>{name}</option>
            {/each}
        </select>
    {:else}
        <input on:keyup on:change bind:value bind:this={inputElement} name={name || label}/>
    {/if}
</div>

<style>
    .form-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
    }
    label {
        margin-bottom: 8px;
        font-weight: 600;
        font-size: 14px;
        line-height: 14px;
        text-transform: uppercase;
        color: #93979A;
    }
    input, select {
        background: #FFFFFF;
        border: 1px solid #DDE3E8;
        box-sizing: border-box;
        border-radius: 3px;
        padding: 18px 24px;
        font-weight: normal;
        font-size: 16px;
        line-height: 19px;
        color: #1B2125;
    }
</style>