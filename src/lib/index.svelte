<script>
  import { createEventDispatcher } from 'svelte';

  export let zipCodeValue = "";
  export let className = "from-group";

	$:{
		if(zipCodeValue){
			getCep(zipCodeValue)
		}
	}

  let data = null;
  let error = null;
  const dispatch = createEventDispatcher();

  function sendCallback(data) {
    dispatch('callback', data);
  }
	
	function getCep(zipCode) {
		fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
      .then((response) => response.json())
      .then(({bairro, CEP, complemento, localidade, logradouro, uf}) => {
        data = {
          neighborhood: bairro,
          zipCode: CEP,
          complement: complemento,
          city: localidade,
          street: logradouro,
          fu: uf
        };
        sendCallback({ data });
      }).catch(e => {
        error = e;
        sendCallback({ message: e });
      })
	}

  function onBlur(e) {
    if(e.target.value !== ''){
      getCep(e.target.value)
    }
  }
</script>

<slot {data} {error} {onBlur}>
  <div class={className} >
    <input type="text" on:blur={onBlur} >
  </div>
</slot>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
</style>