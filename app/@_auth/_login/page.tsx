// ./app/@dashboard/page.tsx

// export default function Page() {
//     return (
//       <main className="flex flex-col items-center justify-between p-24 bg-orange-300">
//         <div className="text-black">
//           <p>Login</p>
//         </div>
//       </main>
//     );
//   }

"use client";

import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useRouter } from "next/navigation";
// import { Modal } from 'components/modal'
 
export default function Login() {
    const router = useRouter()

    const {isOpen = true, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
    TOTO

    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                      <h1>Login</h1>
                    <p> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam pulvinar risus non risus hendrerit venenatis.
                        Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                    Action
                    </Button>
                </ModalFooter>
            </>
          )}
        </ModalContent>
    </Modal>

    </>
  )
}