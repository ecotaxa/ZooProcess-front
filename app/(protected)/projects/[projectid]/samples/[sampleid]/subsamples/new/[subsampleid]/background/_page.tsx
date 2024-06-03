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

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio} from "@nextui-org/react";
// import { map } from "zod";
import { Background } from "@/app/api/network/zooprocess-api";

import { useAsyncList } from "@react-stately/data";


type pageProps = {
    params:{
        projectid: string,
        sampleid: string,
        subsampleid: string,    
    }
}

// pick background to use in a list and/or button to scan a new one
// need to choose 2 background scans
const BackgroundPage : FC<pageProps> = ({params}) => {

    const router = useRouter();
    const { projectid, sampleid, subsampleid } = params

    // const { backgrounds, isLoading, isError } = useBackgrounds(projectid);

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
            sort: true
        },
        {
            key: "user",
            label:"Operator",
            sort: false
        },
        {
            key: "url",
            label: "File",
            sort: false
        },
        // {
        //     key: "associated",
        //     label: "Associated",
        // },
        // {
        //     key: "instrument",
        //     label: "Instrument",
        //     sort: false
        // },
    ]

    const [selectedKeys, setSelectedKeys] = React.useState(new Set());

    const [isLoading, setIsLoading] = React.useState(true);


    const baseURL = "http://zooprocess.imev-mer.fr:8081/v1"

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGRkN2VhMjRiYzEwYTRiZjFlMzdlMiIsImlhdCI6MTcwODA3OTQzNywiZXhwIjoxNzA4MzM4NjM3fQ.TJb59x0v4M6a8Up0pos9sKzjOM6fae6cPxpZ_lS1T9Q"

    let defaultSelectedKeys : Set<string> = new Set()

    const onSelected = (event: any) => {

        console.log("typeof event", typeof( event) )

        console.log("event", event)
        // console.log("event.target.value", event.target.value)
        // console.log("event.target.checked", event.target.checked)

        // const selected = { ...selectedKeys, [event.target.value]: event.target.checked }
        // const selected = { ...selectedKeys  }

        // setSelectedKeys(selected)
    }



    let list = useAsyncList({
        async load({signal}) {
            let res = await fetch(`${baseURL}/projects/${projectid}/backgrounds`, {
                signal,
                headers: {Authorization: `Bearer ${token}`}
            });
            let backgrounds = await res.json();
            setIsLoading(false);
    
            console.log("backgrounds", backgrounds)
            // const rows = []
            
            const rows = backgrounds.map( (background: Background) => {
                return {
                    key: background.id,
                    createdAt: background.createdAt,
                    // associated: "Yes ou No",
                    url: background.url,
                    // instrument: background.instrument.name,
                    user: background.user.name,
                }
            })

            defaultSelectedKeys = new Set([ rows[0].key, rows[1].key ])
            console.log("defaultSelectedKeys", defaultSelectedKeys)
            setSelectedKeys(defaultSelectedKeys)

            return {
                // items: json.results,
                items: rows,
            };
        },
        async sort({items, sortDescriptor}) {
            console.log("sort", items, sortDescriptor)
            return {
                items: items.sort((a, b) => {
                    let first = a[sortDescriptor.column];
                    let second = b[sortDescriptor.column];

                    console.log("first", first)
                    console.log("second", second)

                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
            
                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1;
                    }
        
                    return cmp;
                }),
            };
        },
    });



//     const ShowData = () => {
//         if (isLoading) return 
//             (
//                 // <Table aria-label="Backgrounds associated to the instrument"
//                 //     color="secondary"
//                 //     selectionMode="multiple" 
//                 // >              
//                 // <TableHeader columns={columns}>
//                 //     {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
//                 // </TableHeader>
//                 // <TableBody 
//                 //     emptyContent={ () => { return (<MySpinner />)}    }>{[]}
//                 // </TableBody>
//                 // </Table>
//                 <MySpinner />
//             )

// if (isError) return <ErrorComponent error={isError}/>

//         // const colors = ["default", "primary", "secondary", "success", "warning", "danger"];
//         // const [selectedColor, setSelectedColor] = React.useState("default");
      
//         const rows = backgrounds.map( (background: Background) => {
//             return {
//                 key: background.id,
//                 createdAt: background.createdAt,
//                 // associated: "Yes ou No",
//                 url: background.url,
//                 instrument: background.instrument.name,
//                 user: background.user.name,
//             }
//         })

//         return (
//             <Table aria-label="Backgrounds associated to the instrument"
//                 color={selectColor}
//                 selectionMode="multiple" 
//                 // defaultSelectedKeys={["1", "2"]}
//                 // disallowEmptySelection
//                 selectedKeys={selectedKeys}
//                 onSelectionChange={setSelectedKeys}

//                 sortDescriptor={list.sortDescriptor}
//                 onSortChange={list.sort}
//                 classNames={{
//                     table: "min-h-[400px]",
//                 }}
//             >              
//                 <TableHeader columns={columns}>
//                     {(column) => <TableColumn key={column.key} allowsSorting={column.sort}>{column.label}</TableColumn>}
//                 </TableHeader>
//                 <TableBody 
//                     emptyContent={"No background scan"}
//                     items={rows}>
//                     {(item) => (
//                     <TableRow key={item.key}>
//                         {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
//                     </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//           );

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
    // }

    return (
        <>
        <Timeline_scan current={0.5} />

        <div className="text-start w-">
            <h1>Selectionner le background</h1>
            <Debug params={selectedKeys} />
            {/* <ShowData /> */}
            <Table aria-label="Backgrounds associated to the instrument"
                color={selectColor}
                selectionMode="multiple" 
                selectionBehavior="toggle"
                defaultSelectedKeys={defaultSelectedKeys}
                // disallowEmptySelection
                selectedKeys={selectedKeys}
                // onSelectionChange={setSelectedKeys}
                onSelectionChange={onSelected}

                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
                classNames={{
                    table: "min-h-[400px]",
                }}
            >              
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} allowsSorting={column.sort}>{column.label}</TableColumn>}
                </TableHeader>

                <TableBody 
                    items={list.items} 
                    isLoading={isLoading}
                    loadingContent={<MySpinner />}
                    emptyContent={"No background scan"}
                >
                    {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        <div>
            <Button onPress={onPress} color="primary">DONE</Button>
        </div>
        </>
    )

}


export default InfoPage;
