import importlib.machinery
import importlib.util
import sys

turtle_spec = importlib.util.find_spec("turtle")

class TurtleImportFinder:
    def find_spec(self, fullname, path, target=None):
        if fullname == "turtle":
            # If the requested module is "turtle", return a custom spec that
            # loads turtle_wrapper.py instead of a standard module.
            return importlib.util.spec_from_loader("turtle", TurtleImportLoader())
        elif fullname == "__turtle__":
            # If the requested module is "__turtle__", return the real turtle
            return turtle_spec
        else:
            # Otherwise, use the default import mechanism.
            return None

class TurtleImportLoader:
    def create_module(self, spec):
        return None
    
    def exec_module(self, module):
        # Load library.py as module
        loader = importlib.machinery.SourceFileLoader("turtle_wrapper", "./turtle_wrapper.py")
        lib_module = loader.load_module()

        # Add library.py to sys.modules so it can be imported
        sys.modules["turtle"] = lib_module
        
        # Update the module object with the imported module
        module.__dict__.update(lib_module.__dict__)

sys.meta_path.insert(0, TurtleImportFinder())

def import_user_script(path):
    # Load user script as module
    spec = importlib.util.spec_from_file_location("user_script", path)
    user_script = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(user_script)


import_user_script("./user.py")
