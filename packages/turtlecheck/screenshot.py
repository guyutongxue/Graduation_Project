import ctypes
from tkinter import Tk

# screenshot.dll is using GetWindowRect. It needs the caller to be DPI aware.
result = ctypes.windll.shcore.SetProcessDpiAwareness(2)
if result != 0:
    raise Exception("SetProcessDpiAwareness failed")

dll = ctypes.windll.LoadLibrary("../cpp/lib/screenshot.dll")

def take_screenshot(tk: Tk, filename = "screenshot.bmp"):
    """
    takes a screenshot of a tkinter window, and saves it on in cwd
    """
    # print(tk.winfo_id())
    result = dll.CaptureWindow(tk.winfo_id(), filename)
    if result != 0:
        raise Exception(f"CaptureWindow failed with code {result}")
