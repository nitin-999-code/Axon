"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
/**
 * Base Repository — abstract data access layer.
 * Provides common CRUD operations via Prisma.
 * All domain repositories extend this class (Inheritance + Abstraction).
 */
class BaseRepository {
    constructor(modelName) {
        this.model = database_1.prisma[modelName];
        if (!this.model) {
            throw new Error(`Prisma model "${modelName}" not found.`);
        }
    }
    async findById(id, options = {}) {
        return this.model.findUnique({
            where: { id },
            ...options,
        });
    }
    async findOne(where, options = {}) {
        return this.model.findFirst({
            where,
            ...options,
        });
    }
    async findMany({ where = {}, orderBy = { createdAt: "desc" }, page = 1, limit = 20, include, select, } = {}) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.model.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                ...(include && { include }),
                ...(select && { select }),
            }),
            this.model.count({ where }),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        };
    }
    async create(data, options = {}) {
        return this.model.create({
            data,
            ...options,
        });
    }
    async update(id, data, options = {}) {
        return this.model.update({
            where: { id },
            data,
            ...options,
        });
    }
    async delete(id) {
        return this.model.delete({
            where: { id },
        });
    }
    async count(where = {}) {
        return this.model.count({ where });
    }
    async transaction(fn) {
        return database_1.prisma.$transaction(fn);
    }
}
exports.default = BaseRepository;
