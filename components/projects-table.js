"use client"

import React, { useState } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
// import { Button } from "@mui/material";
import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';
import { useRouter } from "next/navigation";
import { useAsyncList } from "react-stately";


// interface IColumn {
//   name: string,
//   uid: string
//   allowSorting?: boolean
// }

const columns /*: Array<IColumn>*/ = [
    {name: "ID", uid: "id", allowSorting:true},
    {name: "DRIVE", uid: "drive", allowSorting:true},
    {name: "NAME", uid: "name", allowSorting:true},
    {name: "SAMPLE", uid: "sample", allowSorting:true},
    {name: "SCAN", uid: "scan", allowSorting:true},
    {name: "CREATE AT", uid: "createdAt", allowSorting:true},
    {name: "UPDATED AT", uid: "updatedAt", allowSorting:true},
    {name: "QC", uid:"qc", allowSorting:true},
    {name: "ACTIONS", uid: "actions", allowSorting:false},
  ];

export function ProjectsTableNextUI(props) {
    const {projects=[]} = props
    const router = useRouter();
    const stripped = true;

    // console.log("ProjectsTable( projects= ",projects,")")

    let list = useAsyncList({
        async load({signal}) {
        //   let res = await fetch('https://swapi.py4e.com/api/people/?search', {
        //     signal,
        //   });
        //   let json = await res.json();
        //   setIsLoading(false);
    
        //   return {
        //     items: json.results,
        //   };
            return {
                items: projects,
            };
        },
        async sort({items, sortDescriptor}) {
            console.debug("sort: ",items, sortDescriptor)
          return {
            items: items.sort((a, b) => {
              let first = a[sortDescriptor.column];
              let second = b[sortDescriptor.column];
              let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
    
              console.debug("sort: ",first, second, cmp)
  
              if (sortDescriptor.direction === "descending") {
                cmp *= -1;
              }
    
              return cmp;
            }),
          };
        },
      });

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
        <Table 
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort} 
                isStriped={stripped} 
                aria-label="Project Table">
            <TableHeader columns={columns}>
                {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowSorting}>
                    {column.name}
                </TableColumn>
                )}
            </TableHeader>
            {/* <TableBody items={projects}> */}
            <TableBody items={list.items}>
                {(item) => (
                    <TableRow key={key(item.id,"tr")}>
                        {(columnKey) => <TableCell key={key(item.id,columnKey)}>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
