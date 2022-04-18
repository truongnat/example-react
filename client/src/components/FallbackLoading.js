import React from 'react';
import { Spinner } from '@chakra-ui/react';

export default function FallbackLoading() {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center'>
      <Spinner size='xl' />
    </div>
  );
}
