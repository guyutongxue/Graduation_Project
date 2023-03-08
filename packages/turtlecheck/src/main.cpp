#include <Windows.h>
#include <shellscalingapi.h>

#include <iostream>
#include <memory>

namespace {

enum class Error : int {
    None,
    CreateFileError,
    WriteFileError,
    SetProcessDpiError,
    SetForegroundError,
    GetWindowRectError,
    GetDCError,
    CreateCompatibleDCError,
    CreateCompatibleBitmapError,
    SelectObjectError,
    BitBltError,
    GetDIBitsError,
};

BITMAPINFOHEADER createBitmapHeader(int width, int height) {
    BITMAPINFOHEADER bi{
        .biSize = sizeof(BITMAPINFOHEADER),
        .biWidth = width,
        .biHeight = -height,  // this is the line that makes it draw upside down or not
        .biPlanes = 1,
        .biBitCount = 32,
        .biCompression = BI_RGB,
        .biSizeImage = 0,
        .biXPelsPerMeter = 0,
        .biYPelsPerMeter = 0,
        .biClrUsed = 0,
        .biClrImportant = 0,
    };
    return bi;
}

Error writeBmpFile(LPCWSTR filename, PBITMAPINFOHEADER bi, std::unique_ptr<char[]> data) {
    HANDLE file =
        CreateFileW(filename, GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (file == INVALID_HANDLE_VALUE) {
        return Error::CreateFileError;
    }

    BITMAPFILEHEADER bfh{};
    bfh.bfType = 0x4d42;  // "BM"
    bfh.bfOffBits = sizeof(BITMAPFILEHEADER) + bi->biSize + bi->biClrUsed * sizeof(RGBQUAD);
    bfh.bfSize = bfh.bfOffBits + bi->biSizeImage;

    DWORD dwWritten = 0;
    if (!WriteFile(file, &bfh, sizeof(bfh), &dwWritten, NULL) ||
        !WriteFile(file, bi, sizeof(BITMAPINFOHEADER), &dwWritten, NULL) ||
        !WriteFile(file, data.get(), bi->biSizeImage, &dwWritten, NULL)) {
        CloseHandle(file);
        return Error::WriteFileError;
    }

    CloseHandle(file);
    return Error::None;
}

}  // namespace

extern "C" __declspec(dllexport) Error CaptureWindow(HWND hWnd, LPCWSTR filename) {
    // Dynamically set DPI awareness
    // if (SetProcessDpiAwareness(PROCESS_PER_MONITOR_DPI_AWARE) != S_OK) {
    //     return Error::SetProcessDpiError;
    // }
    // Bring the window to the foreground
    if (!SetForegroundWindow(hWnd)) {
        return Error::SetForegroundError;
    }
    Sleep(100);
    // Get windows's position
    RECT clientRect{};
    if (!GetWindowRect(hWnd, &clientRect)) {
        return Error::GetWindowRectError;
    }
    auto [left, top, right, bottom] = clientRect;
    int width = right - left;
    int height = bottom - top;

    // Get handles to a device context (DC)
    HDC hdcScreen = GetDC(HWND_DESKTOP);
    if (!hdcScreen) {
        return Error::GetDCError;
    }
    HDC hdcWindow = CreateCompatibleDC(hdcScreen);
    if (!hdcWindow) {
        ReleaseDC(HWND_DESKTOP, hdcScreen);
        return Error::CreateCompatibleDCError;
    }

    // Create a bitmap
    HBITMAP hbWindow = CreateCompatibleBitmap(hdcScreen, width, height);
    if (!hbWindow) {
        DeleteDC(hdcWindow);
        ReleaseDC(HWND_DESKTOP, hdcScreen);
        return Error::CreateCompatibleBitmapError;
    }
    auto result = SelectObject(hdcWindow, hbWindow);
    if (result == HGDI_ERROR || result == nullptr) {
        DeleteObject(hbWindow);
        DeleteDC(hdcWindow);
        ReleaseDC(HWND_DESKTOP, hdcScreen);
        return Error::SelectObjectError;
    }

    BITMAPINFOHEADER bi = createBitmapHeader(width, height);
    DWORD dwBmpSize = ((width * bi.biBitCount + 31) / 32) * 4 * height;
    auto lpbitmap = std::make_unique_for_overwrite<char[]>(dwBmpSize);

    // Copy from the window device context to the bitmap device context
    // change SRCCOPY to NOTSRCCOPY for wacky colors
    if (!BitBlt(hdcWindow, 0, 0, width, height, hdcScreen, left, top, SRCCOPY)) {
        DeleteObject(hbWindow);
        DeleteDC(hdcWindow);
        ReleaseDC(HWND_DESKTOP, hdcScreen);
        return Error::BitBltError;
    }
    if (!GetDIBits(hdcWindow, hbWindow, 0, height, lpbitmap.get(),
                   reinterpret_cast<BITMAPINFO*>(&bi), DIB_RGB_COLORS)) {
        DeleteObject(hbWindow);
        DeleteDC(hdcWindow);
        ReleaseDC(HWND_DESKTOP, hdcScreen);
        return Error::GetDIBitsError;
    }

    if (writeBmpFile(filename, &bi, std::move(lpbitmap)) != Error::None) {
        DeleteObject(hbWindow);
        DeleteDC(hdcWindow);
        ReleaseDC(HWND_DESKTOP, hdcScreen);
        return Error::WriteFileError;
    }

    DeleteObject(hbWindow);
    DeleteDC(hdcWindow);
    ReleaseDC(HWND_DESKTOP, hdcScreen);
    return Error::None;
}
