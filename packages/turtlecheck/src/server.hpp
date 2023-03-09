#pragma once

#include <iostream>

#include <boost/filesystem.hpp>
#include <boost/process.hpp>
#include <stdexcept>
#include <thread>

#include <Windows.h>
#include <processthreadsapi.h>

#include "./hwnd.h"

namespace bp = boost::process;
using namespace std::literals;
// namespace bn = boost::nowide;

class Server {
 private:
  static inline const boost::filesystem::path PY_SCRIPT_PATH{
      boost::filesystem::path(__FILE__).parent_path() / "../python/init.py"};

  std::string path;
  DWORD pid{0};
  HWND hWnd{nullptr};
 public:
  Server() {}

  bool initialize(const std::string& path) {
    bp::child child(bp::search_path("python"), PY_SCRIPT_PATH.string(), path);
    this->path = path;
    pid = child.id();
    std::cout << pid << std::endl;
    if (auto h = getHwnd(pid, 10s)) {
      hWnd = *h;
      std::cout << hWnd << std::endl;
    } else {
      throw std::runtime_error("Could not find window in 10s");
    }
    child.detach();
    return true;
  }

  bool restart() {
    return dispose() && initialize(path);
  }

  bool dispose() {
    std::this_thread::sleep_for(1s);
    auto pHandle = OpenProcess(PROCESS_TERMINATE, FALSE, pid);
    TerminateProcess(pHandle, 1);
    CloseHandle(pHandle);
    return true;
  }

  int add(int a, int b) {
    return a + b;
  }

  ~Server() {
    dispose();
  }
};
