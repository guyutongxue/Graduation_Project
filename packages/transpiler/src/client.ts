import { globals } from "./definitions.js";
import type { Static } from "runtypes";

export type Globals = {
  [K in keyof typeof globals]: Static<typeof globals[K]>;
};

declare global {
  const $: Globals["$"];
}
