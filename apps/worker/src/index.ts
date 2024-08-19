import { Context, Hono } from 'hono';
import { cache } from 'hono/cache';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { StatusCode } from 'hono/utils/http-status';
import { nanoid } from 'nanoid';

type Bindings = {
  MY_BUCKET: R2Bucket;
  JWT_AT_SECRET: string;
};

const VALID_DIRECTORIES = ['media/products', 'documents'];

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());
app.use(secureHeaders());
app.get(
  '*',
  cache({
    cacheName: 'retailify-worker',
    cacheControl: 'max-age=3600',
  }),
);
app.use('/^/r2/(upload|delete/.*)$/', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_AT_SECRET,
  });
  return jwtMiddleware(c, next);
});

app.notFound((c) => {
  return c.text('Not Found', 404);
});

app.get('/r2/*', async (c) => {
  const key = c.req.path.replace(`/r2/`, '');

  const object = await c.env.MY_BUCKET.get(key);
  if (object === null) {
    return c.text('Not Found', 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers,
  });
});

function checkUser(c: Context) {
  const jwtPayload = c.get('jwtPayload');
  if (!jwtPayload) {
    return {
      ok: false,
      status: 401 as StatusCode,
    };
  }

  const organizationId = jwtPayload.organizationId;
  if (!organizationId) {
    return {
      ok: false,
      status: 401 as StatusCode,
    };
  }

  const role = jwtPayload.role;
  if (!role) {
    return {
      ok: false,
      status: 403 as StatusCode,
    };
  }
  if (['ADMIN'].includes(role) === false) {
    return {
      ok: false,
      status: 403 as StatusCode,
    };
  }

  return {
    ok: true,
    organizationId,
  };
}

app.post('/r2/upload', async (c) => {
  const { ok, status, organizationId } = checkUser(c);
  if (!ok) {
    const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
    return c.text(msg, status);
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

app.delete('/r2/delete/:organizationId/*', async (c) => {
  const { ok, status, organizationId: jwtOrgId } = checkUser(c);
  if (!ok) {
    const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
    return c.text(msg, status);
  }

  const organizationId = c.req.param('organizationId');
  const key = c.req.path.replace(`/r2/${organizationId}/`, '');
  if (typeof key !== 'string') {
    return c.text('Invalid key', 400);
  }
  if (jwtOrgId !== organizationId) {
    return c.text('Forbidden', 403);
  }

  await c.env.MY_BUCKET.delete(key);

  return c.json({ ok: true });
});

export default app;
