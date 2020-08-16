import * as path from "path";
import { execSync } from "child_process";
//@ts-ignore
import * as rcedit from "rcedit";
import * as pkg from "../package.json";
const rcBinaryPath = path.join("build-utils", "ResourceHacker.exe");

execSync(
  `${rcBinaryPath} -open build-utils/plug.rc -save build-utils/plug.res -action compile`
);
execSync(
  `${rcBinaryPath} -open .nexe/windows-x64-12.16.3 -save .nexe/windows-x64-12.16.3 -action addoverwrite -resource build-utils/plug.res`
);
execSync(
  `${rcBinaryPath} -open .nexe/windows-x64-12.16.3 -save .nexe/windows-x64-12.16.3 -action addoverwrite -resource build-utils/icon.ico -mask ICONGROUP,1,1033`
);
rcedit(".nexe/windows-x64-12.16.3", {
  "file-version": pkg.version,
  "product-version": pkg.version,
}).then(() => {
  console.log("Done modifying base binary!!");
});
