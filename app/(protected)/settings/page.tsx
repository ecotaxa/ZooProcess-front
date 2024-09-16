"use client"

import { auth, signOut } from "@/auth"
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { User } from "@nextui-org/react";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { handleSignOut } from "./serverActions"

const SettingsPage = async () => {

    const session = await auth()
 

    if ( session ){
        const expirationDate = new Date(session.expires)
        const now = new Date()

        console.log("Session  expires: ", expirationDate)
        console.log("Session date now: ", now)

        console.log("Expiration date:", expirationDate);
        console.log("Current date:", now);
        console.log("Is expired:", expirationDate < now);

        if ( expirationDate < now ){
            console.log("Session expired")
            await signOut(); 
            const router = useRouter()
            router.push('/auth/login')
        } else {
            console.log("Session valid")
        }
    }
    

    // const userInfo = () => {
    //     let picture = undefined
    //     if ( session?.user.image ){
    //         picture = session?.user.image
    //     }

    //     const date = new Date(session?.expires)

    //     return (
    //         <div>
                
    //             <User 
    //                 name={session?.user.image} 
    //                 description= ""
    //                 // avatarProps={picture}
    //             />
    //             <div>
    //                 <Label htmlFor="name" className="label">email : </Label>
    //                 <p>{session?.user.email}</p>
    //             </div>

    //             <div>
    //                 <Label htmlFor="name" className="label">Session Validity :</Label>
    //                 <p>{ session?.expires }</p>
    //             </div>

    //         </div>
    //     )
    // }

    

    const picture = () => {
        
        if (session?.user.image){
            return ( <li><img src={session?.user.image}/></li> )
        }
        return ( <></> )
    }



    return (
        <div>
            <h1>Settings Page</h1>
            {/* {userInfo()} */}

            {/* {JSON.stringify(session)} */}


            <ul>
                    {/* <Label htmlFor="name" className="label">Session Validity :</Label> */}
                    <li>Name: {session?.user.name}</li>
                    <li>ID: {session?.user.id}</li>
                    <li>Email: {session?.user.email}</li>
                    <li>Role: {session?.user.role}</li>
                    {picture()}
                    <li></li>
                    <li>Session expiration date: {session?.expires}</li>
                    <li>Session token: {session?.user.token}</li>
            </ul>

            <br/>
            <hr/>
            <br/>
            <Button href="projects" as={Link} color="primary">My Projects</Button>

            <form action={handleSignOut}>
                <Button color="danger" type="submit">
                    Sign Out
                </Button>
            </form>
        </div>
    )

}


export default SettingsPage

