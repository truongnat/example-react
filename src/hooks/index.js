import { useContext, useState } from "react";
import { authContext } from "../context/authContext";
import { fakeAuth, FakeCookie } from "../utils";

export function useAuthProvider() {
  const [user, setUser] = useState(null);

  const signIn = (value, cb) => {
    return fakeAuth.signIn(() => {
      setUser(value);
      FakeCookie.set("lp", JSON.stringify(value));
      cb();
    });
  };

  const signOut = (cb) => {
    return fakeAuth.signOut(() => {
      FakeCookie.remove("lp");
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signIn,
    signOut,
    setUser,
  };
}

export function useAuth() {
  return useContext(authContext);
}
