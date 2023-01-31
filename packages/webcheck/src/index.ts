import { createServer } from "./definition.js";

const port = process.argv[2];
console.log(port);
createServer().http().listen(port);
