import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../models/auth/user.model';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private readonly userRoleDataSource: DataSource,
    private readonly passwordResetTokenDataSource: DataSource,
    private readonly emailVerificationTokenDataSource: DataSource,
    private readonly roleDataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  async createAdminIfNone() {
    const count = await this.count();
    if (count === 0) {
      const admin = this.create({
        email: 'admin@example.com',
        password: 'admin123',
        isEmailConfirmed: true,
      });
      await this.save(admin);
      return admin;
    }
    return null;
  }
}
