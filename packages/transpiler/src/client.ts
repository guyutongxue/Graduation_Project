import { globals } from "./new_types";
import type { Static } from "runtypes";

export type Globals = {
  [K in keyof typeof globals]: Static<typeof globals[K]>;
};

declare global {
  const $: Globals["$"];
}
