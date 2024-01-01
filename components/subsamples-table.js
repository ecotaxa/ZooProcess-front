import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@mui/material";

// import { formatDate , formatTime }  from '@/api/formatDateAndTime.js';
import { key } from '@/api/key';

import { Debug } from '@/Components/Debug';

const columns = [
    // {name: "ID", uid: "id"},
    // {name: "DRIVE", uid: "drive"},
    {name: "NAME", uid: "name"},
    // {name: "SAMPLE", uid: "sample"},
    {name: "SCAN OPERATOR", uid: "operator"},
    {name: "FRACTION ID", uid:"fractionId"},
    {name: "FRAC MIN", uid: "fracmin"},
    {name: "FRAC SUP", uid: "fracsup"},
    {name: "OBSERVATION", uid: "obs"},
    {name: "QC", uid: "qc"},
    {name: "ACTIONS", uid: "actions"},
  ];

export function SubSamplesTable(props) {
    const {projectId, sampleId, subsamples=[]} = props

    console.log("SubSamplesTable projectId= ", projectId);
    console.log("SubSamplesTable sampleId= ", sampleId);
    console.log("SubSamplesTable subsamples= ", subsamples);

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
            
        case "fractionid":
        case "fracsup":
        case "fracmin":
        case "obs":
        return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
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
    <Table aria-label="Projects">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={subsamples}>
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
