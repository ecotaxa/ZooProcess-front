"use client";

import { Debug } from "@/components/Debug"
import { Timeline_scan } from "@/components/timeline-scan";
import { Button, Card, CardBody, CardFooter, getKeyValue } from "@nextui-org/react";
import { FC } from "react"
// import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
import { MySelect } from "@/components/mySelect5";
// import { useProject } from "@/app/api/projects";
// import { MySpinner } from "@/components/mySpinner";
// import { ErrorComponent } from "@/components/ErrorComponent";

import React from "react";

import { useBackgrounds } from '@/app/api/background';
import { MySpinner } from "@/components/mySpinner";
import { ErrorComponent } from "@/components/ErrorComponent";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@nextui-org/react";
import { map } from "zod";
import { Background } from "@/app/api/network/zooprocess-api";
import { useProject } from "@/app/api/projects";


type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}



const InfoPage : FC<pageProps> = ({params}) => {

    const router = useRouter();
    const { projectid, sampleid, subsampleid } = params

    const { backgrounds, isLoading, isError } = useBackgrounds(projectid);

    // const { project, isLoading: isProjLoading, isError: isProjError } = useProject(projectid);

    const selectColor = "success"

    function onPress() {
        // router.push("../scan");
        const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${subsampleid}/scan`
        router.push(path)
    }

    // const makeRow = (backgrounds: Array<Background>) => {

    //     return (

    //         {
    //             backgrounds.map( (background: Background) => {
    //                 return (   
    //                     <TableRow key={background.id}>
    //                         <TableCell>{background.createdAt}</TableCell>
    //                         <TableCell>{background.user.name}</TableCell>
    //                         <TableCell>{background.url}</TableCell>
    //                         <TableCell>Yes or no </TableCell>
    //                         <TableCell>{background.instrument.name}</TableCell>
    //                     </TableRow>
    //                 )
    //             })
    //         }

    //     )
    // }

    // let rows : any[] = [{}]
    let columns = [
        {
            key: "createdAt",
            label: "Date",
        },
        {
            key: "user",
            label:"Operator",
        },
        {
            key: "url",
            label: "File",
        },
        // {
        //     key: "associated",
        //     label: "Associated",
        // },
        {
            key: "instrument",
            label: "Instrument",
        },
    ]

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["1","2"]));


    const ShowData = () => {
        if (isLoading)
            return 
            (
                // <Table aria-label="Backgrounds associated to the instrument"
                //     color="secondary"
                //     selectionMode="multiple" 
                // >              
                // <TableHeader columns={columns}>
                //     {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                // </TableHeader>
                // <TableBody 
                //     emptyContent={ () => { return (<MySpinner />)}    }>{[]}
                // </TableBody>
                // </Table>
                <MySpinner />
            )

        if (isError) return <ErrorComponent error={isError}/>

        // const colors = ["default", "primary", "secondary", "success", "warning", "danger"];
        // const [selectedColor, setSelectedColor] = React.useState("default");
      
        const rows = backgrounds.map( (background: Background) => {
            return {
                key: background.id,
                createdAt: background.createdAt,
                // associated: "Yes ou No",
                url: background.url,
                instrument: background.instrument.name,
                user: background.user.name,
            }
        })

        return (
            <Table aria-label="Backgrounds associated to the instrument"
                color={selectColor}
                selectionMode="multiple" 
                // defaultSelectedKeys={["1", "2"]}
                // disallowEmptySelection
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
            >              
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody 
                    emptyContent={"No background scan"}
                    items={rows}>
                    {(item) => (
                    <TableRow key={item.key}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                    )}
                </TableBody>
            </Table>
          );

        // return (
        //     <div className="flex flex-col gap-3">
        //         <Table 
        //             color="secondary"
        //             selectionMode="multiple" 
        //             defaultSelectedKeys={["2", "3"]} 
        //             aria-label="Example static collection table"
        //         >
        //             <TableHeader>
        //             <TableColumn>Date</TableColumn>
        //             <TableColumn>Operator</TableColumn>
        //             <TableColumn>Fichier</TableColumn>
        //             <TableColumn>Associated</TableColumn>
        //             <TableColumn>Intrument</TableColumn>
        //             </TableHeader>
        //             <TableBody>
        //             {
        //                 backgrounds.map( (background: Background) => {
        //                 return (   
        //                     <TableRow key={background.id}>
        //                         <TableCell>{background.createdAt}</TableCell>
        //                         <TableCell>{background.user.name}</TableCell>
        //                         <TableCell>{background.url}</TableCell>
        //                         <TableCell>Yes or no </TableCell>
        //                         <TableCell>{background.instrument.name}</TableCell>
        //                     </TableRow>
        //                 )
        //                 })
        //             }
        //             </TableBody>
        //         </Table>

        //         {/* <RadioGroup 
        //             label="Selection color"
        //             orientation="horizontal"
        //             value={selectedColor} 
        //             onValueChange={setSelectedColor}
        //         >
        //             {colors.map((color) => (
        //             <Radio
        //                 key={color}
        //                 color={color}  
        //                 value={color}
        //                 className="capitalize"
        //             >
        //                 {color}
        //             </Radio>  
        //             ))}
        //         </RadioGroup> */}
        //     </div>
        // )
    }

    const Intrument = () => {

        let instrument = undefined
        if ( backgrounds && backgrounds.length > 0){
            instrument = backgrounds[0].instrument
        }

        return (
            <div>
                <p>Intrument: {instrument?.model} {instrument?.sn}</p>
            </div>
        )
    }

    return (
        <>
        <Timeline_scan current={2.0} />

        <div><b>project Id: </b> {projectid}</div>
        <div><b>sample Id: </b> {sampleid}</div>
        <div><b>subsample Id: </b> {subsampleid}</div>
        {/* <div><b>instrument Id: </b> {instrumentid}</div> */}
        <Intrument />


        <div className="text-start w-">
            <h1>Selectionner le background</h1>
            <Debug params={selectedKeys} />
            <ShowData />
        </div>
        <div>
            <Button onPress={onPress} color="primary">SELECT</Button>
        </div>
        </>
    )

}


export default InfoPage;
