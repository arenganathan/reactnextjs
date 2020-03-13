import React from "react"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import cookies from "js-cookie"
import {Header, Checkbox, Table, Icon} from "semantic-ui-react"
import formatDate from "../../utils/formatDate"

function AccountPermissions() {

  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const url = `${baseUrl}/api/users`
    const token = cookies.get("token")
    const payload = {headers : {Authorization: token }}
    const response = await axios.get(url, payload)    
    setUsers(response.data)
  }

  return (
    <div style={{margin: "2em 0"}}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>

      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map(user => (
            <UserPermission key={user._id} user={user}/>
          ))}
        </Table.Body>

      </Table>
    </div>
  );
}

function UserPermission({user}) {

  const [admin, setAdmin] = React.useState(user.role === "admin")

  const isFirstRun = React.useRef(true)

  React.useEffect(() => {
    if(isFirstRun.current){
      isFirstRun.current = false;
      return;
    }
    updatePermission()
  }, [admin])

  async function updatePermission() {
    const url = `${baseUrl}/api/account`    
    const payload = {_id : user._id, role: admin ? "admin" : "user"}
    await axios.put(url, payload)    
  }

  async function handleChangePermission() {
    setAdmin(prevState => !prevState)    
  }

  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox toggle checked={admin} onChange={handleChangePermission}/>
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{admin ? "admin" : "user"}</Table.Cell>

    </Table.Row>
  )
}

export default AccountPermissions;
