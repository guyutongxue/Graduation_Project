#pragma once

#include <Windows.h>

#include <chrono>
#include <optional>


std::optional<HWND> getHwnd(DWORD pid);

template <typename Rep, typename Period>
std::optional<HWND> getHwnd(DWORD pid,
                            const std::chrono::duration<Rep, Period>& timeout) {
  using namespace std::literals;
  auto start = std::chrono::steady_clock::now();
  while (std::chrono::steady_clock::now() - start < timeout) {
    if (auto hwnd = getHwnd(pid)) {
      return hwnd;
    }
    std::this_thread::sleep_for(100ms);
  }
  return std::nullopt;
}
