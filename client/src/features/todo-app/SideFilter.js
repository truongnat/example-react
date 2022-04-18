import React from 'react';
import { Flex, Button, Heading } from '@chakra-ui/react';
import { TiThSmall } from 'react-icons/ti';
import { VscCheckAll, VscPreview } from 'react-icons/vsc';
import { MdOutlineWorkOutline } from 'react-icons/md';
import { IoPlaySkipForwardOutline } from 'react-icons/io5';
import { ENUM_STATUS, genericAction, GET_ALL_TODO } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { todosSelector } from '../../redux/selector';

export default function SideFilter() {
  const dispatch = useDispatch();
  const { loading, status } = useSelector(todosSelector);

  const filterTodos = (status) => {
    dispatch(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, status));
  };

  return (
    <Flex
      w={'100%'}
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
    >
      <Heading
        className='mb-5'
        as='h2'
        bgClip='text'
        bgGradient='linear(to-r, teal.500, green.500)'
        size='md'
      >
        Side Filter
      </Heading>
      <div className='flex flex-col items-start justify-start space-y-5'>
        <Button
          onClick={() => filterTodos('')}
          isLoading={loading && status === ''}
          variant={status === '' ? 'solid' : 'outline'}
          leftIcon={<TiThSmall />}
          colorScheme='teal'
        >
          All
        </Button>
        <Button
          onClick={() => filterTodos('initial')}
          isLoading={loading && status === 'initial'}
          leftIcon={<MdOutlineWorkOutline />}
          colorScheme='teal'
          variant={status === 'initial' ? 'solid' : 'outline'}
        >
          Todo
        </Button>
        <Button
          onClick={() => filterTodos('review')}
          isLoading={loading && status === 'review'}
          leftIcon={<VscPreview />}
          colorScheme='teal'
          variant={status === 'review' ? 'solid' : 'outline'}
        >
          Review
        </Button>
        <Button
          onClick={() => filterTodos('done')}
          isLoading={loading && status === 'done'}
          leftIcon={<VscCheckAll />}
          colorScheme='teal'
          variant={status === 'done' ? 'solid' : 'outline'}
        >
          Completed
        </Button>

        <Button
          onClick={() => filterTodos('keeping')}
          isLoading={loading && status === 'keeping'}
          leftIcon={<IoPlaySkipForwardOutline />}
          colorScheme='teal'
          variant={status === 'keeping' ? 'solid' : 'outline'}
        >
          Skipped
        </Button>
      </div>
    </Flex>
  );
}
