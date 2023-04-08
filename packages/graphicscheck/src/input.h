#include <Windows.h>

#include <nlohmann/json.hpp>
#include "nlohmann/detail/macro_scope.hpp"

struct ClickArgs {
  float x;
  float y;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(ClickArgs, x, y);
};

struct KeyArgs {
  int keyCode;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(KeyArgs, keyCode);
};

bool clickOnWindow(HWND hWnd, float x, float y);
bool keyOnWindow(HWND hWnd, int keyCode);
