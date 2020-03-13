import {Header, Segment, Button, Icon, Item, Message} from "semantic-ui-react"
import {useRouter} from "next/router"

function CartItemList({products, user, handleRemoveFromCart, success}) {

  const router = useRouter()

  if(success) {
    return (
      <Message 
        success
        header="Success"
        content="Your order and payment accepted"
        icon="star outline"
      />
    )
  }

  if(products.length === 0){
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>
        <Header icon>
          <Icon name="shopping basket" />
          No Products in your Cart, Add Some!
        </Header> 
        <div>
        {user ? (
          <Button color="orange" onClick={() => router.push("/")}>
            View Products
          </Button>
        ) : (
          <Button color="blue" onClick={() => router.push("/login")}>
            Login to add Products
          </Button>
        )} 
        </div>      
      </Segment>
    );
  }

  function mapCartProductsToItems(products) {
    return products.map(p => ({
      childKey: p.product._id,
      header: (
        <Item.Header as="a" onClick={() => router.push(`/product?_id=${p.product._id}`)}>
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `${p.quantity} X $${p.product.price}`,
      fluid: "true",
      extra : (
        <Button 
            basic
            icon="remove"
            floated="right"
            onClick={() => handleRemoveFromCart(p.product._id)}
        />
      )

    }))
  }

  return <Item.Group divided items={mapCartProductsToItems(products)} />

  
}

export default CartItemList;
