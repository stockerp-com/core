import logger from '@retailify/logger';
import env from './utils/env.js';
import { serverFactory } from './server.js';

const main = async () => {
  const server = await serverFactory();

  server.listen(env?.PORT, () => {
    logger.info(`Server is running on http://localhost:${env?.PORT}`);
  });
};

main();
