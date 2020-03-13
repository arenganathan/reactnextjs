import React from "react"
import axios from "axios"
import ProductList from "../components/Index/ProductList"
import ProductPagination from "../components/Index/ProductPagination"
import baseUrl from "../utils/baseUrl"
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from 'semantic-ui-react'
import Router from "next/router"

function Home({products, totalPages}) { 


  return (
    <>
    {/* <ProductList products={products} />
    <ProductPagination totalPages={totalPages} /> */}
        <Segment
            textAlign='center'
            
            vertical
          >
        <HomepageHeading />
        </Segment>
    </>
  );
}

const HomepageHeading = () => (
  <Container text>
    <Header
      as='h1'
      content='HXF Analytics'
      inverted
      style={{
        fontSize: '4em',
        color: "grey",
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: '3em',
      }}
    />
    <Header
      as='h2'
      content='Explore the possibilities...'
      inverted
      style={{
        fontSize: '1.7em',
        color: "grey",
        fontWeight: 'normal',
        marginTop: '1.5em',
      }}
    />
    <Button primary size='huge' onClick={() => Router.push("/charts")}>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

// Server rendering 
Home.getInitialProps = async (ctx) => {

  // pagination
  const page = ctx.query.page ? ctx.query.page : "1"
  const size = 9;
  
  const payload = {params : {page, size}}
  // fetch data on server
  const url = `${baseUrl}/api/products`
  const response  = await axios.get(url, payload)  
  return response.data;
}

export default Home;

/*
  // client side rendering
  React.useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {
    const url = "http://localhost:3000/api/products"
    const response  = await axios.get(url)
    //console.log(response.data)
  }
*/
