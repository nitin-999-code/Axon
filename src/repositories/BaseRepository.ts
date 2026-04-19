import { IRepository } from "../interfaces/IRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export abstract class BaseRepository<T> implements IRepository<T> {
  protected model: any;

  constructor(modelName: string) {
    this.model = (prisma as any)[modelName];
  }

  public async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.model.create({ data });
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }
}
