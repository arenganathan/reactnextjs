import React from "react"
import axios from "axios"
import ProductList from "../components/Index/ProductList"
import ProductPagination from "../components/Index/ProductPagination"
import baseUrl from "../utils/baseUrl"

function Home({products, totalPages}) { 
 
  return (
    <>
    <ProductList products={products} />
    <ProductPagination totalPages={totalPages} />
    </>
  );
}

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
