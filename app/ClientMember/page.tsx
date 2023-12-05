"use client";

// import getServerSession from "next-auth";
// import { options } from "../api/auth/[...nextauth]/options";
// const Member = async () => {

//     const session = await getServerSession(options);
//     return (
//         <div>
//             <h1>Member Client Session</h1>
//             <p>{session?.user?.email}</p>
//             <p>{session?.user?.role}</p>
//         </div>
//     );
// };

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Member = async () => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated(){
            redirect("/api/auth/signin?callbackUrl='/CleintMember");
        }
    });
    return (
        <div>
            <h1>Member Client Session</h1>
            <p>{session?.user?.email}</p>
            <p>{session?.user?.role}</p>
        </div>
    );

}

export default Member;
