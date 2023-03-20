
#include <nlohmann/json.hpp>

struct ClickArgs {
  float x;
  float y;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(ClickArgs, x, y);
};
