import App from "next/app";
import Layout from "../components/_App/Layout"
import {parseCookies, destroyCookie} from "nookies"
import {redirectUser} from "../utils/auth"
import baseUrl from "../utils/baseUrl"
import axios from "axios"
import { Router } from "next/router";
import { Container } from "semantic-ui-react";
 
class MyApp extends App {  


  // Server rendering 
  static async getInitialProps ({Component, ctx}) {

    const {token} = parseCookies(ctx)    

    let pageProps = {};    
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if(!token) {
      const isProtectedRoute = ctx.pathname === "/account" || ctx.pathname === "/create" || ctx.pathname === "/charts"
      if(isProtectedRoute) {
        redirectUser(ctx, "/login")
      }
    } else {
      try {
        const payload = {headers : {Authorization : token}}
        const url = `${baseUrl}/api/account`
        const response = await axios.get(url, payload);
        const user = response.data;
        const isRoot = user.role === "root"
        const isAdmin = user.role === "admin"
        // if authenticated, but not in role [admin, root] - then redirect from create page
        const isNotPermitted = !(isRoot || isAdmin) && (ctx.pathname === "/create")
        if(isNotPermitted) {
          redirectUser(ctx, "/")
        }
        pageProps.user = user
      } catch (err) {
        console.error("Error getting current UserInfo",err)
        // during error, 
        // 1) delete the token from cookie
        destroyCookie(ctx, "token")
        // 2) redirect to login page
        redirectUser(ctx, "/login")
      }
    }
    return {pageProps}    
  }

  componentDidMount() {
    window.addEventListener("storage", this.syncLogout)
  }

  syncLogout = event => {
    if(event.key === "logout"){
      Router.push("/login")
    }
  }

  render() {
   
    const { Component, pageProps } = this.props;
    return (
     
        <Layout {...pageProps}>
          <Component {...pageProps}/>
        </Layout>  
              
    );
  }
}

export default MyApp;
