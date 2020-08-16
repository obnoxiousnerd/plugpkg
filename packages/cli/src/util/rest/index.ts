import dotenv from "dotenv";
import { join } from "path";
import axios from "axios";
import store from "../store";
import { renewIdToken } from "./auth";
dotenv.config({ path: join(__dirname, "..", ".firebase.env") });
if (process.env.NODE_ENV === "development")
  process.env.REST_API_URL = "http://localhost:3000";

/**
 * Refresh ID Token if it has expired
 */
export const refreshIdToken = async () => {
  let idToken: string = store.get("user.idToken"),
    refreshToken: string = store.get("user.refreshToken"),
    signedIn: number = store.get("user.signedIn");
  if (
    refreshToken &&
    signedIn &&
    Math.floor(Date.now() / 1000) - signedIn > 3600
  ) {
    try {
      const res = await renewIdToken(refreshToken);
      idToken = res.idToken;
      store.set("user.idToken", res.idToken);
      store.set("user.signedIn", Math.floor(Date.now() / 1000));
      if (res.refreshToken) store.set("user.refreshToken", res.refreshToken);
    } catch (e) {}
  }
  axios.defaults.headers.common["Authorization"] = `Bearer ${store.get(
    "user.idToken"
  )}`;
};

export const firebaseCreds = {
  GAPIKey: process.env.GOOGLEAPIS_KEY,
  firebaseAPIKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};
export * from "./auth";
