import * as zlib from "zlib";
import * as fs from "fs";
import * as path from "path";
const BUILD_DIR = path.join(__dirname, "..", "build");

//Gzip windows
console.log("Gzipping for windows-x64");
const windowsBinary = fs.readFileSync(
  path.join(BUILD_DIR, "windows", "plug.exe")
);
const windowsBinaryGzip = zlib.gzipSync(windowsBinary);
fs.writeFileSync(
  path.join(BUILD_DIR, "windows", "plug.exe.gz"),
  windowsBinaryGzip
);
console.log("Gzipped for windows-x64");
