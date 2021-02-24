import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Survey } from '../models/Survey';

@EntityRepository(Survey)
export class SurveysRepository extends Repository<Survey> {
  public static getRepository(): SurveysRepository {
    const repository = getCustomRepository(SurveysRepository);

    return repository;
  }
}
