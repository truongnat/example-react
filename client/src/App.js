import React, { Suspense } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { RootRouter } from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { FallbackLoading } from "./components";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <ChakraProvider>
        <Provider store={store}>
          <BrowserRouter>
            <RootRouter />
          </BrowserRouter>
        </Provider>
      </ChakraProvider>
    </Suspense>
  );
}

export default App;
