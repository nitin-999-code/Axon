import { prisma } from "../config/database";

/**
 * Base Repository — abstract data access layer.
 * Provides common CRUD operations via Prisma.
 * All domain repositories extend this class (Inheritance + Abstraction).
 */
abstract class BaseRepository {
  protected model: any;

  constructor(modelName: string) {
    this.model = (prisma as any)[modelName];
    if (!this.model) {
      throw new Error(`Prisma model "${modelName}" not found.`);
    }
  }

  public async findById(id: string, options: Record<string, any> = {}): Promise<any> {
    return this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  public async findOne(where: Record<string, any>, options: Record<string, any> = {}): Promise<any> {
    return this.model.findFirst({
      where,
      ...options,
    });
  }

  public async findMany({
    where = {},
    orderBy = { createdAt: "desc" as const },
    page = 1,
    limit = 20,
    include,
    select,
  }: {
    where?: Record<string, any>;
    orderBy?: Record<string, any>;
    page?: number;
    limit?: number;
    include?: Record<string, any>;
    select?: Record<string, any>;
  } = {}): Promise<{ data: any[]; pagination: any }> {
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

  public async create(data: Record<string, any>, options: Record<string, any> = {}): Promise<any> {
    return this.model.create({
      data,
      ...options,
    });
  }

  public async update(id: string, data: Record<string, any>, options: Record<string, any> = {}): Promise<any> {
    return this.model.update({
      where: { id },
      data,
      ...options,
    });
  }

  public async delete(id: string): Promise<any> {
    return this.model.delete({
      where: { id },
    });
  }

  public async count(where: Record<string, any> = {}): Promise<number> {
    return this.model.count({ where });
  }

  public async transaction(fn: (tx: any) => Promise<any>): Promise<any> {
    return prisma.$transaction(fn);
  }
}

export default BaseRepository;
