


"use client";






import { getProjectBackgrounds } from "@/app/api/data/background";
// import { getBackgrounds } from "@/app/api/network/background";
// import { eState } from "./state"
import { Project, Sample, SubSample } from "@/app/api/network/interfaces";
import { Debug } from "@/components/Debug";
import {MyChoicer, ChoicerInterface} from "@/components/MyChoicer";
import { Button } from "@nextui-org/button";
// import { MySelect } from "@/components/mySelect5";
// import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";




// const Metadata = (project: Project|any, subsampleid:string, current: eState, nextState: eState, onCancel: any , setCurrent: (state: eState) => void) => {
export function Background(param: {
    project: Project|any,
    sample: Sample,
    subsample: SubSample,
    backgrounds:Array<ChoicerInterface>, // Array<any>,
    onCancel: () => void,
    // onValid: (id:string) => void,
    onValid: () => void,
    onSelect: (id:string) => void,
    selectedBackgroundId: string,
}) {
    const { project, sample, subsample, backgrounds, onValid, onSelect, onCancel, selectedBackgroundId : selected} = param;
 
    
    // const [ backgroundList, setBackgroundList ] = useState<any[]>([])
    // const [modalPlacement, setModalPlacement] = useState("auto");
    // const [ selectedBackground, setSelectedBackground ] = useState<Set<string>>(new Set([]))

    // const [ selectedBackground, setSelectedBackground ] = useState<string>("")



    // const instrument = project.instrument


    // const formatData = (data:any) => {
    //     console.log("formatData", data);
    
    //     const backgrounds = Object.keys(data).map( (_scan) => {
    //         console.log("background: ", _scan);
    
    //         if ( _scan == "key"){
    //             console.error("ARRGG indey == key");
    //             console.log("ARRGG indey == key")
    //             console.debug(data);
    //             console.log("pfffff")
    //             return null;
    //         } else {
    //           const s = data[_scan]
    //           console.log("s: ", s);
  
    //           const date = new Date(s.createdAt)
  
    //           return {
    //             id: s.id,
    //             name: s.url,
    //             creator: s.user.name,
    //             utc: s.createdAt,
    //             time:date.toLocaleTimeString(),
    //             date:date.toLocaleDateString(),
    //             type: s.type,
    //             qc: s.qc || "TODO",  
    //             action:s.url
    //           }
    //         }
    //       }).filter(Boolean);

    //     console.log("formated backgrounds data: ", backgrounds);

    //     const filtered = backgrounds.filter((background:any) => background.type == "MEDIUM_BACKGROUND")
    //     console.log("filtered backgrounds data: ", filtered)
        
    //     let sorted = filtered.sort((a:any,b:any) => new Date(b.utc).getTime() - new Date(a.utc).getTime())

    //     let key = undefined
    //     if (sorted && sorted.length > 0) {
    //         const subsampleDate = new Date();
    //         key = sorted.reduce((prev:any, current:any) => {
    //             return Math.abs(new Date(current.date).getTime() - subsampleDate.getTime()) <
    //             Math.abs(new Date(prev.date).getTime() - subsampleDate.getTime()) ? current : prev
    //         }).id 
    //         console.log("key: ", key);
    //         setSelectedBackground(new Set([key]))

    //         // remove unwanted field utc
    //         sorted = sorted.map((background:any) => {
    //             const { utc, ...rest } = background
    //             return rest
    //         })
    //     }
    
    //     return sorted || []
    // }

    console.log("project:",project)


    // useEffect(() => {
    //     const fetchBackgrounds = async () => {
    //         const fetchedBackgrounds = await getProjectBackgrounds(project.id)
    //         const formattedData:any = formatData(fetchedBackgrounds)
    //         setBackgroundList(formattedData||[])
    //     }
    //     fetchBackgrounds()
    // }, [project])

    //   useEffect(() => {
    //     // const fetchBackgrounds = async () => {
    //         // const fetchedBackgrounds = await getProjectBackgrounds(project.id)
    //         const formattedData:any = formatData(backgrounds)
    //         setBackgroundList(formattedData||[])
    //     // }
    //     // fetchBackgrounds()
    // }, [backgrounds])
 
    // const onSelect = (id:string) => {
    //     setSelectedBackground(id)
    // }

    return (
        <>
            <Debug params={project} title="Project"/>
            <Debug params={backgrounds} title="Background List"/>
            <Debug params={selected} title="Selected Background"/>
            <h1>Background</h1>
           
            {/* <Modal isOpen={isOpen} placement={modalPlacement} onOpenChange={onOpenChange}> */}
            
            <MyChoicer backgrounds={backgrounds}  onSelect={onSelect} selectedBackgroundId={selected}/>

            <div className="flex flex-row justify-end gap-4">
                <Button color="secondary">Scan Background</Button>
                <Button color="secondary" onPress={onCancel}>Scan Background later</Button>
                <Button color="primary" onPress={() => onValid()}>Valid Background</Button>
            </div>
        </>
    )
}

