import {Header, Button, Modal } from "semantic-ui-react"
import React from "react"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import {useRouter} from "next/router"

function ProductAttributes({_id, description, user}) {
  const [modal, setModal] = React.useState(false)
  const router = useRouter()

  const isRoot = user && user.role === "root"
  const isAdmin = user && user.role === "admin"
  const isRootorAdmin = (isRoot || isAdmin)

  async function handleDelete () {
    const url = `${baseUrl}/api/product`
    const paylaod = { params : { _id }}
    await axios.delete(url,paylaod)
    router.push("/")
  }

  return (
    <>
      <Header as="h3">About this Product</Header>
      <p>{description}</p>

      {
        isRootorAdmin && (
          <Button 
          icon="trash alternate outline"
          color="red"
          content="Delete Product"
          onClick={() => setModal(true)}
        />
        )
      }      

      <Modal open={modal} dimmer="blurring">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Content>
          <p>Are you Sure to delete the Product..?</p>
        </Modal.Content>

        <Modal.Actions>
          <Button content="Cancel" onClick={() => setModal(false)} />
          <Button nagative icon="trash" labelPosition="right" content="Delete" onClick={handleDelete} />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ProductAttributes;
