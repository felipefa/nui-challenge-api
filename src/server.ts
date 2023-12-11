import 'dotenv/config';

import { fastifyApp } from './lib/fastify';
import { healthcheck } from './routes/healthcheck';

fastifyApp.register(healthcheck);

const port = Number(process.env.PORT) || 3000;

fastifyApp.listen({ port }, (err, address) => {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }

  console.log(`Server listening on ${address}`);
});

export const server = fastifyApp;
