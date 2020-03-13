import AccountHeader from "../components/Account/AccountHeader"
import AccountOrders from "../components/Account/AccountOrders"
import AccountPermissions from "../components/Account/AccountPermissions"
import {parseCookies} from "nookies"
import baseUrl from "../utils/baseUrl"
import axios from "axios"
import Demo from "../components/Cart/Demo"
import ThemingLayout from "../components/Cart/ThemingLayout"

function Account({user, orders}) {  
 
  return <>
    <AccountHeader {...user} />
    {/* <AccountOrders  orders={orders} /> */}
    {user.role === "root" && <AccountPermissions currentUserId={user._id} />}    
    {/* <ThemingLayout /> */}
  </>;
}

Account.getInitialProps = async ctx => {
  const {token}  = parseCookies(ctx)
  if (!token) {
    return {orders : []}
  }
  const url = `${baseUrl}/api/orders`
  const payload = {headers: {Authorization: token}}
  const response = await axios.get(url, payload)
  return response.data
}

export default Account;
