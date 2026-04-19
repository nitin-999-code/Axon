import { PrismaClient } from "@prisma/client";

/**
 * Database Singleton — ensures a single PrismaClient instance across the application.
 * Implements the Singleton Design Pattern with strict encapsulation.
 */
class Database {
  private static instance: Database;
  private client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): PrismaClient {
    return this.client;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.$connect();
      console.log("✅  Database connected successfully");
    } catch (error: any) {
      console.error("❌  Database connection failed:", (error as Error).message);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.$disconnect();
    console.log("🔌  Database disconnected");
  }
}

const db = Database.getInstance();
export const prisma: PrismaClient = db.getClient();
export default db;
