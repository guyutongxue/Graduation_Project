import type { Call, CallSig, IProduction, Produced, produces, withCall } from "./runtypes-patch.js";
import { Category } from "./types.js";

declare module "runtypes/lib/runtype.js" {

  interface RuntypeBase<A = unknown> {
    [Call]?: CallSig;
    [Produced]?: IProduction<Category>;
    withCall: typeof withCall;
    produces: typeof produces;
  }
}
