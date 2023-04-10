#pragma once

#include <Windows.h>

#include <boost/filesystem.hpp>
#include <iostream>
#include <nlohmann/json.hpp>

#include "./input.h"

class Server {
private:
  static inline const boost::filesystem::path PY_SCRIPT_PATH{
      boost::filesystem::path(__FILE__).parent_path() / "../python/init.py"};

  bool usePython;

  std::string path;
  DWORD pid{0};
  HWND hWnd{nullptr};

public:
  Server(bool usePython = false) : usePython{usePython} {};

  bool initialize(const std::string& path);
  bool restart();
  bool dispose();

  std::string screenshot(nlohmann::json);
  bool click(ClickArgs);
  bool key(KeyArgs);

  ~Server();
};
