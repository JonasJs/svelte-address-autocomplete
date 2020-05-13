<script>
  import { createEventDispatcher } from 'svelte';

  export let cepValue = '';
  export let streetValue = '';
  export let neighborhoodValue =  '';
  export let ClassName = 'default';

  const dispatch = createEventDispatcher();


  function sendSuccess(data) {
    dispatch('error', data);
  }

  function sendError() {
    dispatch("error", new Error("Zip not found !"));
  }


  const onBlur = () => {
    if(cepValue !== ''){
      fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
      .then((response) => {
        statusCode = response.status;
        return response.json(); 
      })
      .then(data => {
        streetValue = data.logradouro;
        neighborhoodValue = data.bairro;
        sendSuccess({
          data,
        });
      }).catch(() => {
        sendError();
      })
    }
  }

</script>

<div class={ClassName}>
  <div class="from-group">
		<slot name="cep" {onBlur}>
			<input class="missing"  />
		</slot>
	</div>

  <div class="from-group">
		<slot name="Rua">
			<input type="text" bind:value={streetValue} >
		</slot>
	</div>
  <!-- <input type="text" bind:value={streetValue}>
  <input type="text" bind:value={neighborhoodValue}> -->
</div>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
</style>