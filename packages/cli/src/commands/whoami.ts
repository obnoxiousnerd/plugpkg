import { cli } from "../cli";
import { getDisplayName } from "../util/rest/whoami";
import { info } from "../util/color-logs";
import ora from "ora";
cli
  .command("whoami", "Tells the username of the current user logged in.")
  .action(async () => {
    global.spinner = ora().start();
    const displayName = await getDisplayName();
    global.spinner.stop();
    info(`You are ${displayName}`);
  });
