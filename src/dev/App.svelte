<script>
  import AdressAutocomplete from "../lib/index.svelte";
</script>


<main>
  
  <AdressAutocomplete>

    <input slot="cep"/>

  </AdressAutocomplete>

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

</style>