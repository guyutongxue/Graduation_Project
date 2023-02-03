import { WebCommand } from "./webcheck-types.js";
import { FormCommand } from "./formcheck-types.js";

export type Category = "web" | "form";

// https://github.com/Microsoft/TypeScript/issues/24274#issuecomment-471435068
type Implements<T, U extends T> = {}

interface CommandBase {
  method: string;
}

export interface AllCommand extends Implements<Record<Category, CommandBase>, AllCommand> {
  web: WebCommand
  form: FormCommand
}

export type Command<C extends Category> = AllCommand[C];

export * from "./webcheck-types.js";
export * from "./formcheck-types.js";
