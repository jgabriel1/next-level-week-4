import request, { SuperTest, Test } from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';
import { SendMailService } from '../services/SendMailService';

describe('SendMail', () => {
  let connection: Connection;
  let client: SuperTest<Test>;

  let surveyId: string;

  const user = {
    email: 'user@example.com',
    name: 'User Example',
  };

  const survey = {
    title: 'Title Example',
    description: 'Description Example',
  };

  beforeAll(async () => {
    connection = await createConnection();
    client = request(app);
  });

  beforeEach(async () => {
    await connection.runMigrations();

    await client.post('/users').send(user);
    const response = await client.post('/surveys').send(survey);

    surveyId = response.body.id;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  it('should send the mail', async () => {
    const logCapture: string[] = [];

    console.log = jest.fn((input: string) => {
      logCapture.push(input);
    });

    const response = await client.post('/send_mail').send({
      email: user.email,
      survey_id: surveyId,
    });

    expect(response.status).toEqual(200);
    expect(logCapture).toHaveLength(2);
  }, 20000);

  it('should not create a second mail service class instance (singleton)', async () => {
    const mailService1 = await SendMailService.getInstance();
    const mailService2 = await SendMailService.getInstance();

    expect(mailService1).toBe(mailService2);
  });
});
