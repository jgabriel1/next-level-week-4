import { Request, Response } from 'express';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';

export class SendMailController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, survey_id } = request.body;

    const usersRepository = UsersRepository.getRepository();
    const surveysRepository = SurveysRepository.getRepository();
    const surveysUsersRepository = SurveysUsersRepository.getRepository();

    const userExists = await usersRepository.findOne({
      email,
    });

    if (!userExists)
      return response.status(400).json({
        error: "User doesn't exist.",
      });

    const surveyExists = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveyExists)
      return response.status(400).json({
        error: "Survey doesn't exist.",
      });

    // Salvar as infromações na tabela surveyUser:
    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    // Enviar e-mail para o usuário:
    // TODO

    return response.json(surveyUser);
  }
}
