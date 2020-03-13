import {Segment, Icon, Button, Message, Form} from "semantic-ui-react"
import Link from "next/link"
import React from "react"
import baseUrl from "../utils/baseUrl"
import catchErrors from "../utils/catchErrors"
import axios from "axios"
import {handleLogin} from "../utils/auth"

const INITIAL_USER = {
  name: "",
  email: "",
  password: ""
}

function Signup() {
  const [user, setUser] = React.useState(INITIAL_USER)
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el))
    isUser ? setDisabled(false) : setDisabled(true)
  }, [user])

  function handleChange(event){
    const {name, value} = event.target
    setUser(prevState => ({...prevState, [name] : value}))
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true)
      setError("")      
      const url = `${baseUrl}/api/signup`
      const {name, email, password} = user
      const payload = {name, email, password}
      const response = await axios.post(url, payload)
      // redirect to account page
      handleLogin(response.data)      
    } catch (err) {
      catchErrors(err,setError)     
    } finally {
      setLoading(false)
    }
  }

  return <>
    <Message 
      attached
      icon="settings"
      header="Gets Started"
      content="Create a new Account"
      color="teal"
    />

    <Form onSubmit={handleSubmit} loading={loading} error={Boolean(error)} success={success}>
      <Message 
        error
        header="Oops"
        content={error}
      />
      <Message 
        success
        icon="check"
        header="Success"
        content="User Signup is Success"
      />

      <Segment>
        <Form.Input 
          name="name"
          label="Name"
          placeholder="Name"
          fluid
          icon="user"
          iconPosition="left"    
          onChange={handleChange}    
          value={user.name}  
        />

        <Form.Input 
          name="email"
          label="Email"
          placeholder="Email"
          fluid
          type="email"
          icon="envelope"
          iconPosition="left"   
          onChange={handleChange}    
          value={user.email}   
        />

        <Form.Input 
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          fluid
          icon="lock"
          iconPosition="left"  
          onChange={handleChange}    
          value={user.password}    
        />

        <Button 
          icon="signup"
          color="orange"
          type="submit"
          content="Signup"
          disabled={disabled || loading}
        />
        
      </Segment>
    </Form>

    <Message attached="bottom" warning>
      <Icon name="help" />
      Existing User? {" "}
      <Link href="/login"><a>Login here</a></Link>
      {" "}instead
    </Message>

  </>;
}

export default Signup;
