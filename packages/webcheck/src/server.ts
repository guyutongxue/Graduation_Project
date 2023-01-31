import { FastifyInstance } from "fastify";
import { fastify } from "fastify";
import fastifyStatic from "@fastify/static";
import getPort from "get-port";
import { rm } from "node:fs/promises";

export class Server {
  #app: FastifyInstance;
  #address: string;

  private constructor(app: FastifyInstance, address: string) {
    this.#app = app;
    this.#address = address;
  }

  static async create(projectPath: string) {
    const app = fastify({
      logger: true
    });
    const address = await app.register(fastifyStatic, {
      root: projectPath,
    }).listen({
      port: await getPort(),
    });
    return new Server(app, address);
  }

  address() {
    return this.#address;
  }

  async dispose() {
    await this.#app.close();
  }
}
