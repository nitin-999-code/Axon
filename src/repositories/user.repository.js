import BaseRepository from "./base.repository.js";

/**
 * User Repository — data access for User entity.
 */
class UserRepository extends BaseRepository {
  constructor() {
    super("user");
  }

  async findByEmail(email) {
    return this.model.findUnique({
      where: { email },
    });
  }

  async existsByEmail(email) {
    const count = await this.model.count({
      where: { email },
    });
    return count > 0;
  }
}

export default new UserRepository();
