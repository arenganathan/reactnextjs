function calculateCartTotal(products) {
    const total = products.reduce((acc, el) => {
        acc += el.product.price * el.quantity;
        return acc;
    }, 0)
    const cartTotal = ((total *100) / 100).toFixed(2);
    const stripTotal = Number((total * 100).toFixed(2))
    return {cartTotal, stripTotal}
}

export default calculateCartTotal;