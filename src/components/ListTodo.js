import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ModalEdit } from "./ModalEdit";

export default function ListTodo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="mt-10" style={{ maxWidth: 768 }}>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>

            <div className="text-right space-x-5">
              <Button
                leftIcon={<EditIcon />}
                colorScheme="whatsapp"
                variant="outline"
                onClick={onOpen}
              >
                edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
              >
                remove
              </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>

            <div className="text-right space-x-5">
              <Button
                leftIcon={<EditIcon />}
                colorScheme="whatsapp"
                variant="outline"
              >
                edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
              >
                remove
              </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <ModalEdit isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
