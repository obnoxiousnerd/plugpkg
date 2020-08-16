import { cli } from "../cli";
import ora from "ora";
import store from "../util/store";
import { success, error } from "../util/color-logs";
import { logout as debug, login } from "../util/debuggers";
const EMPTY_CONFIG = {
  accessToken: "",
  idToken: "",
  refreshToken: "",
  signedIn: 0,
};
cli.command("logout", "Logs you out from the CLI").action(() => {
  debug("Starting logout process");
  debug("Checking for property %o ", "user", "in config");
  if (
    !store.get("user") ||
    JSON.stringify(store.get("user")) === JSON.stringify(EMPTY_CONFIG)
  ) {
    debug("Property %O", "user", "is", store.get("user"));
    debug("Finishing logout process by showing an error");
    error(
      "Can't log you out because you are not logged in. Use `plug login` to login."
    );
    process.exit(1);
  } else {
    debug("Property %O", "user", "is", store.get("user"));
    global.spinner = ora("Logging out").start();
    debug("Resetting property %o", "user", "in config");
    store.reset("user");
    debug("Stopping spinner and showing a 'feeling sad' message");
    spinner.stop();
    success("Logged out. Sad to see you go :(");
    debug("Ending logout process");
  }
});
