#pragma once

#include <Windows.h>
#include <memory>

struct UniquePtrWithSize {
  std::unique_ptr<unsigned char[]> data;
  std::size_t size;
};
UniquePtrWithSize captureWindow(HWND hWnd);
