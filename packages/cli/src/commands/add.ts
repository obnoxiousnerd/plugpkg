import { cli } from "../cli";

/**
 * Helper to seperate compound scoped packages argument
 * ```ts
 * normalizeScopedArgs("@foo/[bar,baz,wee]")
 * // ["@foo/bar", "@foo/baz", "@foo/wee"]
 * ```
 * @param arg The argument
 */
const normalizeScopedArgs = (arg: string): string[] => {
  if (arg.startsWith("@") && arg.split("/").length === 2) {
    const scope = arg.split("/")[0].replace("@", "");
    const packagesStr = `${arg.split("/")[1].replace(/\[|\]/g, "")}`;
    const packages = packagesStr.split(",");
    const output = packages.map((pkg) => `@${scope}/${pkg}`);
    return output;
  } else return [arg];
};
cli
  .command("add [...packages]", "")
  .alias("a")
  .alias("i")
  .alias("install")
  .option("--dev, -D", "Add the packages as development dependencies", {
    default: false,
  })
  .action((packages: string[], options) => {
    if (options.dev) console.log("All are dev deps.");
    packages.forEach((pkg, i) => {
      packages.splice(i, 1, ...normalizeScopedArgs(pkg));
    });
    console.log(packages);
  });
