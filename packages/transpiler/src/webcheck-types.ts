
interface ClickControl  {
  type: "click";
  selector: string;
}

interface ValueControl {
  type: "value";
  selector: string;
  value: string;
}

interface KeyControl {
  type: "key";
  key: string;
}

interface PageTarget {
  type: "page";
  component: "title" | "text" | "html"
}


interface SelectorTarget {
  type: "selector";
  selector: string;
  component: "text" | "html" | "count";
}

export type WebCommand = ClickControl | KeyControl | ValueControl | PageTarget | SelectorTarget;
