import { DefDefAst } from "./types";

export function generateTranspileTargets({ defs }: DefDefAst): string {
  let currentCategory: string | undefined = undefined;
  let result: Record<string, unknown[]> = {};
  for (const i of defs) {
    if (typeof i === "string") {
      currentCategory = i;
      continue;
    }
    if (!currentCategory) {
      continue;
    }
    const { form, production } = i;
    if (!(currentCategory in result)) {
      result[currentCategory] = [];
    }
    result[currentCategory].push({ form, production });
  }
  return JSON.stringify(result, null, 2);
}
