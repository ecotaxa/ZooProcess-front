// import { Card, CardContent, Typography } from "@mui/material"
import { Card , CardBody } from "@nextui-org/react"
import { useRouter } from "next/navigation"


export const ErrorComponent = ({error}) => {

    console.log("ErrorComponent: error", error)

  const router = useRouter()
  // router.push('/auth/login')
  
  // let message = "" //"blabla - TODO replace blabla with API message"
  let message = error.message || String(error)

  // if (error.status == 401) {
  //   console.debug("ErrorComponent: error.status == test")
  //   router.push('/auth/login')
  // }

  // if (error.status === 401) {
  //   console.debug("ErrorComponent: error.status === test")
  //   router.push('/auth/login')
  // }

  // if (error.status == "401") {
  //   console.debug("ErrorComponent: error.status = string")
  //   router.push('/auth/login')
  // }

  // if (error.message.status == "401") {
  //   console.debug("ErrorComponent: error.message?.status == 401")
  //   router.push('/auth/login')
  // }

  // if (error.message == "Request failed with status code 401") {
  //   console.debug("ErrorComponent: error.message?.status == 401")
  //   router.push('/auth/login')
  // }

  if ( error.status == 500 ){
    if ( error.name == "AxiosError"){
      message = "Connection to server failed<br/>Please check your internet connection<br/>Call the geeks"
    }  
  }

  console.debug("typeof(error.status): ", typeof(error.status))

  // if ( error.message ){
  //   message = error.message
  // }

  // const errorMessage = error instanceof Error ? error.message : String(error);

    return (
    <Card>
      <CardBody>
        {/* <h1 data-testid="error-title">{error.message}</h1> */}
        {/* <h1 data-testid="error-title">{errorMessage}</h1> */}
        <h1 data-testid="error-title">{message}</h1>
        <h4 data-testid="error-message">{message}</h4>
        <br/>
        <h2>Debug</h2>
        <h4 data-testid="error-code">Code: {error.code}</h4>
        <h4 data-testid="error-url">URL: {error.config?.url}</h4>
        <h4 data-testid="error-name">Name: {error.name}</h4>
        <h4 data-testid="error-description">Dec: {error.description}</h4>
        <h4 data-testid="error-filename">File: {error.filename}</h4>
        <h4 data-testid="error-number">Number: {error.number}</h4>
        <h4 data-testid="error-status">Status: {error.status}</h4>
        <h4 style={{whiteSpace: "pre-wrap"}} data-testid="error-stack">Stack:<br/>{error.stack}</h4>
      </CardBody>
    </Card>
    )
  }