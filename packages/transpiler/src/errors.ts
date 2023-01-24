export interface IPosition {
  start?: number | null;
  end?: number | null;
}

export class RuleSyntaxError extends SyntaxError {
  constructor(message: string, public position: IPosition) {
    super(message);
  }
}
