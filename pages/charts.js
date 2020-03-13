import {Segment, Tab} from "semantic-ui-react"
import baseUrl from "../utils/baseUrl"
import {parseCookies} from "nookies"
import axios from "axios"
import React from "react"
import cookies from "js-cookie"
import catchErrors from "../utils/catchErrors"
import Demo from "../components/Cart/Demo"
import Demo2 from "../components/Cart/Demo2"
import MapGL from "../components/Cart/MapGL"


function Cart({zipcodes, user}) {    
  
    const panes = [
        {
          menuItem: 'State Population',
          render: () => <Tab.Pane attached={false}><Demo zipcodes={zipcodes} /></Tab.Pane>,
        },
        {
          menuItem: 'Maps',
          render: () => <Tab.Pane attached={false}><MapGL zipcodes={zipcodes} /></Tab.Pane>,
        }
      ]
      
    const TabExamplePointing = () => <Tab menu={{ pointing: true }} panes={panes} />

    return (
    <>
    <TabExamplePointing />
    
    </>
  );
}

Cart.getInitialProps = async ctx => {
  const {token} = parseCookies(ctx);
  if(!token){
    return {zipcodes : []}
  }
  const url = `${baseUrl}/api/charts`
  const payload = {headers : { Authorization : token}}
  const response  = await axios.get(url,payload) 
  return response.data;
}

export default Cart;
