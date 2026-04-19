"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BaseRepository {
    constructor(modelName) {
        this.model = prisma[modelName];
    }
    async create(data) {
        return this.model.create({ data });
    }
    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        await this.model.delete({ where: { id } });
    }
}
exports.BaseRepository = BaseRepository;
