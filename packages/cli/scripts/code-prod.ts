import { build } from "esbuild";
build({
  color: true,
  entryPoints: ["./src/index.ts"],
  outfile: "./lib/index.js",
  minify: true,
  bundle: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  platform: "node",
  logLevel: "error",
}).catch(() => process.exit(1));
