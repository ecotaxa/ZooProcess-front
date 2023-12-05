import React, { useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { useRouter } from "next/router";
import { Button } from "@mui/material";





const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const columns = [
    {name: "ID", uid: "id"},
    {name: "DRIVE", uid: "drive"},
    {name: "NAME", uid: "name"},
    {name: "SAMPLE", uid: "sample"},
    {name: "SCAN", uid: "scan"},
    {name: "CREATE AT", uid: "createdAt"},
    {name: "UPDATED AT", uid: "updatedAt"},
    {name: "ACTIONS", uid: "actions"},
  ];

export function ProjectsTableNextUI(props) {
    const {projects=[]} = props
    // const apiRef = useGridApiRef();
    const router = useRouter()
    console.log("ProjectsTable( projects= ",projects,")")

    // const [rows, setRows] = useState(projects)
    const updateddata = projects.map( (project) => { project['key']=project.id ; return project;} )
    console.log("updateddata: ",updateddata)
    const [rows, setRows] = useState(updateddata)


    const formatDate = (date) => {
        console.log("--- date:",date);
        let localdate = "date";
        const locale = "fr-FR";
        try {
            // localdate = new Date(date).toLocaleString();
            let dayoptions = {
                // weekday: "long",
                year: "numeric",
                month: "numeric",
                day: "numeric",
            };
            // let day = new Date(date).toLocaleString(locale,dayoptions);
            // let time=new Date(date).toLocaleTimeString();
            // localdate = day+"<br/>"+time
            localdate = new Date(date).toLocaleString(locale,dayoptions);
            console.log("formatDate date:",localdate);
        } catch (error) {
            console.error(error);
            localdate = "NaN";
        }
        return localdate;
    }


    const formatTime = (date) => {
        console.log("--- time:",date);
        let localdate = "time";
        const locale = "fr-FR";
        try {
            
            localdate=new Date(date).toLocaleTimeString();
            console.log("formatTime time:",localdate);
        } catch (error) {
            console.error(error);
            localdate = "NaN";
        }
        return localdate;
    }

    const key = (id/*:string*/,txt) => {
        const k = ""+id+"."+txt 
        return k
    }
    const renderCell = React.useCallback((project, columnKey) => {

        console.log("render cell :columnKey ", columnKey); 

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
                    console.log("createdAt - createdAt")
                return (
                    <div className="flex flex-col" >
                        {/* <p className="text-bold text-sm capitalize">{ formatDate(cellValue)}</p> */}
                        <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>
                    </div>
                );

                case "updatedAt":
                return (
                    <div className="flex flex-col" >
                        <p className="text-bold text-sm capitalize">{formatDate(cellValue)}<br/>{formatTime(cellValue)}</p>

                    </div>
                );    

        case "actions":
            return (
            <div className="relative flex items-center gap-2" key="{key(project.id,'action')}">
                <Button 
                    data-testid="action_btn"
                    variant="contained" 
                    size="small" 
                    color="primary" 
                    disableRipple
                    onClick={() => 
                        router.push({
                            pathname: '/projects/[pid]',
                            query: { pid: project.id },                                         
                        })
                    }
                >
                    Details
                </Button>
            </div>
            );
            
        default:
            return cellValue;
        }
    }, []);

    // const key = (item, txt) => {

    //     const k = str(item.id) + "." + txt
        
    //     return k
    // }

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
