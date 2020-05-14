<script>
  import AdressAutocomplete from "../lib/index.svelte";

  let adress = {};

  function handleCallback({detail}) {
    if(detail.data){
      adress = detail.data;
    } else {
      alert("Zip not found!");
    }
  }
</script>


<main class="container">
  <div class="form">
    <h1> Svelte Adress Autocomplete </h1>
    <AdressAutocomplete on:callback={handleCallback} ClassName="newName">
      <div class="form-group">
        <label>Rua: </label>
        <input type="text" name="rua" bind:value={adress.street} />
      </div>
    </AdressAutocomplete>
  </div> 
</main>

<style>

  .container {

  }
</style>