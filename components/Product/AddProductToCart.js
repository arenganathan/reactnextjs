import {Input} from "semantic-ui-react"
import React from "react"
import {useRouter} from "next/router"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import cookies from "js-cookie"
import catchErrors from "../../utils/catchErrors"

function AddProductToCart({user, productId}) {

  const [quantity, setQuantity] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    let timeout;
    if(success) {
      timeout = setTimeout(() => setSuccess(false), 3000) 
    }
    return () => {
      clearTimeout(timeout)
    }
  },[success])

  async function handleAddProducttoCart() {
    try {
      setLoading(true)
      setSuccess(false)
      const url = `${baseUrl}/api/cart`
      const payload = {quantity, productId}
      const token = cookies.get("token")
      const headers = {headers : {Authorization : token}}
      await axios.put(url, payload, headers)
      setSuccess(true)
    } catch(err) {
      console.error(err)    
      catchErrors(err, window.alert);
    } finally {
      setLoading(false)
    }    
  }

  return (
    <Input 
      type="number"
      min="1"
      value={quantity}
      onChange={event => setQuantity(Number(event.target.value))}
      placeholder="Quantity"
      action={ 
        user && success ? {
          color: "blue",
          content: "Item Added!",
          icon: "plus cart",
          disbaled: true
        } : user ? {
        color: "orange",
        content: "Add to Cart",
        icon: "plus cart",
        loading,
        disbaled: loading,
        onClick: handleAddProducttoCart 
      } : {
        color: "blue",
        content: "Signup to Purchase",
        icon: "signup",
        onClick: () => router.push("/signup")
      }}
    />
  );
}

export default AddProductToCart;
