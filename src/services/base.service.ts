import { BaseRepository } from '../repositories/base.repository';

export abstract class BaseService<T extends object> {
  constructor(protected repository: BaseRepository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string | number): Promise<T | null> {
    return this.repository.findById(id);
  }

  async create(data: T): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  async delete(id: string | number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
