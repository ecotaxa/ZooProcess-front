import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@mui/material";

// import { formatDate , formatTime }  from '@/api/formatDateAndTime.js';
import { key } from '@/api/key';

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
    {name: "SCAN OPERATOR", uid: "operator", allowSorting:true},
    {name: "FRACTION ID", uid:"fractionid", allowSorting:true},
    {name: "FRAC MIN", uid: "fracmin", allowSorting:true},
    {name: "FRAC SUP", uid: "fracsup", allowSorting:true},
    {name: "OBSERVATION", uid: "obs", allowSorting:true},
    {name: "QC", uid: "qc", allowSorting:true},
    {name: "ACTIONS", uid: "actions", allowSorting:false},
  ];

export function SubSamplesTable(props) {
    const {projectId, sampleId, subsamples=[]} = props
    const stripped = true;

    console.log("SubSamplesTable projectId= ", projectId);
    console.log("SubSamplesTable sampleId= ", sampleId);
    console.log("SubSamplesTable subsamples= ", subsamples);

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
              items: subsamples,
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

    const updateddata = subsamples.map( (sample) => { sample['key']=sample.id ; return sample;} )
    console.log("SubSamplesTable updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)



    const QCString = (status) => {
        console.log("QC: ", status);
        switch (status) {
            case "TODO":
            case "UNPROCESSED":
            case undefined: return "Unprocesssed";
            case "HIGHN#MULTIPLE": return "High number of multiple";
            default: return "Error";
        }
    }



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
            
        case "name":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                </div>
            );
            
                    
        case "operator":
          return (
              <div className="flex flex-col" >
                  <p className="text-bold text-sm capitalize">{cellValue}</p>
              </div>
          );
          
        case "fractionid":
        case "fracsup":
        case "fracmin":
        case "obs":
        return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm">{cellValue}</p>
                </div>
            );
  

        case "qc":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{QCString(cellValue)}</p>
                </div>
            );   

        case "actions":
            return (
            <div className="relative flex items-center gap-2" key={key(sample.id,'action')}>
                <Button 
                    data-testid="action_btn"
                    variant="flat" 
                    size="sm" 
                    color="primary" 
                    as={Link}
                    href={`/projects/${projectId}/samples/${sampleId}/subsamples/${sample.id}`}
                    // onPress={ (projectid,sampleid=sample.id) => onDetail(projectid,sampleid) }                
                >
                    Sub-Sample Detail
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
        aria-label="Sub-Sample Table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.allowSorting}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      {/* <TableBody items={subsamples}> */}
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
