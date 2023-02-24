import { fastify, FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart, { type Multipart } from "@fastify/multipart";
import { getJudgeStatus, select, startJudge } from "./preparations.js";

const app = fastify({
  logger: true,
});

await app.register(fastifyCors, {
  origin: "*",
});
await app.register(fastifyMultipart);

async function parseMultipart<S extends Record<string, "file" | "value">>(
  parts: AsyncIterableIterator<Multipart>,
  schema: S
) {
  type Result = {
    [K in keyof S]: S[K] extends "file"
      ? [Buffer, string]
      : S[K] extends "value"
      ? string
      : never;
  };
  const result: Record<string, unknown> = {};
  let errStr: string | null = null;
  for await (const part of parts) {
    if (part.fieldname in schema) {
      if (schema[part.fieldname] === "file" && "file" in part) {
        result[part.fieldname] = [await part.toBuffer(), part.mimetype];
      } else if (
        schema[part.fieldname] === "value" &&
        "value" in part &&
        typeof part.value === "string"
      ) {
        result[part.fieldname] = part.value;
      } else {
        errStr = `Field ${part.fieldname} incorrect format`;
        break;
      }
    } else {
      errStr = `Invalid field name ${part.fieldname}`;
      break;
    }
  }
  for (const k in schema) {
    if (!(k in result)) {
      errStr = `Missing field ${k}`;
      break;
    }
  }
  return [errStr, result as Result] as const;
}

app.post("/judge", async (req, rep) => {
  try {
    const parts = req.parts();
    const [err, { file, rule, category }] = await parseMultipart(parts, {
      rule: "value",
      category: "value",
      file: "file",
    } as const);
    if (err !== null) {
      return rep.code(400).send({
        success: false,
        message: err,
      });
    }
    const f = await select(file[0], { category, mimeType: file[1] });
    if (f === null) {
      return rep.code(400).send({
        success: false,
        message: "Unsupported file type / category type",
      });
    }
    const id = await startJudge(rule, f, category);
    return {
      success: true,
      id,
    };
  } catch (e) {
    return rep.code(500).send({
      success: false,
      message: e instanceof Error ? e.message : e,
    });
  }
});

app.get("/judgeStatus/:id", async (req, rep) => {
  // @ts-expect-error No type definition for req.params
  const id = parseInt(req.params.id);
  const status = getJudgeStatus(id);
  if (status === null) {
    return rep.code(404).send({
      success: false,
      message: "ID not found",
    });
  }
  return {
    success: true,
    ...status,
  };
});

app.listen({ port: 3000 });
