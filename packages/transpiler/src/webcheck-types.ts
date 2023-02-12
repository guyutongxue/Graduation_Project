
interface ClickControl  {
  method: "click";
  selector: string;
}

interface InputControl {
  method: "input";
  selector: string;
  value: string;
}

interface KeyControl {
  method: "key";
  key: string;
}

interface PageTarget {
  method: "page";
  component: "title" | "text" | "html"
}


interface SelectorTarget {
  method: "selector";
  selector: string;
  component: "text" | "html" | "count";
}

export type WebCommand = ClickControl | KeyControl | InputControl | PageTarget | SelectorTarget;
