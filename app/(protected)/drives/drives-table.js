"use client"

import React, { useState } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";
// import { Button } from "@mui/material";
// import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/api/key';
import { useRouter } from "next/navigation";



const columns = [
    {name: "ID", uid: "id"},
    {name: "NAME", uid: "name"},
    {name: "URL", uid: "url"},

    {name: "ACTIONS", uid: "actions"},
  ];

export function DrivesTable(props) {
    const {drives=[]} = props
    const router = useRouter();

    // console.log("ProjectsTable( projects= ",projects,")")

    const updateddata = drives.map( (drive) => { drive['key']=drive.id ; return drive; } )
    // console.log("updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)
    
 
    const renderCell = React.useCallback((drive, columnKey) => {

        // console.log("render cell :columnKey ", columnKey); 

        const cellValue = drive[columnKey];

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
        case "url":
                return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            

        case "actions":
            // console.log("build action: ", project)
            return (
            <div className="relative flex items-center gap-2" key={key(drive.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat"
                    size="sm"
                    color="primary" 
                    disableRipple
                    as={Link}
                    href={`/drives/${drive.id}`}
                >
                    Details
                </Button>
            </div>
            );
            
        default:
            return cellValue;
        }
    }, []);


    return (
        <Table aria-label="Drives">
        <TableHeader columns={columns}>
            {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
            </TableColumn>
            )}
        </TableHeader>
        <TableBody items={drives}>
            {(item) => (
            <TableRow key={key(item.id, "tr")}>
                {(columnKey) => <TableCell key={key(item.id, columnKey)}>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
}
