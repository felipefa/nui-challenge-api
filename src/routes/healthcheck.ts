import { FastifyInstance } from 'fastify';

export async function healthcheck(app: FastifyInstance) {
  app.get(
    '/healthcheck',
    async (_, reply) => {
      return reply.send('Nui Challenge API is running');
    }
  );
}
