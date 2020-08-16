//@ts-nocheck
import { Application } from "express";
import { isAuthenticated } from "./auth/is-auth";
import {
  createAccessTokenAPI,
  getAccessTokenAPI,
  verifyAccessTokenAndGetLoginTokenAPI,
} from "./auth/access-token";
import { tellWhoAmI } from "./auth/whoami";
import { createScope, searchUserScopes } from "./users/scopes";

export const setRoutes = (app: Application) => {
  app.post("/tokens/verify", verifyAccessTokenAndGetLoginTokenAPI); // Done
  app.get("/tokens/:uid", isAuthenticated, getAccessTokenAPI); // Done
  app.post("/tokens/:uid", isAuthenticated, createAccessTokenAPI); // Done
  app.post("/users/whoami", isAuthenticated, tellWhoAmI); // Done
  app.get("/users/scopes/:uid", isAuthenticated, searchUserScopes);
  app.post("/scopes/:scope", isAuthenticated, createScope);
  app.post("/users/name-uid/:name");
  app.post("/users/uid-name/:uid");
};
