"use client"

import React, { useState } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
// import { Button } from "@mui/material";
import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';
import { useRouter } from "next/navigation";



const columns = [
    {name: "ID", uid: "id"},
    {name: "DRIVE", uid: "drive"},
    {name: "NAME", uid: "name"},
    {name: "SAMPLE", uid: "sample"},
    {name: "SCAN", uid: "scan"},
    {name: "CREATE AT", uid: "createdAt"},
    {name: "UPDATED AT", uid: "updatedAt"},
    {name: "QC", uid:"qc"},
    {name: "ACTIONS", uid: "actions"},
  ];

export function ProjectsTableNextUI(props) {
    const {projects=[]} = props
    const router = useRouter();

    // console.log("ProjectsTable( projects= ",projects,")")

    const updateddata = projects.map( (project) => { project['key']=project.id ; return project;} )
    // console.log("updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)


    const QCString = (qc) => {
        // console.log("QC: ", qc);
        switch (qc) {
            case "TODO":
            case undefined:
                    return "Not Done";
        }
    }
    
    // const onDetail = (projectId) => {
    //         router.push( `/projects/${projectId}/` )
    // }


    const renderCell = React.useCallback((project, columnKey) => {

        // console.log("render cell :columnKey ", columnKey); 

        const cellValue = project[columnKey];

        switch (columnKey) {
        case "id":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
        case "drive":
            return (
            <div className="flex flex-col">
                <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
            );
            
        case "name":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            
        case "sample":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );        
        case "scan":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            
        case "createdAt":
            // console.log("createdAt - createdAt")
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>
                </div>
            );

        case "updatedAt":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>
                </div>
            );    

        case "qc":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{QCString(cellValue)}</p>
                </div>
            );              

        case "actions":
            // console.log("build action: ", project)
            return (
            <div className="relative flex items-center gap-2" key={key(project.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat"
                    size="sm"
                    color="primary" 
                    disableRipple
                    as={Link}
                    href={`/projects/${project.id}`}
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
        <Table aria-label="Projects">
        <TableHeader columns={columns}>
            {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
            </TableColumn>
            )}
        </TableHeader>
        <TableBody items={projects}>
            {(item) => (
            <TableRow key={key(item.id,"tr")}>
                {(columnKey) => <TableCell key={key(item.id,columnKey)}>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
}
