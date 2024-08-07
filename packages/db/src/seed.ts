import { db } from './client.js';
import { hash } from 'bcrypt';

(async () => {
  try {
    await db.admin.create({
      data: {
        email: 'john@doe',
        fullName: 'John Doe',
        pwHash: await hash('password', 10),
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
})();
