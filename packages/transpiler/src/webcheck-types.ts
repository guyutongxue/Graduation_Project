import { ControlBase, TargetBase } from "./types";

interface ClickControl extends ControlBase {
  how: "click";
  selector: string;
}

interface ValueControl extends ControlBase {
  how: "value";
  selector: string;
  value: string;
}

interface KeyControl extends ControlBase {
  how: "key";
  key: string;
}

export type WebControl = ClickControl | ValueControl | KeyControl;

interface PageTarget extends TargetBase<"page"> {
  component: "title" | "text" | "html"
}

type SelectorType = {
  text: string;
  html: string;
  count: number;
};

export type SelectorProp = keyof SelectorType;

interface SelectorTarget<K extends SelectorProp> extends TargetBase<"selector">  {
  selector: string;
  component: K;
}

export type WebAssertTarget = PageTarget | SelectorTarget<SelectorProp>;
