import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import peggy from "peggy";

import { DefDefAst } from "./types";
import { generateDts } from "./dts";
import { generateTranspileTargets } from "./transpile-target";
import { generateBlocklyThings } from "./blockly";


function loadFile(file: string) {
  return readFileSync(fileURLToPath(new URL(file, import.meta.url)), "utf-8");
}
function writeFile(file: string, value: string) {
  return writeFileSync(fileURLToPath(new URL(file, import.meta.url)), value);
}

const grammar = loadFile("./defdef.peggy");
const parser = peggy.generate(grammar);
const source = loadFile("./this.dd");
const ast: DefDefAst = parser.parse(source);

writeFile("../build/client.d.ts", generateDts(ast));
writeFile("../build/targets.json", generateTranspileTargets(ast));
writeFile("../build/blockly.json", generateBlocklyThings(ast));

// debugger;
