#include <iostream>

#include <jsonrpccxx/server.hpp>
#include <thread>
#include <boost/nowide/filesystem.hpp>

#include "./http_connector.hpp"
#include "./server.hpp"

int main(int argc, char** argv) {
  if (argc != 2) {
    std::cout << "Usage: " << argv[0] << " <port>" << std::endl;
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
  rpcServer.Add("add", GetHandle(&Server::add, app));
  
  HttpConnector httpServer(rpcServer, port);
  std::cout << "Listening on port " << port << std::endl;
  httpServer.listen();
}
