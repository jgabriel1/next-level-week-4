import { Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

export class AnswersController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { value } = request.params;
    const { u: surveyUserId } = request.query;

    const surveysUsersRepository = SurveysUsersRepository.getRepository();

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(surveyUserId),
    });

    if (!surveyUser) throw new AppError('Invalid survey and user combination.');

    Object.assign(surveyUser, { value: Number(value) });

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}
