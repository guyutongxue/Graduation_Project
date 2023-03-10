#include "./screenshot.h"

#include <shellscalingapi.h>
#include <wingdi.h>

#include <boost/nowide/convert.hpp>
#include <functional>
#include <iostream>
#include <memory>
#include <unique_resource.hpp>

using namespace std::placeholders;
using std_experimental::make_unique_resource;

BITMAPINFOHEADER createBitmapHeader(unsigned width, unsigned height) {
  return BITMAPINFOHEADER{
      .biSize = sizeof(BITMAPINFOHEADER),
      .biWidth = static_cast<LONG>(width),
      // this is the line that makes it draw upside down or not
      .biHeight = -static_cast<LONG>(height),
      .biPlanes = 1,
      .biBitCount = 32,
      .biCompression = BI_RGB,
      .biSizeImage = ((width * 32 + 31) / 32) * 4 * height,
      .biXPelsPerMeter = 0,
      .biYPelsPerMeter = 0,
      .biClrUsed = 0,
      .biClrImportant = 0,
  };
}

struct PrepareBmpFileResult {
  std::unique_ptr<unsigned char[]> data;
  std::size_t size;
  BITMAPINFO* pBi;
  unsigned char* pImage;
};

PrepareBmpFileResult prepareBmpFile(int width, int height) {
  BITMAPINFOHEADER bi = createBitmapHeader(width, height);

  BITMAPFILEHEADER bfh{};
  bfh.bfType = 0x4d42;  // "BM"
  bfh.bfOffBits = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);
  bfh.bfSize = bfh.bfOffBits + bi.biSizeImage;

  auto allData = std::make_unique_for_overwrite<unsigned char[]>(bfh.bfSize);

  std::memcpy(allData.get(), &bfh, sizeof(BITMAPFILEHEADER));
  auto pbi = allData.get() + sizeof(BITMAPFILEHEADER);
  std::memcpy(pbi, &bi, sizeof(BITMAPINFOHEADER));
  auto pImage = allData.get() + bfh.bfOffBits;

  return {
      std::move(allData),
      bfh.bfSize,
      reinterpret_cast<BITMAPINFO*>(pbi),
      pImage
  };
}

UniquePtrWithSize captureWindow(HWND hWnd) {
  // Dynamically set DPI awareness
  // SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE);
  // Bring the window to the foreground
  if (!SetForegroundWindow(hWnd)) {
    throw std::runtime_error("Could not set foreground window");
  }
  Sleep(100);
  // Get windows's position
  RECT clientRect{};
  if (!GetWindowRect(hWnd, &clientRect)) {
    throw std::runtime_error("Could not get window rect");
  }
  auto [left, top, right, bottom] = clientRect;
  int width = right - left;
  int height = bottom - top;

  // Get handles to a device context (DC)
  auto hdcScreen = make_unique_resource(GetDC(HWND_DESKTOP),
                                        std::bind(ReleaseDC, HWND_DESKTOP, _1));
  if (!hdcScreen) {
    throw std::runtime_error("Could not get desktop DC");
  }
  auto hdcWindow =
      make_unique_resource(CreateCompatibleDC(hdcScreen), &DeleteDC);
  if (!hdcWindow) {
    throw std::runtime_error("Could not create compatible DC");
  }

  // Create a bitmap
  auto hbWindow = make_unique_resource(
      CreateCompatibleBitmap(hdcScreen, width, height), &DeleteObject);
  if (!hbWindow) {
    throw std::runtime_error("Could not create compatible bitmap");
  }
  auto result = SelectObject(hdcWindow, hbWindow);
  if (result == HGDI_ERROR || result == nullptr) {
    throw std::runtime_error("Could not select object");
  }

  auto [allData, size, pBi, pImg] = prepareBmpFile(width, height);

  // Copy from the window device context to the bitmap device context
  // change SRCCOPY to NOTSRCCOPY for wacky colors
  if (!BitBlt(hdcWindow, 0, 0, width, height, hdcScreen, left, top, SRCCOPY)) {
    throw std::runtime_error("Could not blit");
  }
  if (!GetDIBits(hdcWindow, hbWindow, 0, height, pImg, pBi, DIB_RGB_COLORS)) {
    throw std::runtime_error("Could not get DIBits");
  }

  return {
      std::move(allData),
      size,
  };
}
