import cac from "cac";
import pkg from "../package.json";
import ora from "ora";
/** CLI initalizer */
export const cli = cac("plug");
cli.help();
cli.version(pkg.version);
declare global {
  /** The global spinner object that is to be used throughout the CLI */
  var spinner: ora.Ora;
}
declare namespace NodeJS {
  export interface Global {
    spinner: ora.Ora;
  }
}
