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
          status: statusCode,
          message: error
        })
      })
    }
  }
</script>

<div class={ClassName}>
  <div class="form-group">
    <label>Cep: </label>
    <input type="text" bind:value={cepValue} on:blur={onBlur}>
  </div>
  <slot></slot>
</div>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
</style>