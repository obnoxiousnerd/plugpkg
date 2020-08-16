import { compile, NexeOptions } from "nexe";
async function compileBinary(platform: string, dir: string) {
  const config: Partial<NexeOptions> = {
    input: "lib/index.js",
    output: `${dir}/${platform.split("-")[0]}/plug`,
    temp: ".nexe",
    targets: [platform],
    resources: ["./.firebase.env", "./.secretkeys.env"],
  };
  if (platform.includes("windows"))
    config.output = `${dir}/${platform.split("-")[0]}/plug.exe`;
  if (!platform.includes("windows")) config.rc = undefined;
  compile(config).then(() => {
    console.log(
      `Compiled binary for ${platform.split("-")[0]}. It is in ${dir}/${
        platform.split("-")[0]
      }`
    );
  });
}

compileBinary("windows-x64-12.16.3", "build");
