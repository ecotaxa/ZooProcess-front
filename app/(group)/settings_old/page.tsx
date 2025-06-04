// ./app/(group)/settings/page.tsx

import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, Button, useDisclosure} from "@heroui/react";
import { useRouter } from "next/navigation";




export default function Page() {

  const {isOpen = true, onOpen, onOpenChange} = useDisclosure();

  console.log("____ SETTINGS ________________________")


    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-black">
          <p>Settings</p>

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

        </div>
      </main>
    );
  }