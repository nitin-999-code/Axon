import { prisma } from "../config/database.js";

/**
 * Base Repository — abstract data access layer.
 * Provides common CRUD operations via Prisma.
 * All domain repositories extend this class (Inheritance + Abstraction).
 */
class BaseRepository {
  /**
   * @param {string} modelName - Prisma model name (e.g., "user", "task")
   */
  constructor(modelName) {
    if (new.target === BaseRepository) {
      throw new Error("BaseRepository is abstract — do not instantiate directly.");
    }
    this.model = prisma[modelName];
    if (!this.model) {
      throw new Error(`Prisma model "${modelName}" not found.`);
    }
  }

  /**
   * Find a single record by ID.
   * @param {string} id
   * @param {Object} options - Prisma query options (select, include)
   */
  async findById(id, options = {}) {
    return this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  /**
   * Find a single record matching a filter.
   * @param {Object} where - Prisma where clause
   * @param {Object} options - Prisma query options
   */
  async findOne(where, options = {}) {
    return this.model.findFirst({
      where,
      ...options,
    });
  }

  /**
   * Find all records matching a filter with pagination.
   * @param {Object} params
   * @param {Object} params.where - Filter conditions
   * @param {Object} params.orderBy - Sort order
   * @param {number} params.page - Page number (1-indexed)
   * @param {number} params.limit - Records per page
   * @param {Object} params.include - Relations to include
   * @param {Object} params.select - Fields to select
   */
  async findMany({
    where = {},
    orderBy = { createdAt: "desc" },
    page = 1,
    limit = 20,
    include,
    select,
  } = {}) {
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

  /**
   * Create a new record.
   * @param {Object} data - Record data
   * @param {Object} options - Prisma options (include, select)
   */
  async create(data, options = {}) {
    return this.model.create({
      data,
      ...options,
    });
  }

  /**
   * Update a record by ID.
   * @param {string} id
   * @param {Object} data - Fields to update
   * @param {Object} options - Prisma options
   */
  async update(id, data, options = {}) {
    return this.model.update({
      where: { id },
      data,
      ...options,
    });
  }

  /**
   * Delete a record by ID.
   * @param {string} id
   */
  async delete(id) {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Count records matching a filter.
   * @param {Object} where - Filter conditions
   */
  async count(where = {}) {
    return this.model.count({ where });
  }

  /**
   * Execute operations inside a Prisma transaction.
   * @param {Function} fn - Callback receiving prisma transaction client
   */
  async transaction(fn) {
    return prisma.$transaction(fn);
  }
}

export default BaseRepository;
