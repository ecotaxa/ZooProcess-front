// "use client";

// "use server"; //par en boucle d'erreur
import { auth } from '@/auth'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'
import { signOut } from 'next-auth/react'
// import { useRouter } from 'next/navigation'
import { handleSignOut } from "./serverActions"

// import { useSession } from "next-auth/react"
// import { useEffect } from "react"

//const AsyncAuthComponent = async ({ router, session, status }: { router: any , session : any, status : any}) => {
    // const AsyncAuthComponent = async ({ router, session, status }: { router: any , session : any, status : any}) => {
    const AsyncAuthComponent = ({ router, session, status }: { router: any , session : any, status : any}) => {

//   const session = await auth()
//   const { data: session, status } = useSession()

console.log("AsyncAuthComponent Router: ", router)
console.log("AsyncAuthComponent Session: ", session)
console.log("AsyncAuthComponent Status: ", status)

  // Your component logic here, using session and router

 
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push('/auth/login')
//     }
//   }, [status, router])

//   if (status === "loading") {
//     return <div>Loading...</div>
//   }

//   if (!session) {
//     return null
//   }


  if ( session ){


    console.log("AsyncAuthComponent Session: ", session)

      let expirationDate = new Date(session.expires) 
    //   const expirationDate = 
    // expirationDate.setMonth(expirationDate.getMonth() - 1);
      const now = new Date()

      console.log("Session  expires: ", expirationDate)
      console.log("Session date now: ", now)

      console.log("Expiration date:", expirationDate);
      console.log("Current date:", now);
      console.log("Is expired:", expirationDate < now);

      if ( expirationDate < now ){
          console.log("Session expired")
        //   await
           signOut(); 
          // const router = useRouter()
          router.push('/auth/login')
      } else {
          console.log("Session valid")
      }
  }
  
const picture = () => {

    if (session?.user.image){
        return ( <li><img src={session?.user.image}/></li> )
    }
    return ( <></> )
}

if ( status === "loading" ) {
    return ( <div>Loading...</div> )
}

if ( status === "unauthenticated" ) {
    return ( <div>unauthenticated</div> )
}

// if ( status === "authenticated" ) { 
//     return( <div>authenticated</div> )
// }

  return (
    // Your JSX here
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
export default AsyncAuthComponent
