import { transform } from "@babel/standalone";
import { parse } from "@babel/parser";
import type {
  Program,
  Statement,
  Expression,
  BinaryExpression,
} from "@babel/types";
import { RuleSyntaxError } from "./errors";
import { checkIdentifier, parseIdentifier } from "./ident";
import { Action, Assertion, AssertTarget, Category, Operator } from "./types";
import { WebAssertTarget, WebControl } from "./webcheck-types";
import plg from "./plugin";

const TEST_SRC = `
"use web";
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}
{
  assert: $.title == "Hello, World";
  $("#hello").click();
  assert: "Hello, JavaScript" in $("body").html;
}
`;

function checkCategory(ast: Program) {
  const blocks = ast.body;
  if (ast.directives.length !== 1) {
    throw new RuleSyntaxError(
      'The first statement of rules must be "use ..."',
      ast
    );
  }
  let category: Category;
  if (ast.directives[0].value.value === "use web") {
    category = "web";
  } else {
    throw new RuleSyntaxError(
      `Unknown rule header ${ast.directives[0].value.value}`,
      ast.directives[0]
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

function checkControl(expr: Expression): WebControl {
  return checkIdentifier("web.control", parseIdentifier(expr));
}

function checkExpression(expr: Expression): AssertTarget<"web"> {
  if (expr.type === "StringLiteral" || expr.type === "NumericLiteral") {
    return {
      target: "constant",
      value: expr.value,
    };
  }
  return checkIdentifier("web.assert", parseIdentifier(expr));
}

function checkAssert(expr: BinaryExpression): Assertion {
  const lhs = expr.left as Expression; // fix me
  const rhs = expr.right;
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
  const ast = parse(src, {
    sourceType: "script",

    strictMode: true,
  });
  const { category, blocks } = checkCategory(ast.program);
  if (category !== "web") {
    throw new Error("no impl");
  }
  const actions = blocks.map(checkStatements);
  console.log(JSON.stringify(actions, undefined, 2));
  return actions;
}
try {
  const r = transform(TEST_SRC, {
    filename: "test.rule.js",
    sourceType: "module",
    plugins: [plg],
  });
  console.log(r.code);
} catch (e) {
  if (e instanceof RuleSyntaxError) {
    console.log(e.position);
  } else {
    console.error(e);
  }
}

// transpile(TEST_SRC);

export * from "./types";
export * from "./errors";
