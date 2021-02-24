import { Request, Response } from 'express';
import { SurveysRepository } from '../repositories/SurveysRepository';

export class SurveysController {
  async create(request: Request, response: Response): Promise<Response> {
    const { title, description } = request.body;

    const surveysRepository = SurveysRepository.getRepository();

    const survey = surveysRepository.create({
      title,
      description,
    });

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const surveysRepository = SurveysRepository.getRepository();

    const allSurveys = await surveysRepository.find();

    return response.json(allSurveys);
  }
}
