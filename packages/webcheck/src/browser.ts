import puppeteer from "puppeteer-core";

export async function launch(address: string) {
  const browser = await puppeteer.launch({
    executablePath: `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`,
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(address, {
    waitUntil: "networkidle2",
  });
  return { browser, page };
}
