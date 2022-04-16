import React, { useEffect } from 'react';

import { Stack, Flex, Text, Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { ENUM_STATUS, genericAction, GET_ALL_TODO } from '../redux/actions';
import { Footer, Header, TodoApp } from '../components';

export default function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING));
  }, [dispatch]);

  return (
    <Stack minH={'100vh'} alignItems='center' justifyContent='start'>
      <Header />
      <Box mt={30}>
        <Text
          as={'h2'}
          fontSize='4xl'
          bgClip='text'
          bgGradient='linear(to-r, teal.500, green.500)'
          fontWeight='bold'
          textAlign='center'
          className='my-5'
        >
          Todo App
        </Text>
      </Box>
      <Box className='w-10/12 md:w-4/5 lg:w-3/5'>
        <Flex
          color='white'
          className='flex flex-wrap justify-between space-y-5 md:space-y-0'
        >
          <Box className='border rounded-md p-5 w-full md:w-1/3'>
            <TodoApp.SideFilter />
          </Box>
          <Box className='w-full md:w-3/5'>
            <TodoApp.FormCreateTodo />
          </Box>
        </Flex>
        <TodoApp.ListTodo />
      </Box>
      <div className='mt-28 w-full'>
        <Footer />
      </div>
    </Stack>
  );
}
