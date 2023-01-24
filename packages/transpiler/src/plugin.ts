import type { NodePath, PluginObj, Visitor } from "@babel/core";
import type {
  AwaitExpression,
  CallExpression,
  Expression,
  FunctionDeclaration,
  Identifier,
  MemberExpression,
  ObjectExpression,
  ObjectProperty,
  StringLiteral,
} from "@babel/types";
import { RuleSyntaxError } from "./errors";
import { checkIdentifier, IdElement } from "./ident";
import { Category } from "./types";

type BabelExport = typeof import("@babel/core");
type IdVisitorState = {
  target: IdElement[] | null;
  sendId: Identifier;
};
type TopVisitorState = {
  assertId: Identifier;
  sendId: Identifier;
  addCaseId: Identifier;
};

export default function (babel: BabelExport): PluginObj {
  const { types } = babel;

  /**
   * Map Record<string, Expression> to AST.
   * @param obj
   * @returns
   */
  function objAst(obj: Record<string, Expression>): ObjectExpression {
    return types.objectExpression(
      Object.entries(obj).map(([k, v]) =>
        types.objectProperty(
          types.isValidIdentifier(k)
            ? types.identifier(k)
            : types.stringLiteral(k),
          v
        )
      )
    );
  }

  /**
   * Transform a JS object to Babel AST, in literal form.
   * @param literal
   * @returns
   */
  function astify(literal: unknown): Expression {
    if (literal === null) {
      return types.nullLiteral();
    }
    switch (typeof literal) {
      case "number":
        return types.numericLiteral(literal);
      case "string":
        return types.stringLiteral(literal);
      case "boolean":
        return types.booleanLiteral(literal);
      case "undefined":
        return types.unaryExpression("void", types.numericLiteral(0), true);
      case "bigint":
        return types.bigIntLiteral(literal.toString());
      case "function":
      case "symbol":
        throw new Error(`${typeof literal} not supported`);
      default:
        if (Array.isArray(literal)) {
          return types.arrayExpression(literal.map(astify));
        }
        if (literal instanceof RegExp) {
          return types.regExpLiteral(literal.source, literal.flags);
        }
        const lit = literal as Record<string, unknown>;
        return types.objectExpression(
          Object.keys(lit)
            .filter((k) => typeof k === "string")
            .map((k): ObjectProperty => {
              return types.objectProperty(
                types.isValidIdentifier(k)
                  ? types.identifier(k)
                  : types.stringLiteral(k),
                astify(lit[k])
              );
            })
        );
    }
  }

  function importIdentifiers(ids: string[], path: NodePath) {
    const localIds = ids.map((id) => path.scope.generateUidIdentifier(id));

    const importDecl = types.importDeclaration(
      localIds.map((local, i) =>
        types.importSpecifier(local, types.identifier(ids[i]))
      ),
      types.stringLiteral("graduate")
    );
    return {
      localIds,
      importDecl,
    };
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
            types.isExpression(n)
          ),
        });
      }
      if (
        path.parent.type !== "MemberExpression" &&
        path.parent.type !== "CallExpression"
      ) {
        console.log(this.target);
        const production = checkIdentifier("web.assert", this.target);
        this.target = null;

        if (path.parent.type !== "AwaitExpression") {
          path.replaceWith({
            type: "AwaitExpression",
            argument: types.callExpression(this.sendId, [astify(production)]),
          });
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
        sendId: this.sendId,
      });
      const caseId = path.scope.generateUidIdentifier();
      path.replaceWith(types.functionDeclaration(caseId, [], path.node));
      path.insertAfter(
        types.expressionStatement(
          types.callExpression(this.addCaseId, [caseId])
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

        let arg: ObjectExpression;
        if (expression.type === "BinaryExpression") {
          const { left, right } = expression;
          if (left.type === "PrivateName") {
            throw new SyntaxError("private here?");
          }
          arg = objAst({
            type: types.stringLiteral("binary"),
            src: types.stringLiteral(src),
            op: types.stringLiteral(expression.operator),
            lhs: left,
            rhs: right,
          });
        } else {
          arg = objAst({
            type: types.stringLiteral("other"),
            src: types.stringLiteral(src),
            expr: expression,
          });
        }
        path.replaceWith(types.callExpression(this.assertId, [arg]));
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
        const {
          importDecl,
          localIds: [setCategoryId, assertId, sendId, addCaseId],
        } = importIdentifiers(
          ["setCategory", "assert", "send", "addCase"],
          path
        );
        body.splice(
          0,
          0,
          importDecl,
          types.expressionStatement(
            types.callExpression(setCategoryId, [types.stringLiteral(category)])
          )
        );

        path.traverse(topVisitor, {
          assertId,
          sendId,
          addCaseId,
        });
      },
    },
  };
}
