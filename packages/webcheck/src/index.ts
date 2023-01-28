// import { launch } from "./browser";
// import { Server } from "./server";
import getPort from "get-port";
import jayson from "jayson/promise";
import os from "node:os";

const server = new jayson.Server({
  initialize() {
    return { initialized: true };
  },
});

// async function startServer() {
//   const server = new Server(path);
//   await server.listen();
//   return {
//     address: server.address()!,
//     dispose: () => server.dispose(true),
//   };
// }

const port = await getPort();
server.http().listen(port, () => process.stdout.write(`${port}${os.EOL}`));

// const { address, dispose } = await startServer();
// const { browser, page } = await launch(address);
// await browser.close();
// await dispose();
