import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@mui/material";

import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';

import { Debug } from '@/components/Debug';

const columns = [
    {name: "ID", uid: "id"},
    // {name: "DRIVE", uid: "drive"},
    {name: "NAME", uid: "name"},
    {name: "CREATOR", uid: "creator"},
    // {name: "SAMPLE", uid: "background"},
    // {name: "SCAN", uid: "scan"},
    // {name: "FRACTION/SUBSAMPLE", uid:"fraction"},
    // {name: "CREATE AT", uid: "createdAt"},
    // {name: "UPDATED AT", uid: "updatedAt"},
    {name: "Time", uid: "time"},
    {name: "DATE", uid: "date"},
    {name: "QC", uid: "status"},
    {name: "ACTION", uid: "action"},
  ];

export function BackgroundTable(props:{projectId:String, backgrounds:any}) {
    const {projectId, backgrounds=[]} = props

    console.log("BackgroundsTable projectId= ", projectId);
    console.log("BackgroundsTable backgrounds= ", backgrounds);

    const updateddata = backgrounds.map( (background) => { 
        console.debug("background: ",background)    
        background['key']=background.id ; return background;
    } )
    console.log("BackgroundTable updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)


    const StatusString = (status:string) => {
        console.log("Status: ", status);
        switch (status) {
            case "TODO":
            case undefined: return "Not Done";
            case "FULLY_SCANNED": return "fully scanned";
            case "NOT_FULLY_SCANNED": return "not fully scanned";
            case "PROCESS": return "process";
            case "PROPORTION_OF_MULTIPLE": return "proportion of multiple";
            default: return "Error";
        }
    }


    // const onDetail = (projectId,sampleid) => {
    //     router.push({
    //         pathname: '/projects/[pid]/backgrounds/[sid]',
    //             query: { pid: projectId , sid: sampleid },                                         
    //     })
    // }


    const renderCell = React.useCallback((background, columnKey) => {

        console.log("render cell :columnKey ", columnKey); 

        const cellValue = background[columnKey];

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
            
        // case "background":
        //         return (
        //             <div className="flex flex-col" >
        //                 <p className="text-bold text-sm capitalize">{cellValue}</p>
        //             </div>
        //         );        
        case "creator":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            
        case "date":
                    console.log("createdAt - createdAt")
                return (
                    <div className="flex flex-col" >
                        <p className="text-bold text-sm capitalize">{formatDate(cellValue)}</p>
                    </div>
                );

        case "time":
        return (
            <div className="flex flex-col" >
                <p className="text-bold text-sm capitalize">{formatTime(cellValue)}</p>

            </div>
        );    

        case "qc":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{StatusString(cellValue)}</p>
                </div>
            );   

        case "action":
            return (
            <div className="relative flex items-center gap-2" key={key(background.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat" 
                    size="sm" 
                    color="primary" 
                    as={Link}
                    href={`/projects/${projectId}/backgrounds/${background.id}`}
                    // onPress={ (projectid,sampleid=background.id) => onDetail(projectid,sampleid) }                
                >
                    EYE
                </Button>
            </div>
            );
            
        default:
            return cellValue;
        }
    }, []);



  return (
    <>
    <Debug params={props} />
    <Table aria-label="Projects">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={backgrounds}>
        {(item) => (
          <TableRow key={key(item.id,"tr")}>
            {(columnKey) => <TableCell key={key(item.id,columnKey)}>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </>
  );
}
