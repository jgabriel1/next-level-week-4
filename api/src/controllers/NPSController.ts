import { Request, Response } from 'express';
import { Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

export class NPSController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { survey_id } = request.params;

    const surveysUsersRepository = SurveysUsersRepository.getRepository();

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveysUsers.filter(
      ({ value }) => value >= 0 && value <= 6,
    ).length;

    const promoters = surveysUsers.filter(
      ({ value }) => value >= 9 && value <= 10,
    ).length;

    const passives = surveysUsers.filter(
      ({ value }) => value >= 7 && value <= 8,
    ).length;

    const totalAnswers = surveysUsers.length;

    const nps = Number(
      (100 * ((promoters - detractors) / totalAnswers)).toFixed(2),
    );

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps,
    });
  }
}
