import { createContext } from "react";
import { useAuthProvider } from "../hooks";

export const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
