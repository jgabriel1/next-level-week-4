import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';

describe('User', () => {
  let connection: Connection;

  const user = {
    email: 'user@example.com',
    name: 'User Example',
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

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
  });

  it('should not be able to create a user with the same email', async () => {
    await request(app).post('/users').send(user);

    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(400);
  });
});
