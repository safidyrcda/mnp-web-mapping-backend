import {
  Repository,
  DataSource,
  FindOptionsWhere,
  ObjectLiteral,
  FindOptionsWhereProperty,
  DeepPartial,
} from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(
    protected dataSource: DataSource,
    protected entityClass: new () => T,
  ) {
    this.repository = this.dataSource.getRepository(this.entityClass);
  }

  async find(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string | number): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhereProperty<T>);
  }

  async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as DeepPartial<T>);
    return this.repository.save(newEntity);
  }

  async update(id: string | number, entity: Partial<T>): Promise<T | null> {
    await this.repository.update(id, entity);
    return this.findById(id);
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByCondition(condition: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(condition);
  }
}
