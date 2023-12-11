import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { database } from '../lib/firebase';

export async function eligibleServices(app: FastifyInstance) {
  app.post(
    '/eligibleServices',
    async (request, reply) => {
      try {
        const bodySchema = z.object({
          answers: z.string()
        });

        const { answers: userAnswers } = bodySchema.parse(request.body);

        if (!userAnswers) {
          return reply.code(400).send('Missing answers');
        }

        const userAnswersParsed: Record<string, number | string> = {};

        // Parse user answers to facilitate comparison with topic rules
        userAnswers.split('-').forEach(answer => {
          const [key, value] = answer.split('(');
          userAnswersParsed[key] = value.slice(0, -1); // Remove closing bracket
        });

        const topicsRef = await database.ref('services_backend/topics').once('value');

        const topics = topicsRef.val();

        const services: string[] = [];

        // Scan through each topic rule
        Object.keys(topics).forEach(serviceKey => {
          const rules = topics[serviceKey].rule.split('||');

          // Check OR conditions separately
          const isEligible = rules.some((rule: string) => {
            const conditions = rule.split('-');

            // Check AND conditions together (all must be true)
            return conditions.every(condition => {
              const [questionKey, validAnswer] = condition.split('(');

              if (!userAnswersParsed[questionKey] || !validAnswer) {
                return false;
              }

              const validAnswerValue = validAnswer.slice(0, -1); // Remove closing bracket

              // Check if the valid answer is a range or comparison
              if (validAnswerValue.startsWith('>')) {
                return Number(userAnswersParsed[questionKey]) > Number(validAnswerValue.slice(1));
              } else if (validAnswerValue.startsWith('<')) {
                return Number(userAnswersParsed[questionKey]) < Number(validAnswerValue.slice(1));
              } else if (validAnswerValue.startsWith('>=')) {
                return Number(userAnswersParsed[questionKey]) >= Number(validAnswerValue.slice(2));
              } else if (validAnswerValue.startsWith('<=')) {
                return Number(userAnswersParsed[questionKey]) <= Number(validAnswerValue.slice(2));
              } else {
                // If not a range or number comparison, check for exact match
                return userAnswersParsed[questionKey] === validAnswerValue;
              }
            });
          });

          if (isEligible) {
            services.push(serviceKey);
          }
        });

        return reply.send({ services });
      } catch (error) {
        console.error(error);
        return reply.code(500).send('Internal server error');
      }
    }
  );
}
