#include "./server.h"

#include <boost/process.hpp>
#include <stdexcept>
#include <thread>
#include <unique_resource.hpp>

#include "./hwnd.h"

namespace bp = boost::process;
using namespace std::literals;

bool Server::initialize(const std::string& path) {
  bp::child child(bp::search_path("python"), PY_SCRIPT_PATH.string(), path);
  this->path = path;
  this->pid = child.id();
  // std::cout << pid << std::endl;
  if (auto h = getHwnd(pid, 10s)) {
    this->hWnd = *h;
    // std::cout << hWnd << std::endl;
  } else {
    throw std::runtime_error("Could not find window in 10s");
  }
  child.detach();
  return true;
}

bool Server::restart() {
  return dispose() && initialize(this->path);
}

bool Server::dispose() {
  std::this_thread::sleep_for(1s);
  auto h = std_experimental::make_unique_resource(
      OpenProcess(PROCESS_TERMINATE, FALSE, this->pid), &CloseHandle);
  TerminateProcess(h, 1);
  return true;
}

Server::~Server() {
  dispose();
}
