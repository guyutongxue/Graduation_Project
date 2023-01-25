import type { NodePath, PluginObj, Visitor } from "@babel/core";
import type {
  AwaitExpression,
  CallExpression,
  Expression,
  FunctionDeclaration,
  Identifier,
  MemberExpression,
  Node,
  ObjectExpression,
  ObjectProperty,
  Program,
  StringLiteral,
} from "@babel/types";
import { RuleSyntaxError } from "./errors";
import { checkIdentifier, IdElement } from "./ident";
import { Category } from "./types";

type BabelExport = typeof import("@babel/core");

export default function (babel: BabelExport): PluginObj {
  const { types: t } = babel;

  /**
   * Transform a JS object to Babel AST, in literal form.
   * @param literal
   * @param preserveAst Preserve AST Node in any component
   * @returns
   */
  function astify(literal: unknown, preserveAst = false): Expression {
    // Dirty hack here
    function isNode(l: any): l is Expression {
      if (l?.constructor?.name === "Node") return true;
      return (
        typeof l?.type === "string" &&
        (l.type.endsWith("Expression") || l.type.endsWith("Literal"))
      );
    }
    if (preserveAst && isNode(literal)) {
      return literal;
    }
    if (literal === null) {
      return t.nullLiteral();
    }
    switch (typeof literal) {
      case "number":
        return t.numericLiteral(literal);
      case "string":
        return t.stringLiteral(literal);
      case "boolean":
        return t.booleanLiteral(literal);
      case "undefined":
        return t.unaryExpression("void", t.numericLiteral(0), true);
      case "bigint":
        return t.bigIntLiteral(literal.toString());
      case "function":
      case "symbol":
        throw new Error(`${typeof literal} not supported`);
      default:
        if (Array.isArray(literal)) {
          return t.arrayExpression(literal.map((l) => astify(l, preserveAst)));
        }
        if (literal instanceof RegExp) {
          return t.regExpLiteral(literal.source, literal.flags);
        }

        const lit = literal as Record<string, unknown>;
        return t.objectExpression(
          Object.entries(lit)
            .filter(([k]) => typeof k === "string")
            .map(([k, v]): ObjectProperty => {
              return t.objectProperty(
                t.isValidIdentifier(k) ? t.identifier(k) : t.stringLiteral(k),
                astify(v, preserveAst)
              );
            })
        );
    }
  }

  type IdVisitorState = {
    readonly controller: RuleController;
    target: IdElement[] | null;
  };
  type TopVisitorState = {
    readonly controller: RuleController;
  };
  class RuleController {
    #controllerId: Identifier;

    constructor(public readonly category: Category, path: NodePath<Program>) {
      const controllerClassId = path.scope.generateUidIdentifier("Controller");
      this.#controllerId = path.scope.generateUidIdentifier("controller");
      const importDecl = t.importDeclaration(
        [t.importSpecifier(controllerClassId, t.identifier("Controller"))],
        t.stringLiteral("graduate")
      );
      const initDecl = t.variableDeclaration("const", [
        t.variableDeclarator(
          this.#controllerId,
          t.newExpression(controllerClassId, [t.stringLiteral(category)])
        ),
      ]);
      path.node.body.splice(0, 0, importDecl, initDecl);
    }
    private method(name: string) {
      return t.memberExpression(this.#controllerId, t.identifier(name));
    }
    readonly assert = () => this.method("assert");
    readonly send = () => this.method("send");
    readonly addCase = () => this.method("addCase");
  }

  function transformId<T extends MemberExpression | CallExpression>(
    this: IdVisitorState,
    path: NodePath<T>
  ) {
    if (this.target) {
      const node = path.node;
      if (node.type === "MemberExpression") {
        const prop = node.property;
        if (prop.type !== "Identifier") {
          throw new SyntaxError("nah");
        }
        this.target.push({
          type: "identifier",
          name: prop.name,
        });
      } else {
        this.target.push({
          type: "call",
          args: node.arguments.filter((n): n is Expression =>
            t.isExpression(n)
          ),
        });
      }
      if (
        path.parent.type !== "MemberExpression" &&
        path.parent.type !== "CallExpression"
      ) {
        console.log(this.target);
        const production = checkIdentifier(
          this.controller.category,
          this.target
        );
        this.target = null;

        if (path.parent.type !== "AwaitExpression") {
          path.replaceWith(
            t.awaitExpression(
              t.callExpression(this.controller.send(), [
                astify(production, true),
              ])
            )
          );
        }
      }
    }
  }
  const idVisitor: Visitor<IdVisitorState> = {
    Identifier: {
      enter(path) {
        const name = path.node.name;
        if (path.isReferencedIdentifier() && !path.scope.hasBinding(name)) {
          this.target = [
            {
              type: "identifier",
              name: name,
            },
          ];
        }
      },
    },
    MemberExpression: {
      exit(path) {
        transformId.call(this, path);
      },
    },
    CallExpression: {
      exit(path) {
        transformId.call(this, path);
      },
    },
  };
  const topVisitor: Visitor<TopVisitorState> = {
    BlockStatement(path) {
      if (path.parent.type !== "Program") return;
      path.traverse(idVisitor, {
        target: null,
        controller: this.controller,
      });
      const caseId = path.scope.generateUidIdentifier();
      path.replaceWith(t.functionDeclaration(caseId, [], path.node));
      path.insertAfter(
        t.expressionStatement(
          t.callExpression(this.controller.addCase(), [caseId])
        )
      );
    },
    LabeledStatement: {
      exit(path) {
        const { node } = path;
        if (node.label.name !== "assert") return;
        const statement = node.body;
        if (statement.type !== "ExpressionStatement") {
          throw new SyntaxError("Assert not an expression");
        }
        const { expression } = statement;
        const offset = (expression.start ?? 0) - (node.start ?? 0);
        const length = (expression.end ?? 1) - (expression.start ?? 0);
        const src = path.getSource().substring(offset, offset + length);

        let arg: Expression;
        if (expression.type === "BinaryExpression") {
          const { left, right } = expression;
          if (left.type === "PrivateName") {
            throw new SyntaxError("private here?");
          }
          arg = astify(
            {
              type: t.stringLiteral("binary"),
              src: t.stringLiteral(src),
              op: t.stringLiteral(expression.operator),
              lhs: left,
              rhs: right,
            },
            true
          );
        } else {
          arg = astify(
            {
              type: t.stringLiteral("other"),
              src: t.stringLiteral(src),
              expr: expression,
            },
            true
          );
        }
        path.replaceWith(t.callExpression(this.controller.assert(), [arg]));
      },
    },
  };
  return {
    visitor: {
      Program(path) {
        const { body, directives } = path.node;
        if (directives.length === 0) {
          throw new SyntaxError("no directive");
        }
        if (directives.length > 1) {
          throw new SyntaxError("multiple directives");
        }
        let category: Category;
        if (directives[0].value.value === "use web") {
          category = "web";
        } else {
          throw new RuleSyntaxError(
            `Unknown rule header ${directives[0].value.value}`,
            directives[0]
          );
        }
        if (body.length === 0) {
          throw new RuleSyntaxError("Empty rule", path.node);
        }
        for (const stmt of body) {
          if (stmt.type !== "BlockStatement") {
            throw new RuleSyntaxError(
              `A block expected at top-level, ${stmt.type} found`,
              stmt
            );
          }
        }
        path.node.directives = [];
        const controller = new RuleController(category, path);
        path.traverse(topVisitor, {
          controller,
        });
      },
    },
  };
}
