import { db } from './client.js';

(async () => {
    try {
        // TODO: Add seed data here
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await db.$disconnect();
    }
})();
