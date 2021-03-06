import { Request, Response } from 'express';
import path from 'path';
import { AppError } from '../errors/AppError';
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
    const sendMailService = await SendMailService.getInstance();

    const user = await usersRepository.findOne({
      email,
    });

    if (!user) throw new AppError("User doesn't exist.");

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey) throw new AppError("Survey doesn't exist.");

    // E-mail data:

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {
        user_id: user.id,
        value: null,
      },
      relations: ['user', 'survey'],
    });

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
      link: process.env.URL_MAIL,
      id: surveyUserAlreadyExists?.id,
    };

    if (surveyUserAlreadyExists) {
      await sendMailService.execute({
        to: email,
        subject: survey.title,
        variables,
        templatePath: npsPath,
      });

      return response.json(surveyUserAlreadyExists);
    }

    // Salvar as infromações na tabela surveyUser:
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    Object.assign(variables, { id: surveyUser.id });

    // Enviar e-mail para o usuário:
    await sendMailService.execute({
      to: email,
      subject: survey.title,
      variables,
      templatePath: npsPath,
    });

    return response.json(surveyUser);
  }
}
