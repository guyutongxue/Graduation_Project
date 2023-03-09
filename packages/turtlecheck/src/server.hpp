#pragma once

#include <iostream>

#include <boost/filesystem.hpp>
#include <boost/process.hpp>

#include <Windows.h>

namespace bp = boost::process;
// namespace bn = boost::nowide;

class Server {
 private:
  static inline const boost::filesystem::path PY_SCRIPT_PATH{
      boost::filesystem::path(__FILE__).parent_path() / "../python/init.py"};

  DWORD pythonPid{0};
 public:
  Server() {}

  bool initialize(const std::string& path) {
    bp::child child(bp::search_path("python"), PY_SCRIPT_PATH.string(), path);
    pythonPid = child.id();
    std::cout << pythonPid << std::endl;
    child.detach();
    return true;
  }

  int add(int a, int b) {
    return a + b;
  }
};
