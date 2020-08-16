import ora from "ora";
import { cli } from "../cli";
import { success, warn } from "../util/color-logs";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  exchangeAccessTokenforIdToken,
  retrieveAccessToken,
  sendEmailLink,
  getEmailLinkCode,
  signInWithEmailLinkCode,
} from "../util/rest";
import {
  emailPassPrompt,
  emailLinkOrPassPrompt,
  emailPrompt,
} from "../util/prompts";
import store from "../util/store";
import axios from "axios";
import { sleep } from "../util/misc";
interface Options {
  key: string;
}
cli
  .command("login", "Login using email-password or an access token.")
  .option("-K, --key <key>", "Pass the access token", { default: null })
  .action(async (options: Options) => {
    let accessToken = options.key || process.env.PLUG_TOKEN;
    if (store.get("user.refreshToken")) {
      warn(
        "You are already logged in. If you want to logout, use the command 'plug logout'"
      );
      process.exit();
    }
    if (accessToken) {
      // If user passes a ENV variable
      if (accessToken.startsWith("env."))
        // Get that ENV variable and set it
        accessToken = process.env[accessToken.split("env.")[1]] as string;
      //Sign in using access token
      global.spinner = ora("Verifing token").start();
      const idToken = await exchangeAccessTokenforIdToken(accessToken);
      global.spinner.text = "Signing in";
      const signInPayload = await signInWithCustomToken(idToken);
      store.set("user.accessToken", accessToken);
      store.set("user.idToken", signInPayload.idToken);
      store.set("user.refreshToken", signInPayload.refreshToken);
      store.set("user.signedIn", signInPayload.signedIn);
      global.spinner.stop();
      success("Logged in successfully!");
      return;
    } else {
      const signInMethod = await emailLinkOrPassPrompt();
      if (signInMethod === "emailPass") {
        //Sign in using email/pass
        const { email, pass } = await emailPassPrompt();
        global.spinner = ora("Signing in").start();
        const signInPayload = await signInWithEmailAndPassword(email, pass);
        store.set("user.idToken", signInPayload.idToken);
        store.set("user.refreshToken", signInPayload.refreshToken);
        store.set("user.signedIn", signInPayload.signedIn);
        // Doing this since user is signing for the first time and we don't have data
        axios.defaults.headers.common["Authorization"] = `Bearer ${store.get(
          "user.idToken"
        )}`;
        retrieveAccessToken(signInPayload.uid).then((token) => {
          store.set("user.accessToken", token);
          global.spinner.stop();
          success("Logged in successfully!");
        });
      } else if (signInMethod === "emailLink") {
        const { email } = await emailPrompt();
        // TODO: implement email link sign in feature
        const emailSent = await sendEmailLink(email);
        if (emailSent) {
          global.spinner = ora("Waiting for you to open the link");
          global.spinner.color = "gray";
          global.spinner.start();
          let oobCode = await getEmailLinkCode(email);
          while (!oobCode) {
            await sleep(1000);
            oobCode = await getEmailLinkCode(email);
          }
          if (typeof oobCode === "string") {
            global.spinner.color = "green";
            global.spinner.text = "Signing in";
            const signInPayload = await signInWithEmailLinkCode(email, oobCode);
            if (signInPayload) {
              store.set("user.idToken", signInPayload.idToken);
              store.set("user.refreshToken", signInPayload.refreshToken);
              store.set("user.signedIn", signInPayload.signedIn);
              // Doing this since user is signing for the first time and we don't have data
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${store.get("user.idToken")}`;
              retrieveAccessToken(signInPayload.uid).then((token) => {
                store.set("user.accessToken", token);
                global.spinner.stop();
                success("Logged in successfully!");
              });
            }
          }
        }
      }
    }
  });
