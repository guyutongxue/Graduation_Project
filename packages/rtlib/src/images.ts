import looksSame from "looks-same";
import Jimp from "jimp";

// https://s1.ax1x.com/2023/03/12/ppMKu5T.png
export async function createImageFromUrl(url: string): Promise<string> {
  const buf = await fetch(url).then((res) => res.arrayBuffer());
  return Buffer.from(buf).toString("base64");
}

export async function compareImageStrict(a: string, b: string): Promise<boolean> {
  const aBuffer = await canonicalize(a, "a");
  const bBuffer = await canonicalize(b, "b");
  const { equal } = await looksSame(aBuffer, bBuffer, { tolerance: 5 });
  if (!equal) {
    await createDiff(aBuffer, bBuffer);
  }
  return equal;
}

async function canonicalize(a: string, path?: string) {
  const buffer = Buffer.from(a, "base64");
  const img = await Jimp.read(buffer);
  if (path) {
    img.write(`./${path}.png`);
  }
  return img.getBufferAsync(Jimp.MIME_PNG);
}

function createDiff(a: Buffer, b: Buffer) {
  return looksSame.createDiff({
    reference: a,
    current: b,
    diff: './diff.png',
    highlightColor: '#ff00ff', // color to highlight the differences
    tolerance: 5
});
}
