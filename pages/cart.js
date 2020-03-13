import {Segment} from "semantic-ui-react"
import CartItemList from "../components/Cart/CartItemList"
import CartSummary from "../components/Cart/CartSummary"
import baseUrl from "../utils/baseUrl"
import {parseCookies} from "nookies"
import axios from "axios"
import React from "react"
import cookies from "js-cookie"
import catchErrors from "../utils/catchErrors"
import Demo from "../components/Cart/Demo"

function Cart({products, user}) {

  const [cartProducts, setCartProducts] = React.useState(products)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function handleRemoveFromCart(productId) {
    const token = cookies.get("token")    
    const url = `${baseUrl}/api/cart`
    const payload = {
      params: {productId},
      headers : { Authorization : token}
    }
    const response  = await axios.delete(url,payload) 
    setCartProducts(response.data)
  }

  async function handleCheckout(paymentData){
    try {
      setLoading(true)
      const url = `${baseUrl}/api/checkout`
      const token = cookies.get("token")
      const payload = {paymentData}
      const headers = {headers: {Authorization: token}}
      const response = await axios.post(url, payload, headers)
      setSuccess(true)
      //setCartProducts(response.data)
    } catch (err) {
      console.error("Error during Payment", err)
      catchErrors(err, window.alert)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Segment loading={loading} >
      <CartItemList handleRemoveFromCart={handleRemoveFromCart} user={user} products={cartProducts} success={success}/>
      <CartSummary products={cartProducts} handleCheckout={handleCheckout} success={success} />
      <Demo />
    </Segment>
  );
}

Cart.getInitialProps = async ctx => {
  const {token} = parseCookies(ctx);
  if(!token){
    return {products : []}
  }
  const url = `${baseUrl}/api/cart`
  const payload = {headers : { Authorization : token}}
  const response  = await axios.get(url,payload) 
  return {products : response.data }
}

export default Cart;
