import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { SurveyUser } from '../models/SurveyUser';

@EntityRepository(SurveyUser)
export class SurveysUsersRepository extends Repository<SurveyUser> {
  public static getRepository(): SurveysUsersRepository {
    const repository = getCustomRepository(SurveysUsersRepository);

    return repository;
  }
}
