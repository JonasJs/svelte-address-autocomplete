<script>

    export let image = "";
    export let title = "";
    export let price = "";


    function formatPrice(price) {
        return price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }
</script>

<div class="product">
    <img src={image} alt={title}>
    <div class="product-content">
        <p>{title}</p>
        <span>{formatPrice(price)}</span>
    </div>
</div>

<style>

    .product {
        display: flex;
        margin-bottom: 24px;
    }
    .product-content {
        margin-left: 24px;
    }
    p {
        font-size: 16px;
        line-height: 24px;
        color: #788995;
        margin: 4px 0 8px 0;

    }
    span{
        font-size: 14px;
        line-height: 24px;
        color: #788995;
    }

</style>