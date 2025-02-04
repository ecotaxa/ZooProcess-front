"use client"

import React, { useState } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip} from "@nextui-org/react";
// import { Button } from "@mui/material";
// import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/api/key';
import { useRouter } from "next/navigation";
import { EditIcon } from '@/components/icons/EditIcon';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';


const columns = [
    {name: "ID", uid: "id", allowSorting:true},
    {name: "EMAIL", uid: "email", allowSorting:true},
    {name: "NAME", uid: "name", allowSorting:true},
    {name: "ROLE", uid: "role", allowSorting:true},

    {name: "ACTIONS", uid: "actions"},
  ];

export function UsersTable(props:any) {
    const {users=[]} = props
    const router = useRouter();

    // console.log("ProjectsTable( projects= ",projects,")")

    const updateddata = users.map( (user:any) => { user['key']=user.id ; return user; } )
    // console.log("updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)
    
 
    const renderCell = React.useCallback((user:any, columnKey:string) => {

        console.debug("render cell :columnKey ", columnKey , " = ", user[columnKey]); 

        const cellValue = user[columnKey];

        switch (columnKey) {
        case "id":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
        case "name":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            case "email":
                return (
                    <div className="flex flex-col" >
                        <p className="text-bold text-sm capitalize">{cellValue}</p>
                    </div>
                );
            case "role":
                return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            

        case "actions":
            // console.log("build action: ", project)
            return (
            <div className="relative flex items-center gap-2" key={key(user.id,'action')}>
                <Tooltip content="Detail">
                <Link 
                    data-testid="action_btn"
                    size="sm"
                    color="primary" 
                    as={Link}
                    href={`/users/${user.id}/?view`}
                >
             <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon/>
              </span>
                </Link>
                </Tooltip>
                <Tooltip content="Edit user">
                <Link 
                    data-testid="action_btn"
                    size="sm"
                    color="primary" 
                    as={Link}
                    href={`/users/${user.id}/?edit`}
                >
             <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon/>
              </span>
                </Link>
                </Tooltip>
                <Tooltip  color="danger" content="Delete user">
                <Link 
                    data-testid="action_btn"
                    size="sm"
                    color="primary" 
                    as={Link}
                    href={`/users/${user.id}`}
                >
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon/>
              </span>
                </Link>
                </Tooltip>
            </div>
            );
            
        default:
            return cellValue;
        }
    }, []);


    return (
        <Table aria-label="Users">
        <TableHeader columns={columns}>
            {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
            </TableColumn>
            )}
        </TableHeader>
        <TableBody items={users}>
            {(item:any) => (
            <TableRow key={key(item.id, "tr")}>
                {(columnKey) => <TableCell key={key(item.id, columnKey)}>{renderCell(item, columnKey.toString())}</TableCell>}
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
}
