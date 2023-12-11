import fastify, { FastifyInstance } from 'fastify';

import { healthcheck } from './healthcheck';

describe('healthcheck', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();

    app.register(healthcheck);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(jest.resetAllMocks);


  it('should return "Nui Challenge API is running"', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/healthcheck',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      'Nui Challenge API is running'
    );
  });
});
