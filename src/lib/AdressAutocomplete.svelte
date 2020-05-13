<script>
  import { createEventDispatcher } from 'svelte';

  export let cepValue = '';
  export let streetValue = '';
  export let neighborhoodValue =  '';
  export let ClassName = 'default';

  let statusCode = 200;

  const dispatch = createEventDispatcher();



  function sendCallback(message) {
    dispatch('callback', message);
  }


  function onBlur() {
    if(cepValue !== ''){
      fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
      .then((response) => {
        statusCode = response.status;
        return response.json(); 
      })
      .then(data => {
        streetValue = data.logradouro;
        neighborhoodValue = data.bairro;
        sendCallback({
          status: 200,
          data,
        });
      }).catch(error => {
        sendCallback({
          status: 400,
          message: error
        })
      })
    }
  }
</script>

<div class={ClassName}>

  <input type="text" bind:value={cepValue} on:blur={onBlur}>

	<div class="from-group">
		<slot name="cep">
			<input class="missing" />
		</slot>
	</div>

  <input type="text" bind:value={streetValue}>
  <input type="text" bind:value={neighborhoodValue}>
</div>