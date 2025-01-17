import React from "react";
import { Switch, Redirect, Router } from "react-router-dom";

import { RouteWithLayout } from "./common";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";
import history from "./utils/history";
import UnauthenticatedRoute from "./common/UnauthenticatedRoute";
import AuthenticatedRoute from "./common/AuthenticatedRoute";

import {
  Home as HomeView,
  SignUp,
  NotFound as NotFoundView,
  SignIn,
  StarMap,
  CityMap,
  CoordinatePoster,
  FamilyPoster,
  DogPoster,
  Cart,
  Checkout,
  Orders,
  Profile,
  OrderDetails,
  ForgotPassword,
  ResetPassword,
  BusinessCard,
  UserBusinessCardList,
  ConnectList,
  ConnectRequest,
  UserConnectList,
  ChatBox,
} from "./views";

history.listen((location) => {
  // Use setTimeout to make sure this runs after React Router's own listener
  setTimeout(() => {
    // Keep default behavior of restoring scroll position when user:
    // - clicked back button
    // - clicked on a link that programmatically calls `history.goBack()`
    // - manually changed the URL in the address bar (here we might want
    // to scroll to top, but we can't differentiate it from the others)
    if (location.action === "POP") {
      return;
    }
    // In all other cases, scroll to top
    window.scrollTo(0, 0);
  });
});

const Routes = () => {
  return (
    <Router history={history}>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <RouteWithLayout
          exact
          path="/home"
          component={HomeView}
          layout={MainLayout}
        />
        <RouteWithLayout
          exact
          path="/starmap"
          component={StarMap}
          layout={MainLayout}
        />
        <RouteWithLayout
          exact
          path="/citymap"
          component={CityMap}
          layout={MainLayout}
        />
        <RouteWithLayout
          exact
          path="/coordinate-poster"
          component={CoordinatePoster}
          layout={MainLayout}
        />
        <RouteWithLayout
          exact
          path="/family-poster"
          component={FamilyPoster}
          layout={MainLayout}
        />
        <RouteWithLayout
          exact
          path="/dog-poster"
          component={DogPoster}
          layout={MainLayout}
        />

        <RouteWithLayout
          exact
          path="/businessCard"
          component={BusinessCard}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/userBusinessCardList"
          component={UserBusinessCardList}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/BusinessCard/:id"
          component={BusinessCard}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/cart"
          component={Cart}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/checkout"
          component={Checkout}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/orders"
          component={Orders}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/orders/:id"
          component={OrderDetails}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/profile"
          component={Profile}
          layout={MainLayout}
        />
        <UnauthenticatedRoute
          exact
          path="/signin"
          component={SignIn}
          layout={MainLayout}
        />
        <UnauthenticatedRoute
          exact
          path="/signup"
          component={SignUp}
          layout={MainLayout}
        />
        <UnauthenticatedRoute
          exact
          path="/forgot-password"
          component={ForgotPassword}
          layout={MainLayout}
        />
        <UnauthenticatedRoute
          exact
          path="/reset-password/:hash"
          component={ResetPassword}
          layout={MainLayout}
        />
        <RouteWithLayout
          component={NotFoundView}
          exact
          layout={MinimalLayout}
          path="/not-found"
        />
        <AuthenticatedRoute
          exact
          path="/ConnectRequest"
          component={ConnectRequest}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/ConnectList"
          component={ConnectList}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/UserConnectList"
          component={UserConnectList}
          layout={MainLayout}
        />
        <AuthenticatedRoute
          exact
          path="/ChatBox"
          component={ChatBox}
          layout={MainLayout}
        />
        <Redirect to="/not-found" status="404" />
      </Switch>
    </Router>
  );
};

export default Routes;
