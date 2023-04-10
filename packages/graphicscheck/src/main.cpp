#include <boost/nowide/filesystem.hpp>
#include <boost/program_options.hpp>
#include <iostream>
#include <jsonrpccxx/server.hpp>
#include <stdexcept>
#include <thread>

#include "./http_connector.hpp"
#include "./server.h"
#include "boost/program_options/options_description.hpp"

#define BIND(rpc, app, method) \
  rpc.Add(#method, jsonrpccxx::GetHandle(&decltype(app)::method, app))

namespace po = boost::program_options;

int main(int argc, char** argv) {
  boost::nowide::nowide_filesystem();

  po::options_description desc;
  desc.add_options()
    ("port,p", po::value<int>(), "Port to listen on")
    ("python", "Use Python host script");

  po::variables_map vm;
  po::store(po::parse_command_line(argc, argv, desc), vm);
  po::notify(vm);

  bool usePython = vm.count("python") > 0;
  int port = vm.count("port") > 0 ? vm["port"].as<int>() : 8080;

  jsonrpccxx::JsonRpc2Server rpc;
  Server app(usePython);
  BIND(rpc, app, initialize);
  BIND(rpc, app, restart);
  BIND(rpc, app, dispose);
  BIND(rpc, app, screenshot);
  BIND(rpc, app, click);
  BIND(rpc, app, key);

  HttpConnector httpServer(rpc, port);
  std::cout << "Listening on port " << port << std::endl;
  httpServer.listen();
}
