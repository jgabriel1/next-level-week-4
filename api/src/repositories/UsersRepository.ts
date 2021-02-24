import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { User } from '../models/User';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public static getRepository(): UsersRepository {
    const repository = getCustomRepository(UsersRepository);

    return repository;
  }
}
