import BaseRepository from "./base.repository";

/**
 * User Repository — data access for User entity.
 * Extends BaseRepository (Inheritance).
 */
class UserRepository extends BaseRepository {
  constructor() {
    super("user");
  }

  public async findByEmail(email: string): Promise<any> {
    return this.model.findUnique({
      where: { email },
    });
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const count = await this.model.count({
      where: { email },
    });
    return count > 0;
  }
}

export default new UserRepository();
