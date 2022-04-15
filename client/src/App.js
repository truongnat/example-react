import React, { Suspense } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RootRouter } from './router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { FallbackLoading } from './components';

function App() {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <ChakraProvider>
        <Provider store={store}>
          <RootRouter />
        </Provider>
      </ChakraProvider>
    </Suspense>
  );
}

export default App;
