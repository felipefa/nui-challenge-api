import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { database } from '../lib/firebase';

export async function questions(app: FastifyInstance) {
  app.get(
    '/questions',
    async (_, reply) => {
      try {
        const questions = await database.ref('services_backend/questions').once('value');

        return reply.send(questions.val());
      } catch (error) {
        console.error(error);
        return reply.code(500).send('Internal server error');
      }
    }
  );

  app.get(
    '/questions/:key',
    async (request, reply) => {
      try {
        const paramsSchema = z.object({
          key: z.string(),
        });

        const { key } = paramsSchema.parse(request.params);

        const questionsRef = await database.ref(`services_backend/questions/${key}`).once('value');

        const question = questionsRef.val();

        if (!question) {
          return reply.code(404).send('Question not found');
        }

        const nextQuestion = {
          key,
          title: question.title[0] || question.title_alt[0],
          options: Object.values(question.answers),
        };

        return reply.send({ nextQuestion });
      } catch (error) {
        console.error(error);
        return reply.code(500).send('Internal server error');
      }
    }
  );
}
