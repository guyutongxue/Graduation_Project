import { FastifyInstance } from "fastify";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import getPort from "get-port";
import { rm } from "node:fs/promises";

export class Server {
  #projectPath: string;
  #app: FastifyInstance;
  #address: string | undefined;

  constructor(projectPath: string) {
    this.#projectPath = projectPath;
    this.#app = fastify({
      // logger: true
    });
    this.#app.register(fastifyStatic, {
      root: projectPath,
    });
  }

  async listen() {
    this.#address = await this.#app.listen({
      port: await getPort(),
    });
    return this.#address;
  }

  address() {
    return this.#address;
  }

  async dispose(removeProject?: boolean) {
    this.#address = undefined;
    await this.#app.close();
    if (removeProject) {
      await rm(this.#projectPath, { recursive: true });
    }
  }
}
