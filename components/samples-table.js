import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from "@heroui/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@mui/material";

import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/app/api/key';

import { Debug } from '@/components/Debug';
import { useAsyncList } from "react-stately";

// interface IColumn {
//   name: string,
//   uid: string
//   allowSorting?: boolean
// }

const columns /*: Array<IColumn>*/ = [
    // {name: "ID", uid: "id", allowSorting:true},
    // {name: "DRIVE", uid: "drive"},
    {name: "NAME", uid: "name", allowSorting:true},
    // {name: "SAMPLE", uid: "sample"},
    {name: "SCAN", uid: "scans", allowSorting:true},
    {name: "FRACTION/SUBSAMPLE", uid:"fraction", allowSorting:true},
    {name: "CREATED AT", uid: "createdAt", allowSorting:true},
    {name: "UPDATED AT", uid: "updatedAt", allowSorting:true},
    {name: "STATUS", uid: "status", allowSorting:true},
    {name: "ACTIONS", uid: "actions", allowSorting:false},
  ];

export function SamplesTableNextUI(props) {
    const {projectId, samples=[]} = props
    const stripped = true;

    console.log("SamplesTable projectId= ", projectId);
    console.log("SamplesTable samples= ", samples);

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
              items: samples,
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


    const updateddata = samples.map( (sample) => { sample['key']=sample.id ; return sample;} )
    console.log("SamplesTableNextUI updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)

    const StatusString = (status) => {
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
    //         pathname: '/projects/[pid]/samples/[sid]',
    //             query: { pid: projectId , sid: sampleid },                                         
    //     })
    // }


    const renderCell = React.useCallback((sample, columnKey) => {

        console.log("render cell :columnKey ", columnKey); 

        const cellValue = sample[columnKey];

        switch (columnKey) {
        case "id":
            return (
            <div className="flex flex-col" >
                <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
            );
        // case "drive":
        //     return (
        //     <div className="flex flex-col">
        //         <p className="text-bold text-sm capitalize">{cellValue}</p>
        //     </div>
        //     );
            
        case "name":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            
        // case "sample":
        //         return (
        //             <div className="flex flex-col" >
        //                 <p className="text-bold text-sm capitalize">{cellValue}</p>
        //             </div>
        //         );        
        // case "scan":
        //     return (
        //         <div className="flex flex-col" >
        //             <p className="text-bold text-sm capitalize">{cellValue}</p>
        //         </div>
        //     );
            
        case "createdAt":
        case "updatedAt":
        console.log("createdAt / updatedAt")
                return (
                    <div className="flex flex-col" >
                        <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>
                    </div>
                );

        // case "updatedAt":
        // return (
        //     <div className="flex flex-col" >
        //         <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>

        //     </div>
        // );    

        // case "status":
        //     return (
        //         <div className="flex flex-col" >
        //             <p className="text-bold text-sm capitalize">{StatusString(cellValue)}</p>
        //         </div>
        //     );   

        case "actions":
            return (
            <div className="relative flex items-center gap-2" key={key(sample.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat" 
                    size="sm" 
                    color="primary" 
                    as={Link}
                    href={`/projects/${projectId}/samples/${sample.id}`}
                    // onPress={ (projectid,sampleid=sample.id) => onDetail(projectid,sampleid) }                
                >
                    Scan Sub-Sample
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
        aria-label="Sample Table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowSorting}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      {/* <TableBody items={samples}> */}
      <TableBody items={list.items}>
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
