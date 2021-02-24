import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database';

describe('Survey', () => {
  let connection: Connection;

  const survey = {
    title: 'Title Example',
    description: 'Description Example',
  };

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.runMigrations();
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  it('should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send(survey);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to list all surveys', async () => {
    await request(app).post('/surveys').send(survey);
    await request(app).post('/surveys').send(survey);

    const response = await request(app).get('/surveys').send();

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(2);
  });
});
