// @ts-check
import { expect } from "gy";

/** @type {import("gy").Rule} */
export default {
  cases: [
    (page) => {
      expect(page).title().eq("Hello, world");
      expect(page.$("h1")).text().eq("Hello, world!");
    },
  ],
};
