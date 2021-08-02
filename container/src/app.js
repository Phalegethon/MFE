import React, { lazy, Suspense, useState, useEffect } from "react";
import { Route, Switch, Router, Redirect } from "react-router-dom";
import Header from "./components/Header";
import Progress from "./components/Progress";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";

// const MarketingLazy = lazy(() => import("./components/MarketingApp"));

const MarketingLazy = React.lazy(
    () => import('./components/MarketingApp').catch(error => import("./components/Maintenance"))
);

const Authlazy = React.lazy(
    () => import('./components/AuthApp').catch(error => import("./components/Maintenance"))
);

const Dashboardlazy = React.lazy(
    () => import('./components/DashboardApp').catch(error => import("./components/Maintenance"))
);

const generateClassName = createGenerateClassName({
  productionPrefix: "co",
});

const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push("/dashboard");
    }
  }, [isSignedIn]);

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            onSignOut={() => setIsSignedIn(false)}
            isSignedIn={isSignedIn}
          />
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path="/auth">
                <Authlazy onSignIn={() => setIsSignedIn(true)}/>
              </Route>
              <Route path="/dashboard">
                {!isSignedIn && <Redirect to="/" />}
                <Dashboardlazy />
              </Route>
              <Route path="/" component={MarketingLazy} />
              }
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};
