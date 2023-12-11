import 'dotenv/config';

import fastify, { FastifyInstance } from 'fastify';

import { database } from '../lib/firebase';
import { eligibleServices } from './eligibleServices';

describe('eligibleServices', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();

    app.register(eligibleServices);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(jest.resetAllMocks);

  it('should return eligible services based on user answers', async () => {
    const mockRequest = {
      body: {
        answers: 'Q1(3)-Q2(3)-Q3(A3)',
      },
    };

    const mockTopics = {
      topic1: {
        rule: 'Q1(>2)-Q2(3)',
      },
      topic2: {
        rule: 'Q2(>3)-Q3(A3)',
      },
      topic3: {
        rule: 'Q1(>2)-Q3(A3)',
      },
    };

    const mockRef = {
      once: jest.fn().mockResolvedValue({ val: jest.fn(() => mockTopics) }),
    };

    jest.spyOn(database, 'ref').mockReturnValue(mockRef as any);

    const response = await app.inject({
      method: 'POST',
      url: '/eligibleServices',
      payload: mockRequest.body,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ services: ['topic1', 'topic3'] }));
  });

  it('should return 400 if answers are missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/eligibleServices',
      body: {
        answers: '',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe('Missing answers');
  });

  it('should return 500 if an error occurs', async () => {
    const mockRequest = {
      body: {
        answers: 'Q1(A1)-Q2(A2)-Q3(A3)',
      },
    };

    const mockRef = {
      once: jest.fn().mockRejectedValue(new Error('Database operation failed')),
    };

    jest.spyOn(database, 'ref').mockReturnValue(mockRef as any);

    const response = await app.inject({
      method: 'POST',
      url: '/eligibleServices',
      payload: mockRequest.body,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('Internal server error');
  });
});
