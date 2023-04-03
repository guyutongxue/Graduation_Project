#include <Windows.h>

#include <nlohmann/json.hpp>

struct ClickArgs {
  float x;
  float y;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(ClickArgs, x, y);
};

bool clickOnWindow(HWND hWnd, float x, float y);
bool keyOnWindow(HWND hWnd, int keyCode);
