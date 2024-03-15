// import { Card, CardContent, Typography } from "@mui/material"
import { Card , CardBody } from "@nextui-org/react"


export const ErrorComponent = ({error}) => {

    console.log("ErrorComponent: error", error)

    return (
    <Card>
      <CardBody>
        <h1 data-testid="error-title">{error.message}</h1>
        <h4 data-testid="error-message">blabla - TODO replace blabla with API message</h4>
        <br/>
        <h2>Debug</h2>
        <h4 data-testid="error-code">Code: {error.code}</h4>
        <h4 data-testid="error-url">URL: {error.config.url}</h4>
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