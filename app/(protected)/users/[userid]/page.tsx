"use client";


import { useUserByIdWithAuth } from "@/app/api/user";
import { Debug } from "@/components/Debug";
import { ErrorComponent } from "@/components/ErrorComponent";
import { MySpinner } from "@/components/mySpinner";
import { userFormElements } from "@/config/formElements";
import { Button } from "@heroui/button";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

import UserForm from './userform'

// const fomr = [
//     userFormElements
// ]

interface pageProps {
    params: {
        userid: string
    }
}

const UserByID: FC<pageProps> = ({ params }) => {

    const router = useRouter();

    const userid = params.userid;

    console.debug("userid:",userid)

    // const { user, isLoading, isError } = useUserByIdWithAuth(userid);
    // const [ userInfo , setUserInfo ] = useState(user);
    

    // useEffect(() => {
    //     setUserInfo(user)
    // }, [user])





    return (
        <>
        {/* <Head>
            <title>
            New Sub Sample Metadata | ZooProcess
            </title>
        </Head> */}
        <Debug params={params}/>

            <div className="text-center justify-center">
                    <div>
                    User {userid}
                    </div>
                        <UserForm params={params} /> 
            </div>
        </>
    );
}
export default UserByID;
