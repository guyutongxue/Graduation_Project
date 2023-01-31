import { WebCommand } from "./webcheck-types.js";

export type Category = "web";

// https://github.com/Microsoft/TypeScript/issues/24274#issuecomment-471435068
type Implements<T, U extends T> = {}

interface CommandBase {
  method: string;
}

export interface AllCommand extends Implements<Record<Category, CommandBase>, AllCommand> {
  web: WebCommand
}

export type Command<C extends Category> = AllCommand[C];

export { type WebCommand } from "./webcheck-types.js";
