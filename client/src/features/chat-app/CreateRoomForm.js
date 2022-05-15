import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ControlInput } from "../../components";
import { CREATE_ROOM, ENUM_STATUS, genericAction } from "../../redux/actions";

export default function CreateRoomForm({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = (data) => {
    dispatch(
      genericAction(CREATE_ROOM, ENUM_STATUS.FETCHING, { data, onClose })
    );
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Room Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <ControlInput
            name={"name"}
            control={control}
            rules={{
              required: "Name room is required!",
              minLength: {
                value: 4,
                message: "Name room must have at least 4 characters!",
              },
              maxLength: {
                value: 50,
                message: "Name room max 50 characters!",
              },
            }}
            label={"Name room"}
            errorMessage={errors?.name?.message}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
