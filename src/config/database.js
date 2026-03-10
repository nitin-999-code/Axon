import { PrismaClient } from "@prisma/client";

class Database {
  /** @type {Database} */
  static #instance = null;

  /** @type {PrismaClient} */
  #client = null;

  constructor() {
    if (Database.#instance) {
      throw new Error("Use Database.getInstance() — singleton pattern.");
    }
    this.#client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
    });
  }

  /** @returns {Database} */
  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }

  /** @returns {PrismaClient} */
  getClient() {
    return this.#client;
  }

  async connect() {
    try {
      await this.#client.$connect();
      console.log("✅  Database connected successfully");
    } catch (error) {
      console.error("❌  Database connection failed:", error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    await this.#client.$disconnect();
    console.log("🔌  Database disconnected");
  }
}

// Export singleton client for convenience
const db = Database.getInstance();
export const prisma = db.getClient();
export default db;
