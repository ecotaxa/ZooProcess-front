

// class gateway{}

import { Image } from "@nextui-org/react"

import {pathToSessionStorage}  from "@/lib/gateway"


export function MyImage(props){

    let newProps = { ...props }

    const sessionPath = pathToSessionStorage(props.src)
    // src={pathToSessionStorage(props.src)}
    console.log("MyImage() | sessionPath :", sessionPath)
    newProps.src = sessionPath
    console.log("MyImage() | newProps :", newProps)

    return (
        <Image {...newProps} />
    )

}
