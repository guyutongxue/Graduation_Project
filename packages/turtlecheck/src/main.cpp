#include <iostream>

#include <jsonrpccxx/server.hpp>
#include <thread>
#include <boost/nowide/filesystem.hpp>

#include "./http-connector.hpp"
#include "./server.hpp"

int main() {
  using namespace jsonrpccxx;
  boost::nowide::nowide_filesystem();
  JsonRpc2Server rpcServer;
  Server app;
  rpcServer.Add("initialize", GetHandle(&Server::initialize, app));
  rpcServer.Add("add", GetHandle(&Server::add, app));
  
  HttpConnector httpServer(rpcServer, 8484);
  std::cout << "Listening on port 8484" << std::endl;
  httpServer.listen();
}
