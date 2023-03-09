#pragma once

#include <httplib.h>

#include <jsonrpccxx/iclientconnector.hpp>
#include <jsonrpccxx/server.hpp>
#include <string>

class HttpConnector {
 public:
  HttpConnector(jsonrpccxx::JsonRpcServer& server, int port)
      : rpcServer(server), httpServer(), port(port) {
    httpServer.Post("/", [this](auto&& req, auto&& res) {
      res.status = 200;
      res.set_content(this->rpcServer.HandleRequest(req.body),
                      "application/json");
    });
    httpServer.Get("/", [](auto&& req, auto&& res) {
      res.status = 405;
      res.set_content("Method not allowed", "text/plain");
    });
  }

  bool listen() {
    if (httpServer.is_running()) return false;
    return this->httpServer.listen("localhost", port);
  }

 private:
  jsonrpccxx::JsonRpcServer& rpcServer;
  httplib::Server httpServer;
  int port;
};
