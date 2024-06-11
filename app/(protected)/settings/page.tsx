// "use client"

import { auth, signOut } from "@/auth"
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";

const SettingsPage = async () => {

    const session = await auth()
 
    if ( session){
        const date = new Date(session.expires)
        const now = new Date()

        if ( date < now ){
            await signOut(); 
            const router = useRouter()
            router.push('/auth/login')
        }
    }
    
    return (
        <div>
            <p>Settings Page</p>
            {JSON.stringify(session)}
            <Button href="projects" as={Link} color="primary">My Projects</Button>
            <form action={async () => {
                 "use server";
                 await signOut();   
            }}>
                <Button color="danger" type="submit">
                    Sign Out
                </Button>
            </form>
        </div>
    )

}


export default SettingsPage