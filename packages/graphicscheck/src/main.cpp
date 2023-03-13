#include <boost/nowide/filesystem.hpp>
#include <iostream>
#include <jsonrpccxx/server.hpp>
#include <stdexcept>
#include <thread>

#include "./http_connector.hpp"
#include "./server.h"
// #include "./hwnd.h"
// #include "./screenshot.h"
// #include <fstream>

#define BIND(rpc, app, method) \
  rpc.Add(#method, jsonrpccxx::GetHandle(&decltype(app)::method, app))

int main(int argc, char** argv) {
  // if (auto hwnd = getHwnd(24172)) {
  //   std::cout << std::int64_t(*hwnd) << std::endl;
  //   auto [data, size] = captureWindow(*hwnd);
  //   std::ofstream ofs("a.bmp", std::ios::binary);
  //   ofs.write(reinterpret_cast<char*>(data.get()), size);
  //   return 0;
  // }
  if (argc != 2) {
    std::cerr << "Usage: " << argv[0] << " <port>\n";
    std::exit(1);
  }
  boost::nowide::nowide_filesystem();

  auto port = std::stoi(argv[1]);
  jsonrpccxx::JsonRpc2Server rpc;
  Server app;
  BIND(rpc, app, initialize);
  BIND(rpc, app, restart);
  BIND(rpc, app, dispose);
  BIND(rpc, app, screenshot);

  HttpConnector httpServer(rpc, port);
  std::cout << "Listening on port " << port << std::endl;
  httpServer.listen();
}
