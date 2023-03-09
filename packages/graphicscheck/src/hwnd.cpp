#include "./hwnd.h"

static bool found{false};
static HWND gHwnd{nullptr};
static BOOL CALLBACK enumWindowsByPid(HWND hwnd, LPARAM lParam) {
  DWORD lpdwProcessId;
  GetWindowThreadProcessId(hwnd, &lpdwProcessId);
  if (lpdwProcessId == lParam) {
    found = true;
    gHwnd = hwnd;
    return FALSE;
  }
  return TRUE;
}

std::optional<HWND> getHwnd(DWORD pid) {
  found = false;
  EnumWindows(enumWindowsByPid, pid);
  return found ? std::make_optional(gHwnd) : std::nullopt;
}
