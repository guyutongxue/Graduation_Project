#include "./hwnd.h"

// #include <iostream>

static bool found{false};
static HWND gHwnd{nullptr};
static BOOL CALLBACK enumWindowsByPid(HWND hwnd, LPARAM lParam) {
  DWORD lpdwProcessId;
  GetWindowThreadProcessId(hwnd, &lpdwProcessId);
  if (IsWindowVisible(hwnd) && lpdwProcessId == lParam) {
    found = true;
    gHwnd = hwnd;

    // Get the "Tk Child" root window.
    // The outer window ('gHwnd' here) contains title and window 3D shadow
    auto childWindow = GetWindow(hwnd, GW_CHILD);
    if (childWindow) {
      gHwnd = childWindow;
    }
    // List child window
    // EnumChildWindows(hwnd, [](HWND sub, LPARAM) { 
    //   char buf[256]{};
    //   GetClassNameA(sub, buf, 256);
    //   std::cout << std::int64_t(sub) << " " << buf << std::endl;
    //   return TRUE;
    // }, 0);
    return FALSE;
  }
  return TRUE;
}

std::optional<HWND> getHwnd(DWORD pid) {
  found = false;
  EnumWindows(enumWindowsByPid, pid);
  return found ? std::make_optional(gHwnd) : std::nullopt;
}
