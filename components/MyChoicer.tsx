import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { MyImage } from "@/components/myImage";

import { EyeIcon } from "@/components/icons/EyeIcon";
import { useState } from "react";

export interface ChoicerInterface {
    id: string,
    name: string,
    creator: string,
    date:string,
    time:string,
    type:string
}

// const MyChoicerWrapper = ({ backgrounds, onSelect }: { backgrounds: ChoicerInterface[], onSelect: (id: string) => void }) => {
//     return <MyChoicer backgrounds={backgrounds} onSelect={onSelect} />;
// };

// export default function MyChoicer(backgrounds:Array<ChoicerInterface>, onSelect:(id:string)=>void) {
    // export default 
    // function ({ backgrounds, onSelect }: { backgrounds: ChoicerInterface[], onSelect:  (id: string) => void }) {
    // export default 




    // export const MyChoicer = ({ backgrounds, onSelect }: { backgrounds: ChoicerInterface[], onSelect:  (id: string) => void }) => {
interface MyChoicerProps {
    backgrounds: Array<ChoicerInterface>;  // make it optional
    onSelect: (id: string) => void;
    selectedBackgroundId: string;
}

export const MyChoicer: React.FC<MyChoicerProps> = ({ backgrounds, onSelect, selectedBackgroundId }) => {

            
    const selectedColor = 'primary'

    const [ selectedBackground, setSelectedBackground ] = useState<Set<string>>(new Set([selectedBackgroundId]))
    
    const [ imageURL, setImageURL ] = useState<string>("")
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

       // open a modal to show the image
        function setShowImage(image: any): void {
            console.log("setShowImage", image);
            setImageURL(image)
            onOpen()
        }

    return (
        <>
            <Table isStriped aria-label="Background table"
                color={selectedColor}
                selectedKeys={selectedBackground}
                selectionMode="single"
                disallowEmptySelection
                onSelectionChange={(keys) => { 
                    setSelectedBackground(keys as Set<string>);
                    const keyArray = Array.from(keys);
                    if (keyArray.length > 0) {
                        onSelect(String(keyArray[0]));
                    }
                }}                >
                <TableHeader>
                {/* ID column To Comment - only use to debug */}
                <TableColumn>ID</TableColumn>               
                <TableColumn>Creator</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Time</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {
                        backgrounds.map((background:ChoicerInterface) => (
                            <TableRow key={background.id}>
                                {/* background.id column To Comment - only use to debug */}
                                <TableCell>{background.id}</TableCell>
                                <TableCell>{background.creator}</TableCell>
                                <TableCell>{background.date}</TableCell>
                                <TableCell>{background.time}</TableCell>
                                <TableCell>{background.type}</TableCell>
                                {/* add an eye button to see the image of the background */}
                                <TableCell><Button onPress={() => setShowImage(background.name)}><EyeIcon/></Button></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>     
            
            <Modal isOpen={isOpen} placement="auto" onOpenChange={onOpenChange} size="3xl">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                    <ModalBody>
                        <MyImage src={imageURL} />
                        <p>{imageURL}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={onClose}>
                        Close
                        </Button>
                        {/* <Button color="primary" onPress={onClose}>
                        Action
                        </Button> */}
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            <h1>Selected date : {Array.from(selectedBackground).join(', ')}</h1>
            
            {/* <div className="flex flex-row justify-end gap-4">
                <Button color="secondary">Scan Background</Button>
                <Button color="secondary" onPress={onCancel}>Scan Background later</Button>
                <Button color="primary" onPress={() => onValid(imageURL)}>Valid Background</Button>
            </div> */}

            </>
    )
}   