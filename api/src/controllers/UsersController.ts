import { Request, Response } from 'express';
import * as yup from 'yup';
import { UsersRepository } from '../repositories/UsersRepository';

export class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({
        error: err,
      });
    }

    const usersRepository = UsersRepository.getRepository();

    const userAlreadyExists = await usersRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: 'E-mail already registered.',
      });
    }

    const user = usersRepository.create({
      name,
      email,
    });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}
