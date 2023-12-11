import 'dotenv/config';

import fastify, { FastifyInstance } from 'fastify';

import { database } from '../lib/firebase';
import { questions } from './questions';

describe('questions', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();

    app.register(questions);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(jest.resetAllMocks);

  it('should return all questions', async () => {
    const mockedResponse = {
      "Arbeit": {
      },
      "Bayern": {
      }
    };

    const val = jest.fn(() => mockedResponse);
    const once = jest.fn(async () => ({ val }));

    jest
      .spyOn(database, 'ref')
      .mockReturnValue({ once } as any);

    const response = await app.inject({
      method: 'GET',
      url: '/questions',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify(mockedResponse));
  });

  it('should return a specific question', async () => {
    const val = jest.fn(() => {
      return {
        "answers": {
          "A1": {
            "result": "1",
            "title": "Ein ambulanter Pflegedienst",
            "title_alt": "Ein ambulanter Pflegedienst"
          },
          "A2": {
            "result": "2",
            "title": "Familie, Freunde, Bekannte",
            "title_alt": "Familie, Freunde, Bekannte"
          },
          "A3": {
            "result": "3",
            "title": "Angehörige mit ambulantem Pflegedienst",
            "title_alt": "Angehörige mit ambulantem Pflegedienst"
          }
        },
        "title": [
          "Wer kümmert sich denn momentan um {SENIOR}?"
        ],
        "title_alt": [
          "Wer ist aktuell in die Pflege involviert?"
        ]
      };
    });
    const once = jest.fn(async () => ({ val }));

    jest
      .spyOn(database, 'ref')
      .mockReturnValue({ once } as any);

    const response = await app.inject({
      method: 'GET',
      url: '/questions/Pfleger',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({
      "nextQuestion": {
        "key": "Pfleger",
        "title": "Wer kümmert sich denn momentan um {SENIOR}?",
        "options": [
          {
            "result": "1",
            "title": "Ein ambulanter Pflegedienst",
            "title_alt": "Ein ambulanter Pflegedienst"
          },
          {
            "result": "2",
            "title": "Familie, Freunde, Bekannte",
            "title_alt": "Familie, Freunde, Bekannte"
          },
          {
            "result": "3",
            "title": "Angehörige mit ambulantem Pflegedienst",
            "title_alt": "Angehörige mit ambulantem Pflegedienst"
          }
        ]
      }
    }));
  });

  it('should return 404 if question is not found', async () => {
    const val = jest.fn(() => undefined);
    const once = jest.fn(async () => ({ val }));

    jest
      .spyOn(database, 'ref')
      .mockReturnValue({ once } as any);

    const response = await app.inject({
      method: 'GET',
      url: '/questions/non-existent-key',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toBe('Question not found');
  });

  it('should return 500 if an error occurs', async () => {
    const val = jest.fn(() => {
      throw new Error('Database operation failed');
    });
    const once = jest.fn(async () => ({ val }));

    jest
      .spyOn(database, 'ref')
      .mockReturnValue({ once } as unknown as any);

    const response = await app.inject({
      method: 'GET',
      url: '/questions',
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe('Internal server error');
  });
});
