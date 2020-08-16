import kleur from "kleur";

const tickMark = process.platform === "win32" ? "√" : "✓";
const warnMark = process.platform === "win32" ? "!" : "⚠️";
const crossMark = process.platform === "win32" ? "x" : "✘";
const infoMark = process.platform === "win32" ? "i" : "ℹ️";

export const success = (text: string) => {
  console.log(`${kleur.green(tickMark)}  ${text}`);
};
export const warn = (text: string) => {
  console.log(`${kleur.yellow(warnMark + "  " + text)}`);
};
export const error = (text: string) => {
  console.log(`${kleur.red(crossMark)}  ${text}`);
};

export const info = (text: string) => {
  console.log(`${kleur.blue(infoMark)}  ${text}`);
};
