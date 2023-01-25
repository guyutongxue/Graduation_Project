import { WebCommand } from "./webcheck-types";

export type Category = "web";

// https://github.com/Microsoft/TypeScript/issues/24274#issuecomment-471435068
type Implements<T, U extends T> = {}

export interface AllCommand extends Implements<Record<Category, unknown>, AllCommand> {
  web: WebCommand
}

export type Command<C extends Category> = AllCommand[C];
