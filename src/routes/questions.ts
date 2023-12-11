import { FastifyInstance } from 'fastify';

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
}
