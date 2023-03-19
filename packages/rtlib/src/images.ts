import Jimp from "jimp";
import tmp from "tmp-promise";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

// https://s1.ax1x.com/2023/03/12/ppMKu5T.png
export async function createImageFromUrl(url: string): Promise<string> {
  const buf = await fetch(url).then((res) => res.arrayBuffer());
  return Buffer.from(buf).toString("base64");
}

const IMAGE_COMPARE_SCRIPT_PATH = fileURLToPath(
  new URL("../python/init.py", import.meta.url)
);

export async function imageSimilarity(
  standard: string,
  test: string
): Promise<number> {
  const f1 = await writeFile(standard);
  const f2 = await writeFile(test);
  try {
    const { stdout, stderr } = await promisify(execFile)("python.exe", [
      IMAGE_COMPARE_SCRIPT_PATH,
      f1.path,
      f2.path,
    ]);
    if (stdout && Number(stdout)) {
      return Number(stdout);
    } else {
      throw new Error(
        `Image similarity calculation failed, stdout: ${stdout}; stderr: ${stderr}`
      );
    }
  } finally {
    f1.cleanup();
    f2.cleanup();
  }
}

async function writeFile(base64: string) {
  const buffer = Buffer.from(base64, "base64");
  const img = await Jimp.read(buffer);
  const file = await tmp.file({ postfix: ".png" });
  img.write(file.path);
  return file;
}
