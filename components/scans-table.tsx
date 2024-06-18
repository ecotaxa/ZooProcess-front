import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@mui/material";

import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';
import {useAsyncList} from "@react-stately/data";

import { Debug } from '@/components/Debug';

interface IColumn {
    name: string,
    uid: string
    allowSorting?: boolean
}

const columns : Array<IColumn> = [
    {name: "ID", uid: "id", allowSorting:true },
    // {name: "DRIVE", uid: "drive"},
    {name: "NAME", uid: "name", allowSorting:true},
    {name: "CREATOR", uid: "creator", allowSorting:true},
    // {name: "SAMPLE", uid: "scan"},
    // {name: "SCAN", uid: "scan"},
    // {name: "FRACTION/SUBSAMPLE", uid:"fraction"},
    // {name: "CREATE AT", uid: "createdAt"},
    // {name: "UPDATED AT", uid: "updatedAt"},
    // {name: "Time", uid: "time"},
    // {name: "DATE", uid: "date"},

    {name: "Fraction id", uid: "fraction_id", allowSorting:true},
    {name: "Frac min", uid: "frac_min", allowSorting:true},
    {name: "Frac sup", uid: "frac_sup", allowSorting:true},
    {name: "Observation", uid: "observation", allowSorting:true},

    {name: "QC", uid: "qc", allowSorting:true},
    {name: "ACTION", uid: "action", allowSorting: false},
  ];

export function ScanTable(props:{projectId:String, scans:any}) {
    const {projectId, scans=[]} = props
    const stripped = true;

    console.log("ScanTable projectId= ", projectId);
    console.log("ScanTable scans= ", scans);

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
                items: scans,
                // items: updateddata,
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

    const updateddata = scans.map( (scan:any) => { 
        console.debug("scan: ",scan)    
        scan['key']=scan.id ; return scan;
    } )

    console.log("ScanTable updateddata: ", updateddata)
    
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
    //         pathname: '/projects/[pid]/scans/[sid]',
    //             query: { pid: projectId , sid: sampleid },                                         
    //     })
    // }


    const renderCell = React.useCallback((scan:any, columnKey:any) => {

        console.log("render cell :columnKey ", columnKey); 

        const cellValue = scan[columnKey];

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
            
        // case "scan":
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
            
        // case "date":
        //             console.log("createdAt - createdAt")
        //         return (
        //             <div className="flex flex-col" >
        //                 <p className="text-bold text-sm capitalize">{formatDate(cellValue)}</p>
        //             </div>
        //         );

        // case "time":
        // return (
        //     <div className="flex flex-col" >
        //         <p className="text-bold text-sm capitalize">{formatTime(cellValue)}</p>

        //     </div>
        // );    

        case "qc":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{StatusString(cellValue)}</p>
                </div>
            );   

        case "action":
            return (
            <div className="relative flex items-center gap-2" key={key(scan.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat" 
                    size="sm" 
                    color="primary" 
                    as={Link}
                    href={`/projects/${projectId}/scans/${scan.id}`}
                    // onPress={ (projectid,sampleid=scan.id) => onDetail(projectid,sampleid) }                
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
    <Table
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort} 
        isStriped={stripped} 
        aria-label="Sample Scan Table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowSorting}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      {/* <TableBody items={scans}> */}
      <TableBody items={list.items}>
        {(item:any) => (
          <TableRow key={key(item.id,"tr")}>
            {(columnKey) => <TableCell key={key(item.id,columnKey)}>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </>
  );
}

