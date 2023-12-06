// import { Card, CardContent, Typography } from "@mui/material"
import { Card , CardBody } from "@nextui-org/react"


export const ErrorComponent = ({error}) => {
    return (
    <Card>
      <CardBody>
        <h1 data-testid="error-title">{error.message}</h1>
        <h4 data-testid="error-message">blabla</h4>
      </CardBody>
    </Card>
    )
  }