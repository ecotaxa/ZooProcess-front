"use client"

import React, { useState } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
// import { Button } from "@mui/material";
import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';
import { useRouter } from "next/navigation";



const columns = [
    {name: "ID", uid: "id"},
    {name: "NAME", uid: "name"},
    {name: "DESCRIPTION", uid: "description"},
    // {name: "SAMPLES", uid: "samplecount"},
    // {name: "SUBSAMPLES", uid:"subsamplecount"},
    {name: "CREATED AT", uid: "createdAt"},
    {name: "ACTIONS", uid: "actions"},
  ];

export function MetadataTable(props) {
    const {metadata=[]} = props
    const router = useRouter();

    // console.log("ProjectsTable( projects= ",projects,")")

    const updateddata = metadata.map( (metadata) => { metadata['key']=metadata.id ; return metadata; } )
    // console.log("updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)
    
 
    const renderCell = React.useCallback((metadata, columnKey) => {

        // console.log("render cell :columnKey ", columnKey); 

        const cellValue = metadata[columnKey];

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
        case "description":
                return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            
        // case "countsample":
        // case "countsubsample":
        //         return (
        //         <div className="flex flex-col" >
        //             <p className="text-bold text-sm capitalize">{cellValue}</p>
        //         </div>
        //     );        
            
        case "createdAt":
            // console.log("createdAt - createdAt")
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>
                </div>
            );

        case "actions":
            // console.log("build action: ", project)
            return (
            <div className="relative flex items-center gap-2" key={key(metadata.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat"
                    size="sm"
                    color="primary" 
                    disableRipple
                    as={Link}
                    href={`/metadata/${metadata.id}`}
                    // onPress={ () => onDetail(project.id)}
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
        <Table aria-label="Metadata">
        <TableHeader columns={columns}>
            {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
            </TableColumn>
            )}
        </TableHeader>
        <TableBody items={metadata}>
            {(item) => (
            <TableRow key={key(item.id, "tr")}>
                {(columnKey) => <TableCell key={key(item.id, columnKey)}>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
}
