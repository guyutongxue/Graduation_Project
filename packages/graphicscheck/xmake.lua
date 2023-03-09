add_rules("mode.debug", "mode.release");

add_requires("cpp-httplib", "nlohmann_json", "boost")

target("graphicscheck")
  -- Add third party libraries
  add_packages("cpp-httplib", "nlohmann_json", "boost")
  add_includedirs("third_party/json-rpc-cxx/include", "third_party/unique_resource")

  -- Input files
  add_files("src/*.cpp")
  add_files("src/app.manifest")
  set_languages("c++20")

  -- Windows specific settings
  add_defines("UNICODE", "_UNICODE", "WIN32_LEAN_AND_MEAN")
  add_links("gdi32", "user32", "shell32", "shcore")
  if is_plat("windows") then
    add_cxflags("/utf-8")
  end

  set_kind("binary")
  set_targetdir("bin")
