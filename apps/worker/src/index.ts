import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { nanoid } from 'nanoid';

type Bindings = {
  MY_BUCKET: R2Bucket;
  JWT_AT_SECRET: string;
};

const VALID_DIRECTORIES = ['media/products', 'media/avatars', 'documents'];

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use('/r2/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_AT_SECRET,
  });
  return jwtMiddleware(c, next);
});

app.notFound((c) => {
  return c.text('Not Found', 404);
});

app.post('/r2', async (c) => {
  const jwtPayload = c.get('jwtPayload');
  if (!jwtPayload) {
    return c.text('Unauthorized', 401);
  }

  const organizationId = jwtPayload.organizationId;
  if (!organizationId) {
    return c.text('Unauthorized', 401);
  }

  const role = jwtPayload.role;
  if (!role) {
    return c.text('Unauthorized', 401);
  }
  if (['ADMIN'].includes(role) === false) {
    return c.text('Unauthorized', 401);
  }

  const formData = await c.req.formData();
  const file = formData.get('file');
  const directory = formData.get('directory');

  if (!file) {
    return c.text('No file found', 400);
  }
  if (file instanceof File === false) {
    return c.text('Invalid file', 400);
  }
  if (!directory) {
    return c.text('No directory provided', 400);
  }
  if (typeof directory !== 'string') {
    return c.text('Invalid directory', 400);
  }
  if (VALID_DIRECTORIES.includes(directory) === false) {
    return c.text('Invalid directory', 400);
  }

  const buffer = await file.arrayBuffer();
  const key = `${organizationId}/${directory}/${nanoid()}`;

  await c.env.MY_BUCKET.put(key, buffer);

  return c.json({ ok: true, key });
});

app.delete('/r2/:key', async (c) => {
  const jwtPayload = c.get('jwtPayload');
  if (!jwtPayload) {
    return c.text('Unauthorized', 401);
  }

  const organizationId = jwtPayload.organizationId;
  if (!organizationId) {
    return c.text('Unauthorized', 401);
  }

  const role = jwtPayload.role;
  if (!role) {
    return c.text('Unauthorized', 401);
  }
  if (['ADMIN'].includes(role) === false) {
    return c.text('Unauthorized', 401);
  }

  const key = c.req.param('key');
  if (typeof key !== 'string') {
    return c.text('Invalid key', 400);
  }

  await c.env.MY_BUCKET.delete(key);

  return c.json({ ok: true });
});

export default app;
