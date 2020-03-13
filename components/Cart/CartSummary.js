import {Button, Segment, Divider} from "semantic-ui-react"
import React from "react"
import calculateCartTotal from "../../utils/calculateCartTotal"
import StripeCheckout from "react-stripe-checkout"

function CartSummary({products, user, handleCheckout, success}) {

  const [cartAmount, setCartAmount] = React.useState(0)
  const [stripAmount, setStriptAmount] = React.useState(0)
  const [isCartEmpty, setCartEmpty] = React.useState(false)

  React.useEffect(() => {
    const {cartTotal, stripTotal} = calculateCartTotal(products)
    setCartAmount(cartTotal)
    setStriptAmount(stripTotal)
    setCartEmpty(products.length === 0)
  }, [products])

  return <>
    <Divider />

    <Segment clearing size="large">
      <strong>Sub Total:</strong> ${cartAmount}
      <StripeCheckout
        name="React Reserve"
        amount={stripAmount}
        image={products.length > 0 ? products[0].product.mediaUrl : ""}
        currency="USD"
        shippingAddress={true}
        billingAddress={true}
        zipCode={true}
        token={handleCheckout}
        stripeKey="pk_test_gwJq5PBm9r70wG4drPr2xOXS00fKPyBQbU"
        triggerEvent="onClick"
      >
      <Button 
        icon="cart"
        color="teal"
        floated="right"
        content="Checkout"
        disabled={isCartEmpty || success}
      />
      </StripeCheckout>      
    </Segment>
  </>;
}

export default CartSummary;
