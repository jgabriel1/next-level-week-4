import { Request, Response } from 'express';
import path from 'path';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import { SendMailService } from '../services/SendMailService';

export class SendMailController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, survey_id } = request.body;

    const usersRepository = UsersRepository.getRepository();
    const surveysRepository = SurveysRepository.getRepository();
    const surveysUsersRepository = SurveysUsersRepository.getRepository();

    const user = await usersRepository.findOne({
      email,
    });

    if (!user)
      return response.status(400).json({
        error: "User doesn't exist.",
      });

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey)
      return response.status(400).json({
        error: "Survey doesn't exist.",
      });

    // Salvar as infromações na tabela surveyUser:
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    // Enviar e-mail para o usuário:
    const sendMailService = await SendMailService.getInstance();

    const npsPath = path.resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'npsMail.hbs',
    );

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
    };

    await sendMailService.execute({
      to: email,
      subject: survey.title,
      variables,
      templatePath: npsPath,
    });

    return response.json(surveyUser);
  }
}
