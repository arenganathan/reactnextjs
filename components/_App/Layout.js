import Head from "next/head";
import { Container } from "semantic-ui-react";
import {useRouter} from "next/router"
import Header from "./Header";
import HeadContent from "./HeadContent";

function Layout({ children, user }) {

  const router = useRouter() 

  console.log(router.pathname)

  return (
    <>
      <Head>
        <HeadContent />
        {/* Stylesheets */}
        <link rel="stylesheet" type="text/css" href="/static/styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"
        />
        <title>ReactReserve</title>
      </Head>
      <Header user={user} />
      <Container text={router.pathname === "/charts" ? false : true} style={{ paddingTop: "1em"}}>
        {children}
      </Container>
    </>
  );
}

export default Layout;
