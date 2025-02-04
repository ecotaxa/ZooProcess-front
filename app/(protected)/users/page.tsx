"use client";

import { useUsers } from "@/app/api/user";
import { ErrorComponent } from "@/components/ErrorComponent";
import { MySpinner } from "@/components/mySpinner";
import { useEffect, useState } from "react";
import { UsersTable } from "./users-table";
import { Button, Card, CardBody, CardHeader, Spacer } from "@nextui-org/react";
import Link from "next/link";

const Users = () => {


    const formatData = (data:any) => {
        const fdata = data.map( (mdata:any) => {
            // const createdAt = new Date(metadata.createdAt)
            // console.log("createdAt: ", createdAt)

            // ici les colonnes qui m'interresse pour mon tableau
            return {
                id: mdata.id,
                name: mdata.name,
                email: mdata.email,
                role: mdata.role,
            }
        });
    
        console.log(fdata);
        return fdata;
    }


    const { users, isLoading, isError } = useUsers()
    const [ userList, setUserList ] = useState([users])

    useEffect( () => { 
        if ( Object.keys(users).length == 0) return;

        console.log("user have changed (only useful columns for the table)", users);
        const data = formatData(users)
        setUserList(data);
      } , [users])

    const ShowData = () => {
        if (isLoading) return <MySpinner />
        if (isError) {
            console.error("isError: ", isError)
             return <ErrorComponent error={isError}/>
        }
        return <UsersTable users={userList}/>
    };


return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
            <h4 data-testid="title">
                Users
            </h4>
            <Spacer y={5}/>
            <Card className="inline-block "
                data-testid="dataCard" 
                >
                <CardHeader className="flex flex-row-reverse py-3">
                    <Button 
                        href="users/new"
                        as={Link}
                        color="primary"
                        variant="solid"
                        data-testid="newBtn"
                        >Add new user</Button>
                </CardHeader>
                <CardBody>
                    <ShowData/>
                </CardBody>

            </Card> 
        </div>
    </section>
);


}

export default Users;
