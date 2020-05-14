<script>
  import { createEventDispatcher } from 'svelte';

  export let cepValue = '';
  export let className = 'default';

  const dispatch = createEventDispatcher();

  function sendCallback(data) {
    dispatch('callback', data);
  }


  function onBlur() {
    if(cepValue !== ''){
      fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
      .then((response) => response.json())
      .then(({bairro, CEP, complemento, localidade, logradouro, uf}) => {
        sendCallback({
          data: {
            neighborhood: bairro,
            zipCode: CEP,
            complement: complemento,
            city: localidade,
            street: logradouro,
            fu: uf
          }
        });
      }).catch(error => {
        sendCallback({
          message: error
        })
      })
    }
  }
</script>

<div class={className}>
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