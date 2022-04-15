import React, { useEffect } from 'react';
import {
  useDisclosure,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_TODO, ENUM_STATUS, genericAction } from '../redux/actions';
import { todoDeleteSelector } from '../redux/selector';

export default function AlertDeleteTodo({ todo }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const dispatch = useDispatch();
  const { loading, status, error } = useSelector(todoDeleteSelector);
  const onSubmit = () => {
    dispatch(genericAction(DELETE_TODO, ENUM_STATUS.FETCHING, todo._id));
  };
  useEffect(() => {
    if (!loading && (status === 'success' || error) && isOpen) {
      onClose();
    }
  }, [error, loading, status, onClose, isOpen]);
  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<DeleteIcon />}
        colorScheme='red'
        variant='outline'
      >
        remove
      </Button>
      <AlertDialog
        motionPreset='slideInBottom'
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
            Are you sure you want to delete todo of your todo list? This
            behavior will not be recoverable ? Continue.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              isLoading={loading}
              onClick={onSubmit}
              colorScheme='red'
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
