import tmp, { type DirectoryResult } from "tmp-promise";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { judge } from "./judge.js";

interface ParseBufferOptions {
  category: string;
  mimeType?: string;
}

type Status =
  | {
      status: "running";
    }
  | {
      status: "done";
      result: unknown;
    };

const SUBMISSION_MAP = new Map<number, Status>();

async function saveHtmlToTempDirectory(buffer: Buffer) {
  const directory = await tmp.dir({ unsafeCleanup: true });
  await writeFile(path.join(directory.path, "index.html"), buffer);
  return directory;
}

export async function select(
  buffer: Buffer,
  { category, mimeType }: ParseBufferOptions
): Promise<DirectoryResult | null> {
  switch (category) {
    case "web": {
      if (mimeType === "text/html") {
        return saveHtmlToTempDirectory(buffer);
      } else {
        return null;
      }
    }
    default:
      return null;
  }
}

let nextId = 0;

export async function startJudge(rule: string, result: DirectoryResult, category?: string) {
  const { path, cleanup } = result;
  const id = nextId++;
  setTimeout(async () => {
    try {
      await judge(rule, path, category);
    } finally {
      await cleanup.call(result);
    }
  });
  return id;
}

export function getJudgeStatus(id: number) {
  return SUBMISSION_MAP.get(id);
}
