import React, { Suspense } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { RootRouter } from "./router";
import { AuthProvider } from "./context/authContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ChakraProvider>
        <Provider store={store}>
          <AuthProvider>
            <RootRouter />
          </AuthProvider>
        </Provider>
      </ChakraProvider>
    </Suspense>
  );
}

export default App;
