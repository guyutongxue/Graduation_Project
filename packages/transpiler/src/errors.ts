export interface IPosition {
  start: number;
  end: number;
}

export class RuleSyntaxError extends SyntaxError {
  constructor(message: string, public position: IPosition) {
    super(message);
  }
}
