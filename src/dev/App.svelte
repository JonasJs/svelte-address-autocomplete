<script>
  import AdressAutocomplete from "../lib/index.svelte";
  import AdressAutocompleteTwo from "../lib/AdressAutocomplete.svelte";


  let cepValue = "";
  let streetValue = "";

  let autocompleteObj = {};

  function handleCallback(event) {
    autocompleteObj = event.detail.data
  }


  function handleCallbackTwo(event) {
    autocompleteObj = event.detail.data
  }
</script>


<main>
  <div class="row">
    <h1> Teste 1 </h1>
    <AdressAutocomplete on:callback={handleCallback} ClassName="newName">
      <div class="form-group">
        <label>Rua: </label>
        <input type="text" name="rua" bind:value={autocompleteObj.logradouro} />
      </div>
    </AdressAutocomplete>
  </div>

  <h1> Teste 2</h1>
  <AdressAutocompleteTwo on:callback={handleCallbackTwo}>
    <input type="password" bind:value={cepValue} slot="inputcep">
  </AdressAutocompleteTwo>

</main>

<style>
  main {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .row {
    margin-bottom: 32px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
  :global(.newName) {
    color: #fff;
  }
</style>