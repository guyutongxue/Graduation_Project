#include <boost/nowide/filesystem.hpp>
#include <iostream>
#include <jsonrpccxx/server.hpp>
#include <stdexcept>
#include <thread>

#include "./http_connector.hpp"
#include "./server.h"

int main(int argc, char** argv) {
  if (argc != 2) {
    std::cerr << "Usage: " << argv[0] << " <port>\n";
    std::exit(1);
  }

  auto port = std::stoi(argv[1]);
  using namespace jsonrpccxx;
  boost::nowide::nowide_filesystem();
  JsonRpc2Server rpcServer;
  Server app;
  rpcServer.Add("initialize", GetHandle(&Server::initialize, app));
  rpcServer.Add("restart", GetHandle(&Server::restart, app));
  rpcServer.Add("dispose", GetHandle(&Server::dispose, app));

  HttpConnector httpServer(rpcServer, port);
  std::cout << "Listening on port " << port << std::endl;
  httpServer.listen();
}
