import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectorAuth, selectorLoadingApp } from "../redux/selector";
import { FallbackLoading } from "../components/FallbackLoading";

export function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = useSelector(selectorAuth);
  const loading = useSelector(selectorLoadingApp);
  if (loading) {
    return <FallbackLoading />;
  }

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
