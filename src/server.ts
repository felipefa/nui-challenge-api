import 'dotenv/config';

import { fastifyApp } from './lib/fastify';
import { eligibleServices } from './routes/eligibleServices';
import { healthcheck } from './routes/healthcheck';
import { questions } from './routes/questions';

fastifyApp.register(eligibleServices);
fastifyApp.register(healthcheck);
fastifyApp.register(questions);

const port = Number(process.env.PORT) || 3000;

fastifyApp.listen({ port }, (err, address) => {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }

  console.log(`Server listening on ${address}`);
});

export const server = fastifyApp;
