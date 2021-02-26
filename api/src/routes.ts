import { Router } from 'express';
import { AnswersController } from './controllers/AnswersController';
import { SendMailController } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UsersController } from './controllers/UsersController';

const router = Router();

const usersController = new UsersController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answersController = new AnswersController();

router.post('/users', usersController.create);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/send_mail', sendMailController.execute);

router.get('/answers/:value', answersController.execute);

export { router };
