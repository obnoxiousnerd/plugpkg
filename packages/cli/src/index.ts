import { cli } from "./cli";
// Import Commands
import "./commands";
// Import rest of stuff
import { handleError } from "./handle-errors";
import { error } from "./util/color-logs";
import { refreshIdToken } from "./util/rest";
//Supply the default command
cli.command("").action(() => {
  cli.outputHelp();
});
cli.on("command:*", () => {
  error("Oops! You entered something that I don't know.");
});
// Top level await workaround (Seriously)
(async () => {
  try {
    await refreshIdToken();
    cli.parse(process.argv, { run: false });
    await cli.runMatchedCommand();
  } catch (err) {
    if (global.spinner) global.spinner.fail();
    error(handleError(err));
    process.exit(1);
  }
})();
