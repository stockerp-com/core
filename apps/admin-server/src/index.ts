import logger from '@retailify/logger';
import env from './env.js';
import { server } from './server.js';

const main = () => {
  const app = server();

  app.listen(env?.PORT, () => {
    logger.info(`Server is running on http://localhost:${env?.PORT}`);
  });
};

main();
