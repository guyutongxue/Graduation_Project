import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart, { Multipart } from "@fastify/multipart";
import { judge } from "./judge.js";
import { parseBuffer } from "./preparations.js";
import { pipeline } from "node:stream/promises";
import tmp from "tmp-promise";

const app = fastify({
  logger: true
});

await app.register(fastifyCors, {
  origin: "*",
});
await app.register(fastifyMultipart);

app.post("/judge", async (req, rep) => {
  let rule: string | undefined = void 0;
  let file: Buffer | undefined = void 0;
  let fileMime: string | undefined = void 0;
  const parts = req.parts();
  for await (const part of parts) {
    console.log(part.fieldname);
    if (part.fieldname === "file" && "file" in part) {
      file = await part.toBuffer();
      fileMime = part.mimetype;
    } else if (part.fieldname === "rule" && "value" in part && typeof part.value === "string") {
      rule = part.value;
    } else {
      return rep.code(400).send({
        success: false,
        message: `Invalid field name ${part.fieldname}`
      });
    }
  }
  if (typeof rule === "undefined" || typeof file === "undefined") {
    return rep.code(400).send({
      success: false,
      message: `Missing rule or file`
    });
  }
  parseBuffer(file, fileMime);
  return true;
})

app.listen({ port: 3000 });
