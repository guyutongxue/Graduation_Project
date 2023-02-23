import ts from "typescript";

import { DefDefAst, DefDefItem } from "./types";

interface EntryWithParamName {
  paramName: string[];
  entry: Entry;
}

class Entry {
  postCalls = new Map<string, EntryWithParamName>();
  postMembers = new Map<string, Entry>();
  endType: string | undefined;
}

function parseToEntries(defs: DefDefItem[]): Map<string, Entry> {
  let globals = new Entry();
  // let currentCategory: string | undefined = undefined;

  for (const i of defs) {
    if (typeof i === "string") {
      // currentCategory = i;
      continue;
    }
    const { attr, form, type, production } = i;

    let currentEntry = globals;
    for (const part of form) {
      if (part.type === "identifier") {
        if (!currentEntry.postMembers.has(part.identifier)) {
          currentEntry.postMembers.set(part.identifier, new Entry());
        }
        currentEntry = currentEntry.postMembers.get(part.identifier)!;
      } else {
        const { parameters } = part;
        const types: string[] = [];
        const names: string[] = [];
        for (const p of parameters) {
          const { name, type } = p;
          types.push(type);
          names.push(name);
        }
        const typeKey = types.join(",");
        if (!currentEntry.postCalls.has(typeKey)) {
          currentEntry.postCalls.set(typeKey, {
            paramName: names,
            entry: new Entry(),
          });
        }
        currentEntry = currentEntry.postCalls.get(typeKey)!.entry;
      }
    }
    currentEntry.endType = type ?? "any";
  }
  return globals.postMembers;
}

class GlobalGeneratingEnv {
  printer = ts.createPrinter();
  file: ts.SourceFile;
  statements: ts.Statement[] = [];

  constructor(filename = "client.dts") {
    this.file = ts.createSourceFile(filename, "", ts.ScriptTarget.Latest);
  }

  add(name: string, type: ts.TypeNode) {
    this.statements.push(
      ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              ts.factory.createIdentifier(name),
              undefined,
              type,
              undefined
            ),
          ],
          ts.NodeFlags.Const
        )
      )
    );
  }

  generate() {
    const src = ts.factory.createSourceFile(
      [
        ts.factory.createModuleDeclaration(
          [ts.factory.createToken(ts.SyntaxKind.DeclareKeyword)],
          ts.factory.createIdentifier("global"),
          ts.factory.createModuleBlock(this.statements),
          ts.NodeFlags.ExportContext | ts.NodeFlags.GlobalAugmentation
        ),
        // Make this file a module
        ts.factory.createExportDeclaration(
          undefined,
          false,
          ts.factory.createNamedExports([]),
          undefined,
          undefined
        ),
      ],
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None
    );
    return this.printer.printNode(ts.EmitHint.SourceFile, src, this.file);
  }
}

function entryToType(entry: Entry): ts.TypeNode {
  if (typeof entry.endType === "string") {
    return ts.factory.createTypeReferenceNode(entry.endType);
  }
  const members: ts.TypeElement[] = [];
  for (const [name, subEntry] of entry.postMembers) {
    members.push(
      ts.factory.createPropertySignature(
        undefined,
        name,
        undefined,
        entryToType(subEntry)
      )
    );
  }
  for (const [typeKey, { paramName, entry: subEntry }] of entry.postCalls) {
    const types = typeKey.split(",");
    const parameters: ts.ParameterDeclaration[] = [];
    for (let i = 0; i < paramName.length; i++) {
      parameters.push(
        ts.factory.createParameterDeclaration(
          undefined,
          undefined,
          paramName[i],
          undefined,
          ts.factory.createTypeReferenceNode(types[i])
        )
      );
    }
    members.push(
      ts.factory.createCallSignature(
        undefined,
        parameters,
        entryToType(subEntry)
      )
    );
  }
  return ts.factory.createTypeLiteralNode(members);
}

export function generateDts({ types, defs }: DefDefAst) {
  const entries = parseToEntries(defs);
  const globalEnv = new GlobalGeneratingEnv();
  for (const [name, entry] of entries) {
    globalEnv.add(name, entryToType(entry));
  }
  return types + globalEnv.generate();
}
