"use client"

import { User } from "@/app/api/network/zooprocess-api"
import { updateUser, useUserByIdWithAuth } from "@/app/api/user"
import { ErrorComponent } from "@/components/ErrorComponent"
import { MyForm } from "@/components/myForm"
import { MySpinner } from "@/components/mySpinner"
import { userFormElements } from "@/config/formElements"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { updateLanguageServiceSourceFile } from "typescript"



export const forms = [
    userFormElements
]


interface pageProps {
    params: {
        userid: string
    }
}

const UserForm: FC<pageProps> = ({ params }) => {

    const userid = params.userid;

    const router = useRouter()


    const { user, isLoading, isError } = useUserByIdWithAuth(userid);
    // const [ userInfo , setUserInfo ] = useState(user);
    const [stringifiedData, setData] = useState("")


    // useEffect(() => {
    //     setUserInfo(user)
    // }, [user])



    
    const onChange = (value:any) => {
        console.log("onChange: ", value)

        setData(JSON.stringify(value, null, 2))
        console.log("App onChange:", stringifiedData)

        return updateUser({userId:userid, data:value})
    }

    const onCancel = () => {
        router.back()
        // router.push({
        //     pathname: '/projects/[projectid]',
        //     query: { projectid: projectid },                                         
        // })
    }


    const formButtons = {
        submit:'Update'

    }



const formatData = (user:User) => {
    console.log("formatData(user =", user );


    const updatedForm = forms
    
    const form : any = []
        form['forms']=updatedForm
        form['value']=user
        form['title']='User'
        form['subtitle']='Fill all the mandatory fields.'

    return form;
}

const showForm = (user:User|any) => {

        if (isLoading) return <MySpinner />;
        if (isError) return <ErrorComponent error={isError} />;
        if (!user) return <ErrorComponent error="User not found" />

        // if ( ! user) return <ErrorComponent error={isError} />

        // else {
        const form = formatData(user)

        return (
            <MyForm
                {...form} 
                onChange={onChange}
                onCancel={onCancel}
                button={formButtons}
            />
        )
        // }
    }


    return (
        <>
            {showForm(user)}
        </>
    );
}

export default UserForm;
