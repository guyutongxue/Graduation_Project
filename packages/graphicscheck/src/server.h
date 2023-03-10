#pragma once

#include <Windows.h>

#include <boost/filesystem.hpp>
#include <iostream>

class Server {
private:
  static inline const boost::filesystem::path PY_SCRIPT_PATH{
      boost::filesystem::path(__FILE__).parent_path() / "../python/init.py"};

  std::string path;
  DWORD pid{0};
  HWND hWnd{nullptr};

public:
  Server() = default;

  bool initialize(const std::string& path);
  bool restart();
  bool dispose();

  ~Server();
};
