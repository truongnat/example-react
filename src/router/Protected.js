import { useAuth } from "../hooks";
import { Route, Redirect } from "react-router-dom";
export function ProtectedRoute({ children, ...rest }) {
  const auth = useAuth();
  console.log("çhecking auth", auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect to={{ pathname: "login", state: { from: location } }} />
        )
      }
    />
  );
}
