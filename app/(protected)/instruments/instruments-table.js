"use client"

import React, { useState } from "react";
import { Button, Link, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
// import { Button } from "@mui/material";
// import { formatDate , formatTime }  from '@/app/api/formatDateAndTime.js';
import { key } from '@/api/key';
import { useRouter } from "next/navigation";
import { useAsyncList } from "react-stately";

// interface IColumn {
//   name: string,
//   uid: string
//   allowSorting?: boolean
// }

const columns  /*: Array<IColumn>*/ = [
    {name: "ID", uid: "id", allowSorting:true},
    {name: "NAME", uid: "name", allowSorting:true},
    {name: "MODEL", uid: "model", allowSorting:true},
    {name: "SN", uid: "sn", allowSorting:true},

    {name: "ACTIONS", uid: "actions", allowSorting:false},
  ];

export function InstrumentsTable(props) {
    const {instruments=[]} = props
    const router = useRouter();
    const stripped = true;


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
                items: instruments,
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

      
    // console.log("ProjectsTable( projects= ",projects,")")

    const updateddata = instruments.map( (instrument) => { instrument['key']=instrument.id ; return instrument; } )
    // console.log("updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)
    
 
    const renderCell = React.useCallback((instrument, columnKey) => {

        // console.log("render cell :columnKey ", columnKey); 

        const cellValue = instrument[columnKey];

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
        case "model":
                return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
        case "sn":
                return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            

        case "actions":
            // console.log("build action: ", project)
            return (
            <div className="relative flex items-center gap-2" key={key(instrument.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat"
                    size="sm"
                    color="primary" 
                    disableRipple
                    as={Link}
                    href={`/instruments/${instrument.id}`}
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
            aria-label="Drives">
        <TableHeader columns={columns}>
            {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowSorting}>
                {column.name}
            </TableColumn>
            )}
        </TableHeader>
        {/* <TableBody items={instruments}> */}
        <TableBody items={list.items}>
            {(item) => (
            <TableRow key={key(item.id, "tr")}>
                {(columnKey) => <TableCell key={key(item.id, columnKey)}>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
            )}
        </TableBody>
        </Table>
    );
}
