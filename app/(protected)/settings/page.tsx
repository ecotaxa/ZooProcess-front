

import { auth } from "@/auth"

const SettingsPage = async () => {

    const session = await auth()

    return (
        <div>
            <p>Settings Page</p>
            {JSON.stringify(session)}
        </div>
    )

}


export default SettingsPage