import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link, Tooltip } from "@heroui/react";

import { key } from '@/api/key';
import { IMetadata, IScan, Sample } from '@/app/api/network/interfaces';

import { Debug } from '@/components/Debug';
import { useAsyncList } from "react-stately";
import { sub } from "date-fns";
import { EyeIcon } from "./icons/EyeIcon";

/// Documentation for the columns array
// interface IColumn {
//   name: string,
//   uid: string
//   allowSorting?: boolean
// }

const columns /*: Array<IColumn>*/ = [
    {name: "ID", uid: "id", allowSorting:true},
    {name: "NAME", uid: "name", allowSorting:true},
    {name: "SCAN OPERATOR", uid: "operator", allowSorting:true},
    {name: "FRACTION ID", uid:"fraction_id", allowSorting:true},
    {name: "FRAC MIN", uid: "fraction_min_mesh", allowSorting:true},
    {name: "FRAC SUP", uid: "fraction_max_mesh", allowSorting:true},
    {name: "OBSERVATION", uid: "observation", allowSorting:true},
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


    const QCString = (status) => {
        console.log("QC: ", status);
        switch (status) {
            case "TODO":
            case "UNPROCESSED":
            case undefined: return "Unprocesssed";
            case "HIGH#MULTIPLE": return "High number of multiple";
            default: return "Error";
        }
    }


    function getScan(data/*:Array<IScan>*/, type/*:String*/="Scan") {
      console.log("getScan: ", data);
      const value = data.find( (m/*:IScan*/) => m.type == type)
      console.log("getScan value: ",  value);
      return value?.url || null
    }

    const renderCell = React.useCallback((sample, columnKey) => {

        console.log("render cell :subsample ", sample);
        console.log("render cell :columnKey ", columnKey);

        let cellValue = sample[columnKey]
        if ( cellValue == undefined ) {
          const subsample = sample.metadata.find((item) => item.name == columnKey);
          if ( subsample != undefined ) {
            console.log("render cell :subsample ", subsample.value);
            cellValue = subsample.value;
            console.log("render cell :cellValue ", cellValue);
          } else {
            if (columnKey == "operator") {
              cellValue = sample.user.name
            }
          }
        }


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
          
        case "fraction_id":
        case "fraction_id_suffix":
        case "fraction_max_mesh":
        case "fraction_min_mesh":
        case "observation":
          console.log("render cell: ", cellValue);
        return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm">{cellValue}</p>
                </div>
            );
  

        case "qc":
            return (
                <div className="flex flex-col" >
                    <p className="text-bold text-sm capitalize">{cellValue?QCString(cellValue):"TODO"}</p>
                </div>
            );   

        case "actions":

          let cellValue = sample["qc"]

         const scan = getScan(sample.scan, "Scan")
        //  console.log("render cell: ", cellValue);
         console.debug("render cell: ", scan);

          // let url = scan?.url
          let urlCheck = `/projects/${projectId}/samples/${sampleId}/subsamples/${sample.id}/check`
          let button = ""
          // switch ( cellValue ) {
          //   case "UNPROCESSED":
          let urlProcess = `/projects/${projectId}/samples/${sampleId}/subsamples/${sample.id}/process`
          button = "PROCESS"
          //     break;
          //   case "TODO":
          //   case undefined:
          //   default:
          //     url = `/projects/${projectId}/samples/${sampleId}/subsamples/new/${sample.id}?state=preview`
          //     button = "SCAN"
          //     break;
          //   case "DONE":
          //         url = `/projects/${projectId}/samples/${sampleId}/subsamples/${sample.id}/check`
          //         button = "VIEW"
          //     } 

              return (
              <div className="relative flex items-center gap-2" key={key(sample.id,'action')}>
                <Tooltip content="Detail">
                  <Link 
                      data-testid="detail_action_btn"
                      size="sm"
                      color="primary" 
                      as={Link}
                      href={`${urlCheck}`}
                  >
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <EyeIcon/>
                    </span>
                  </Link>
                </Tooltip>
                
                {button ? (<Button
                    data-testid="action_btn"
                    variant="flat"
                    size="sm"
                    color="primary"
                    as={Link}
                    href={urlProcess}
                >
                    {button}
              </Button>) : ""}
              </div>
              );
            
        default:
            // return cellValue;
            // Strange default do not work, even if the return is the same code used in the other cases upper
            // then simply add the case upper
            return (
              <div className="flex flex-col" >
                <p className="text-bold text-sm">{cellValue}</p>
              </div>
            ); 
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
