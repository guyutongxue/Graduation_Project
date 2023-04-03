#include "./input.h"
#include <winuser.h>

bool clickOnWindow(HWND hWnd, float x, float y) {
  if (!SetForegroundWindow(hWnd)) {
    throw std::runtime_error("Could not set foreground window");
  }
  Sleep(100);
  
  auto screenWidth = GetSystemMetrics(SM_CXSCREEN);
  auto screenHeight = GetSystemMetrics(SM_CYSCREEN);

  RECT clientRect{};
  if (!GetWindowRect(hWnd, &clientRect)) {
    throw std::runtime_error("Could not get window rect");
  }
  auto [left, top, right, bottom] = clientRect;
  int width = right - left;
  int height = bottom - top;

  x = (x * width + left) / screenWidth;
  y = (y * height + top) / screenHeight;
  LONG dx = std::floor(x * 65536);
  LONG dy = std::floor(y * 65536);
  INPUT inputs[3]{
    {
      .type = INPUT_MOUSE,
      .mi = {
        .dx = dx,
        .dy = dy,
        .dwFlags = MOUSEEVENTF_ABSOLUTE | MOUSEEVENTF_MOVE,
      }
    },
    {
      .type = INPUT_MOUSE,
      .mi = {
        .dwFlags = MOUSEEVENTF_LEFTDOWN
      }
    },
    {
      .type = INPUT_MOUSE,
      .mi = {
        .dwFlags = MOUSEEVENTF_LEFTUP
      }
    }
  };
  int sent = SendInput(std::size(inputs), inputs, sizeof(INPUT));
  Sleep(100);
  return sent == std::size(inputs);
}

bool keyOnWindow(HWND hWnd, int keyCode) {
  if (!SetForegroundWindow(hWnd)) {
    throw std::runtime_error("Could not set foreground window");
  }
  Sleep(100);
  
  ULONG_PTR extraInfo = GetMessageExtraInfo();

  INPUT inputs[2]{
    {
      .type = INPUT_KEYBOARD,
      .ki = {
        .wVk = static_cast<WORD>(keyCode),
        .dwFlags = 0,
        .dwExtraInfo = extraInfo,
      }
    },
    {
      .type = INPUT_KEYBOARD,
      .ki = {
        .wVk = static_cast<WORD>(keyCode),
        .dwFlags = KEYEVENTF_KEYUP,
        .dwExtraInfo = extraInfo,
      }
    }
  };
  int sent = SendInput(std::size(inputs), inputs, sizeof(INPUT));
  Sleep(100);
  return sent == std::size(inputs);
}
