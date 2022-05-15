import React, { Suspense } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RootRouter } from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { FallbackLoading } from "./components";
import { BrowserRouter } from "react-router-dom";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";

const theme = extendTheme({
  components: {
    Steps,
  },
});

function App() {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <ChakraProvider theme={theme}>
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
