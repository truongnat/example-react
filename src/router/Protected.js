import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectorAuth } from "../redux/selector";

export function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = useSelector(selectorAuth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
}
