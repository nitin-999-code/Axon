"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
/**
 * Database Singleton — ensures a single PrismaClient instance across the application.
 * Implements the Singleton Design Pattern with strict encapsulation.
 */
class Database {
    constructor() {
        this.client = new client_1.PrismaClient({
            log: process.env.NODE_ENV === "development"
                ? ["query", "info", "warn", "error"]
                : ["error"],
        });
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    getClient() {
        return this.client;
    }
    async connect() {
        try {
            await this.client.$connect();
            console.log("✅  Database connected successfully");
        }
        catch (error) {
            console.error("❌  Database connection failed:", error.message);
            process.exit(1);
        }
    }
    async disconnect() {
        await this.client.$disconnect();
        console.log("🔌  Database disconnected");
    }
}
const db = Database.getInstance();
exports.prisma = db.getClient();
exports.default = db;
