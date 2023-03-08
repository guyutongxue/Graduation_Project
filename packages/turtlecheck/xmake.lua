target("screenshot")
  set_kind("shared")
  add_files("src/*.cpp")
  add_files("src/app.manifest")
  set_languages("c++20")
  -- set_targetdir("lib")
  add_defines("UNICODE", "_UNICODE")
  add_links("gdi32", "user32", "shcore")
  if is_plat("windows") then
    add_cxflags("/utf-8")
  end
