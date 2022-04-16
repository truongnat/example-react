import React, { useEffect } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Input,
  Textarea,
  Select,
  Button,
  useToast,
  useColorMode,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { STATUS_TODO } from '../../constants';
import TextError from '../TextError';
import { useSelector, useDispatch } from 'react-redux';
import { todosSelector, todoUpdateSelector } from '../../redux/selector';
import { UPDATE_TODO, genericAction, ENUM_STATUS } from '../../redux/actions';

export default function FormEditTodo({ dataInit, onClose }) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const toast = useToast();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { error, loading, status } = useSelector(todoUpdateSelector);
  const { status: statusType } = useSelector(todosSelector);
  const onSubmit = (todos) => {
    const payload = {
      data: {
        ...todos,
        id: dataInit._id,
      },
      statusType,
    };
    dispatch(genericAction(UPDATE_TODO, ENUM_STATUS.FETCHING, payload));
  };
  useEffect(() => {
    if (!loading && status === 'success') {
      reset({ title: '', content: '', status: '' });
      toast({
        title: `Update todo successfully!`,
        variant: 'top-accent',
        isClosable: true,
        status: 'success',
        position: 'top',
      });
      onClose();
      dispatch(genericAction(UPDATE_TODO, ENUM_STATUS.RESET));
    }
    if (!loading && error) {
      reset({ title: '', content: '' });
      toast({
        title: `Something went wrong!!`,
        description: JSON.stringify(error),
        variant: 'top-accent',
        isClosable: true,
        status: 'error',
        position: 'top',
      });
    }
  }, [error, loading, status, dispatch, reset, toast, onClose]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full p-5 border rounded-md'
    >
      <Controller
        name='title'
        control={control}
        rules={{ required: true }}
        defaultValue={dataInit?.title || ''}
        render={({ field }) => (
          <Input
            placeholder='Title'
            color={colorMode === 'light' ? 'black' : 'white'}
            f
            {...field}
          />
        )}
      />
      <TextError e={errors.title} ftxtError={'Title is required'} />
      <Controller
        name='status'
        control={control}
        rules={{ required: true }}
        defaultValue={dataInit?.status || ''}
        render={({ field }) => (
          <Select
            className='mt-5'
            placeholder='Status'
            color={colorMode === 'light' ? 'black' : 'white'}
            {...field}
          >
            {STATUS_TODO.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        )}
      />
      <TextError e={errors.status} txtError={'Status is required'} />
      <Controller
        name='content'
        control={control}
        rules={{ required: true }}
        defaultValue={dataInit?.content || ''}
        render={({ field }) => (
          <Textarea
            className='mt-5'
            placeholder='Description'
            color={colorMode === 'light' ? 'black' : 'white'}
            {...field}
          />
        )}
      />
      <TextError e={errors.content} txtError={'Content is required'} />
      <div className='text-right mt-5'>
        <Button
          isLoading={loading}
          leftIcon={<AddIcon />}
          loadingText='Submitting'
          colorScheme='teal'
          variant='outline'
          type='submit'
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
