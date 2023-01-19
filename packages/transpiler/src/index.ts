import * as acorn from "acorn";
import {
  Program,
  Statement,
  Expression,
  MemberExpression,
  SpreadElement,
  BinaryExpression,
  Identifier,
} from "estree";
import { checkIdentifier, parseIdentifier } from "./ident";
import {
  Action,
  Assertion,
  Category,
  Operator,
} from "./types";
export * from "./types";

export interface IPosition {
  start: number;
  end: number;
}

export class RuleSyntaxError extends SyntaxError {
  constructor(message: string, public position: IPosition) {
    super(message);
  }
}

const TEST_SRC = `
"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}
`;

function checkCategory(ast: Program) {
  const [node, ...blocks] = ast.body;
  if (typeof node === "undefined") {
    throw new RuleSyntaxError("Empty rule", ast);
  }
  let category: Category;
  if (
    node.type !== "ExpressionStatement" ||
    node.expression.type !== "Literal" ||
    typeof node.expression.value !== "string"
  ) {
    throw new RuleSyntaxError(
      'The first statement of rules must be "use ..."',
      node
    );
  }
  if (node.expression.value === "use web") {
    category = "web";
  } else {
    throw new RuleSyntaxError(
      `Unknown rule header ${node.expression.raw}`,
      node
    );
  }
  if (blocks.length === 0) {
    throw new RuleSyntaxError("Empty rule", ast);
  }
  let checkedBlocks: Statement[][] = [];
  for (const block of blocks) {
    if (block.type !== "BlockStatement") {
      throw new RuleSyntaxError(
        `A block expected at top-level, ${block.type} found`,
        block
      );
    }
    checkedBlocks.push(block.body);
  }
  return {
    category,
    blocks: checkedBlocks,
  };
}

function checkAction(prop: Identifier, args: (Expression | SpreadElement)[]) {
  const how = prop.name;
  if (how === "click") {
    return {
      how: "click" as const,
    };
  } else if (how === "key") {
    if (args.length !== 1)
      throw new RuleSyntaxError(`value accept 1 arg`, prop);
    const arg = args[0];
    if (arg.type !== "Literal" || typeof arg.value !== "string") {
      throw new RuleSyntaxError(`value should be string`, arg);
    }
    return {
      how: "key" as const,
      key: arg.value,
    };
  } else if (how === "value") {
    if (args.length !== 1)
      throw new RuleSyntaxError(`value accept 1 arg`, prop);
    const arg = args[0];
    if (arg.type !== "Literal" || typeof arg.value !== "string") {
      throw new RuleSyntaxError(`value should be string`, arg);
    }
    return {
      how: "value" as const,
      value: arg.value,
    };
  } else {
    throw new RuleSyntaxError(`Action ${how} not supported`, prop);
  }
}

function checkTarget(
  expr: MemberExpression,
  args: (Expression | SpreadElement)[]
) {
  const { object, property } = expr;
  if (property.type !== "Identifier") {
    throw new RuleSyntaxError("Unsupported syntax", property);
  }
  const action = checkAction(property, args);
  if (object.type === "Identifier" && object.name === "$") {
    throw new RuleSyntaxError("$ is not supported now", object);
  } else if (
    object.type === "CallExpression" &&
    object.callee.type === "Identifier" &&
    object.callee.name === "$"
  ) {
    if (object.arguments.length !== 1)
      throw new RuleSyntaxError("1 argument expected", object);
    const arg = object.arguments[0];
    if (arg.type !== "Literal" || typeof arg.value !== "string")
      throw new RuleSyntaxError(`Only string literal here`, arg);
    return {
      selector: arg.value,
      ...action,
    };
  } else {
    throw new RuleSyntaxError("Unknown target", expr);
  }
}

function checkControl(expr: Expression): Control {
  checkIdentifier("web", parseIdentifier(expr));
  if (expr.type !== "CallExpression") {
    throw new RuleSyntaxError("Expect a call here", expr);
  }
  if (expr.callee.type !== "MemberExpression") {
    throw new RuleSyntaxError("Expect a member expression here", expr);
  }
  const target = checkTarget(expr.callee, expr.arguments);
  return {
    type: "control",
    ...target,
  };
}

function checkExpression(expr: Expression): AssertExpression {
  if (expr.type === "Literal") {
    return {
      target: "constant",
      value: expr.value,
    };
  }
  console.log(checkIdentifier("web", parseIdentifier(expr)));
  if (expr.type !== "MemberExpression") {
    throw new RuleSyntaxError(
      `Only MemberExpression here, got ${expr.type}`,
      expr
    );
  }
  const { object, property } = expr;
  if (property.type !== "Identifier") {
    throw new RuleSyntaxError("Unsupported syntax", property);
  }
  if (
    object.type === "Identifier" &&
    object.name === "$" &&
    property.name === "title"
  ) {
    return {
      target: "page",
      component: "title",
    };
  } else if (
    object.type === "CallExpression" &&
    object.callee.type === "Identifier" &&
    object.callee.name === "$" &&
    ["text", "html", "count"].includes(property.name)
  ) {
    if (object.arguments.length !== 1)
      throw new RuleSyntaxError("1 argument expected", object);
    const arg = object.arguments[0];
    if (arg.type !== "Literal" || typeof arg.value !== "string")
      throw new RuleSyntaxError(`Only string literal here`, arg);
    return {
      target: "selector",
      selector: arg.value,
      component: property.name as any,
    };
  } else {
    throw new RuleSyntaxError("Unknown target", expr);
  }
}

function checkAssert(expr: BinaryExpression): Assertion {
  const lhs = expr.left;
  const rhs = expr.right;
  if (lhs.type === "Literal" && rhs.type === "Literal") {
    throw new RuleSyntaxError(`Asserting constants??`, expr);
  }
  let op: Operator;
  switch (expr.operator) {
    case "==":
      op = "eq";
      break;
    case "!=":
      op = "neq";
      break;
    case "<":
      op = "lt";
      break;
    case ">":
      op = "gt";
      break;
    case "<=":
      op = "lteq";
      break;
    case ">=":
      op = "gteq";
      break;
    case "in":
      op = "in";
      break;
    default:
      throw new RuleSyntaxError(`Unsupported operator ${expr.operator}`, expr);
  }
  return {
    type: "assert",
    lhs: checkExpression(lhs),
    rhs: checkExpression(rhs),
    operator: op,
  };
}

function checkStatements(statements: Statement[]) {
  const actions: Action[] = [];
  for (const stmt of statements) {
    if (stmt.type === "LabeledStatement") {
      if (stmt.label.name !== "assert") {
        throw new RuleSyntaxError(
          `Only "assert" is a valid label. Found "${stmt.label.name}"`,
          stmt.label
        );
      }
      if (stmt.body.type !== "ExpressionStatement") {
        throw new RuleSyntaxError(
          `Assertion should be an expression. Found ${stmt.body.type}`,
          stmt.body
        );
      }
      const expr = stmt.body.expression;
      if (expr.type !== "BinaryExpression") {
        throw new RuleSyntaxError(
          `Only binary expression is supported. Found ${expr.type}`,
          expr
        );
      }
      actions.push(checkAssert(expr));
    } else if (stmt.type === "ExpressionStatement") {
      const control = checkControl(stmt.expression);
      actions.push(control);
    } else {
      throw new RuleSyntaxError(`${stmt.type} is not supported here`, stmt);
    }
  }
  return actions;
}

export function transpile(src: string) {
  const ast = acorn.parse(src, { ecmaVersion: "latest" });
  const { category, blocks } = checkCategory(ast);
  if (category !== "web") {
    throw new Error("no impl");
  }
  const actions = blocks.map(checkStatements);
  // console.log(JSON.stringify(actions, undefined, 2));
  return actions;
}

transpile(TEST_SRC);
