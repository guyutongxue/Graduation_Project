import { launch } from "./browser";
import { Server } from "./server";
import getPort from "get-port";
import jayson from "jayson/promise";
import os from "node:os";
import { Browser } from "puppeteer-core";

let htmlServer: Server | null = null;
let browser: Browser | null = null;

const rpcServer = new jayson.Server({
  async initialize(path: string) {
    if (htmlServer) {
      return rpcServer.error(501, "HTML server already started");
    }
    htmlServer = new Server(path);
    const address = await htmlServer.listen();
    if (browser) {
      return rpcServer.error(502, "Puppeteer browser already started");
    }
    ({ browser } = await launch(address));
    return true;
  },
  async dispose() {
    if (browser) {
      await browser.close();
      browser = null;
    }
    if (htmlServer) {
      await htmlServer.dispose();
      htmlServer = null;
    }
    return true;
  }
});

const port = await getPort();
rpcServer.http().listen(port, () => process.stdout.write(`${port}${os.EOL}`));

// const { address, dispose } = await startServer();
// const { browser, page } = await launch(address);
// await browser.close();
// await dispose();
