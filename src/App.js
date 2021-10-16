import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { RootRouter } from "./router";
import { AuthProvider } from "./context/authContext";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <RootRouter />
          </Router>
        </AuthProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default App;
