import React from "react";
import { FormTodo } from "./FormTodo";
import { Modal, ModalOverlay, ModalContent, Heading } from "@chakra-ui/react";

export function ModalEdit({ onClose, isOpen }) {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <Heading
          className="py-5 text-center"
          as="h2"
          bgClip="text"
          bgGradient="linear(to-r, teal.500, green.500)"
          size="md"
        >
          Edit Todo
        </Heading>
        <FormTodo />
      </ModalContent>
    </Modal>
  );
}
