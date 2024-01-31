// "use client"

import { auth, signOut } from "@/auth"
import { Button } from "@nextui-org/button";

const SettingsPage = async () => {

    const session = await auth()
 
    return (
        <div>
            <p>Settings Page</p>
            {JSON.stringify(session)}
            <form action={async () => {
                 "use server";
                 await signOut();   
            }}>
                <Button color="primary" type="submit">
                    Sign Out
                </Button>
            </form>
        </div>
    )

}


export default SettingsPage