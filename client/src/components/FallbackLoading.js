import React from 'react';
import { CircularProgress } from '@chakra-ui/react';

export default function FallbackLoading() {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center'>
      <CircularProgress size={100} isIndeterminate color='green.500' />
    </div>
  );
}
