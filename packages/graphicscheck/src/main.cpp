#include <boost/nowide/filesystem.hpp>
#include <iostream>
#include <jsonrpccxx/server.hpp>
#include <stdexcept>
#include <thread>

#include "./http_connector.hpp"
#include "./server.h"

#define BIND(rpc, app, method) \
  rpc.Add(#method, jsonrpccxx::GetHandle(&decltype(app)::method, app))

int main(int argc, char** argv) {
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
