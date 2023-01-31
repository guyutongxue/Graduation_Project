/// <reference path="./runtypes.d.ts" />
import {
  Static,
  Runtype,
  Number,
  String,
  Union,
  Literal,
  Record,
  Unknown,
  Undefined,
} from "runtypes";
import { AllCommand, Category } from "./types.js";

export type { Static, Runtype } from "runtypes";
export { Null as RNull, Undefined as RUndefined } from "runtypes";

export const Call: unique symbol = Symbol();
export const Produced: unique symbol = Symbol();

export type CallSig = {
  parameters?: readonly Runtype[];
  returns?: Runtype;
};

type OrDefault<T, D> = T extends {} ? T : D;
type StaticMap<T extends readonly Runtype[]> = T extends readonly [
  infer Car extends Runtype,
  ...infer Cdr extends Runtype[]
]
  ? [Static<Car>, ...StaticMap<Cdr>]
  : [];

export function withCall<A, C extends CallSig>(
  this: Runtype<A>,
  call: C
): Runtype<A & StaticCallSig<C>> {
  return {
    ...this,
    [Call]: call,
  } as any;
}

export interface IProduction<C extends Category> {
  type: C;
  result: (...args: any[]) => AllCommand[C]
}

export function produces<A, C extends Category>(
  this: Runtype<A>,
  type: C,
  result: (...args: any[][]) => AllCommand[C]
): Runtype<A> {
  return {
    ...this,
    [Produced]: {
      type,
      result
    },
  };
}

type StaticLesser<T> = T extends Runtype ? Static<T> : undefined;
type StaticCallSig<C extends CallSig> = (
  ...args: StaticMap<OrDefault<C["parameters"], []>>
) => OrDefault<StaticLesser<C["returns"]>, void>;

type RuntypeFactory = (...args: any[]) => Runtype;

function patch<T extends RuntypeFactory | Runtype>(a: T): T {
  if (typeof a === "function") {
    return ((...args: any[]) => {
      const rt = a(...args);
      rt.withCall = withCall;
      rt.produces = produces;
      return rt;
    }) as any;
  } else {
    return {
      ...a,
      withCall: withCall,
      produces: produces,
    };
  }
}

export function Function<C extends CallSig>(
  call: C
): Runtype<StaticCallSig<C>> {
  return withCall.call({ ...Unknown }, call);
}

export const RRecord = patch(Record);
export const RUnknown = patch(Unknown);
export const RFunction = patch(Function);
export const RNumber = patch(Number);
export const RString = patch(String);
export const RVoid = patch(Undefined);
export const RLiteral = patch(Literal);
export const RUnion = patch(Union);
