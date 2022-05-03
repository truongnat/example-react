import React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_TODO, ENUM_STATUS, genericAction } from "../../redux/actions";
import { todoSelector } from "../../redux/selector";

export default function AlertDeleteTodo({ todo, onClose, isOpen }) {
  const cancelRef = React.useRef();
  const dispatch = useDispatch();
  const toast = useToast();

  const { status: statusType } = useSelector(todoSelector);

  const onSubmit = () => {
    dispatch(
      genericAction(DELETE_TODO, ENUM_STATUS.FETCHING, {
        todo,
        toast,
        onClose,
        statusType,
      })
    );
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Delete todo this?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to delete todo of your todo list? This behavior
          will not be recoverable ? Continue.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button onClick={onSubmit} colorScheme="red" ml={3}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
