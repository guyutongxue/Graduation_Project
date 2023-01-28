import { fork } from "node:child_process";
import jayson from "jayson/promise";

type RawRequest = {
  method: string;
} & Record<string, unknown>;

async function createWebChecker() {
  const process = fork("../webcheck/dist/index.js", {
    stdio: "pipe",
  });
  const port = await new Promise<number>((resolve, reject) =>
    process.stdout?.once("data", (buf) => {
      const port = Number(buf.toString());
      console.log(port);
      if (!Number.isNaN(port)) {
        resolve(port);
      } else {
        reject("First data chunk not a number");
      }
    })
  );
  const client = jayson.Client.http({ port, timeout: 5000 });
  const response = await client.request("initialize", []);
  console.log(response);
}

export function createChecker() {}

createWebChecker();
