import importlib.machinery
import importlib.util
import importlib
import sys

sys.modules["__turtle__"] = importlib.import_module("turtle")
sys.modules["turtle"] = importlib.import_module("turtle_wrapper")

def import_user_script(path):
    # Load user script as module
    spec = importlib.util.spec_from_file_location("user_script", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

import_user_script("C:\\Users\\Guyutongxue\\Documents\\MyFiles\\Graduation_Project\\packages\\turtlecheck\\user.py")
