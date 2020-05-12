<script>

  export let cepValue;

</script>

<div>
	<slot cep="cep">
    <input bind:value={cepValue}>
  </slot>
  
</div>

<style></style>