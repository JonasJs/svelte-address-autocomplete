<script>
  import { onMount } from "svelte";

  import Tab from './components/Tab.svelte';
  import Input from './components/Input.svelte';
  import Product from './components/Product.svelte';
  import AdressAutocomplete from "../lib/index.svelte";
  
  const products = [
    {
      title: "Lightweight College Backpack",
      price: 99.9,
      image: "./assets/images/imageOne.png"
    },
    {
      title: "Business Casual Leather Watch Waterproof",
      price: 69.9,
      image: "./assets/images/imageTwo.png"
    }
  ]

  let infos = {}
  let address = {};
  let total = 0

  onMount(() => {
    total = formatPrice(products.reduce((accumulator, {price}) => accumulator + price, 0));
  });

  function formatPrice(price) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  function handleCallback({detail}) {
    if(detail.data){
      address = detail.data;
    } else {
      alert("Zip not found!");
    }
  }

  
</script>

<main class="container">
  <div class="content">
    <div class="header">
      <Tab active={true} title="01 CUSTOMER INFO" />
      <Tab active={false} title="02 SHIPPING INFO" />
      <Tab active={false} title="03 PAYMENT SELECTION" />
    </div>

    <div class="form-container">
      <h1 class="title">Customer Information</h1>
      <AdressAutocomplete on:callback={handleCallback} ClassName="newName">
        <div class="row">
          <Input label="First name" bind:value={infos.firstName} />
          <Input label="Last Name" bind:value={infos.lastName} />
        </div>
        <div class="row">
          <Input type="select" label="Country" bind:value={infos.country} />
          <Input label="Postal Code" bind:value={address.zipCode} />
        </div>
        <Input label="Address" bind:value={address.street} />
        <div class="row">
          <Input label="City" bind:value={address.city}/>
          <Input label="Neighborhood" bind:value={address.neighborhood}/>
        </div>
      </AdressAutocomplete>
    </div>
  </div>
  <div class="cart">
    <div class="cart-header">
      <h1 class="title">Shopping Cart</h1>
      <span>{products.length}</span>
    </div>
    <div class="products">
      {#each products as {title, price, image}}
        <Product {title} {price} {image} />
      {/each}

      <div class="resume">
        <div class="item">
          <p>Subtotal</p>
          <span>{total}</span>
        </div>
        <div class="item">
          <p>Shipping</p>
          <span>Free</span>
        </div>
        <div class="item">
          <p>Total</p>
          <span>{total}</span>
        </div>
      </div>
      
    </div>
  </div>
</main>

<style>
  p {
    margin: 0;
  }
  .container {
    display: flex;
    height: 100vh;
    justify-content: center;
    padding: 0 20px;
    /* align-items: center; */
  }
  .content{
    max-width: 720px;
    width: 100%;
    margin-top: 80px;
  }

  .header {
    display: flex;
  }
  .title {
    color:#1B2125;
    font-weight: normal;
    font-size: 26px;
    line-height: 29px;
    margin: 72px 0 32px 0;
  }
  .row {
    display: flex;
  }

  .row :global(.form-group:not(:last-child)) {
    padding-right: 16px;
  }
  .row :global(.form-group:last-child){
    padding-left: 16px;
  }

  .cart {
    max-width: 390px;
    width: 100%;
    margin-left: 5%;
    background: #F8FAFB;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cart-header {
    max-width: 290px;
    width: 100%;
    margin-top: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E4EAEE;
    padding-bottom: 32px;
  }
  .cart-header h1{
    margin: 0px;
  }
  .cart-header span {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0095F8;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .products {
    max-width: 290px;
    width: 100%;
    margin-top: 48px;
  }

  .resume {
    margin-top: 48px;
  }
  .resume .item {
    font-size: 16px;
    line-height: 26px;
    color: #788995;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    color: #788995;
  }
  .resume .item span {
    font-weight: 600;
  }

  .resume .item:nth-child(2) {
    border-bottom: 2px solid #E4EAEE;
    padding-bottom: 24px;
  }

  .resume .item:last-child {
    font-size: 24px;
    line-height: 24px;
    color: #1B2125;
    margin-top: 32px;
  }


</style>