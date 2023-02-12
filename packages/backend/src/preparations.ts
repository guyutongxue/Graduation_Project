import tmp, { type DirectoryResult } from "tmp-promise";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { judge } from "./judge.js";
import { ErrorType, JudgeError } from "./error.js";

interface ParseBufferOptions {
  category: string;
  mimeType?: string;
}

type Status =
  | {
      status: "launching";
    }
  | {
      status: "judging";
      caseNo: number;
    }
  | {
      status: "done";
      result:
        | {
            type: "Accepted";
          }
        | {
            type: ErrorType;
            typeDescription: string;
            message: string;
            caseNo: number;
          };
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

export async function startJudge(
  rule: string,
  result: DirectoryResult,
  category?: string
) {
  const { path, cleanup } = result;
  const id = nextId++;
  SUBMISSION_MAP.set(id, { status: "launching" });
  setTimeout(async () => {
    try {
      await judge({
        rule,
        filePath: path, 
        category,
        judgeId: id,
      });
    } finally {
      await cleanup.call(result);
    }
  });
  return id;
}

export function onCase(jid: number, caseNo: number) {
  SUBMISSION_MAP.set(jid, { status: "judging", caseNo });
}

export function onSuccess(jid: number) {
  SUBMISSION_MAP.set(jid, {
    status: "done",
    result: { type: "Accepted" },
  });
}

export function onError(jid: number, caseNo: number, e: JudgeError) {
  SUBMISSION_MAP.set(jid, {
    status: "done",
    result: {
      type: e.type,
      typeDescription: e.typeDescription,
      message: e.message,
      caseNo,
    },
  });
}

export function getJudgeStatus(id: number) {
  return SUBMISSION_MAP.get(id) ?? null;
}
