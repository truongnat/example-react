import React, { useEffect } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Input,
  Textarea,
  Button,
  useToast,
  Code,
  useColorMode,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { CREATE_TODO, ENUM_STATUS, genericAction } from '../../redux/actions';
import { todoCreateSelector, todosSelector } from '../../redux/selector';
import { TextError } from '../../components';
import TodoBadge from './TodoBadge';

export default function FormCreateTodo() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const toast = useToast();
  const dispatch = useDispatch();
  const { error, loading, status } = useSelector(todoCreateSelector);
  const { status: statusType } = useSelector(todosSelector);
  const { colorMode } = useColorMode();
  const onSubmit = (data) => {
    dispatch(
      genericAction(CREATE_TODO, ENUM_STATUS.FETCHING, { data, statusType })
    );
  };

  useEffect(() => {
    if (!loading && status === 'success') {
      reset({ title: '', content: '' });
      toast({
        title: `Create todo successfully!`,
        variant: 'top-accent',
        isClosable: true,
        status: 'success',
        position: 'top',
      });
      dispatch(genericAction(CREATE_TODO, ENUM_STATUS.RESET));
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
  }, [error, loading, status, toast]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full p-5 min-h-full border rounded-md'
    >
      <Controller
        name='title'
        control={control}
        defaultValue={''}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            placeholder='Title'
            color={colorMode === 'light' ? 'black' : 'white'}
            {...field}
          />
        )}
      />
      <TextError e={errors.title} txtError={'Title is required'} />
      <Controller
        name='content'
        control={control}
        defaultValue={''}
        rules={{ required: true }}
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
      <div className=''>
        <Code>Status App : </Code>
      </div>
      <div className='mt-5'>
        {['initial', 'todo', 'review', 'done', 'keeping'].map((status) => (
          <TodoBadge key={status} status={status} />
        ))}
      </div>
    </form>
  );
}
