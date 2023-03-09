import tmp, { type DirectoryResult } from "tmp-promise";
import { writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import AdmZip from "adm-zip";
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

async function decompressZipToTempDirectory(buffer: Buffer) {
  const directory = await tmp.dir({ unsafeCleanup: true });
  const zip = new AdmZip(buffer);
  zip.extractAllTo(directory.path, true);
  return directory;
}

async function getExeFromDirectory(
  directory: DirectoryResult
): Promise<DirectoryResult> {
  const files = await readdir(directory.path);
  const exeFiles = files.filter((file) => file.endsWith(".exe"));
  if (exeFiles.length !== 1) {
    throw new Error("No executable file or multiple found");
  }
  return {
    path: path.join(directory.path, exeFiles[0]),
    cleanup: directory.cleanup.bind(directory),
  };
}

async function saveFileToTemp(buffer: Buffer, ext: `.${string}`) {
  const file = await tmp.file({ postfix: ext });
  await writeFile(file.path, buffer);
  return file;
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
    case "form": {
      console.log(mimeType);
      if (mimeType === "application/x-zip-compressed") {
        const d = await decompressZipToTempDirectory(buffer);
        return getExeFromDirectory(d);
      } else {
        return saveFileToTemp(buffer, ".exe");
      }
    }
    case "graphics.turtle": {
      if (mimeType === "text/plain") {
        return saveFileToTemp(buffer, ".py");
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
