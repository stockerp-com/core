import logger from '@retailify/logger';
import env from './utils/env.js';
import { server } from './server.js';

const main = async () => {
  const app = await server();

  app.listen(env?.PORT, () => {
    logger.info(`Server is running on http://localhost:${env?.PORT}`);
  });
};

main();
