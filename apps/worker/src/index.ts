import { Context, Hono, Next } from 'hono';
import { cache } from 'hono/cache';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { StatusCode } from 'hono/utils/http-status';
import { nanoid } from 'nanoid';

type Bindings = {
  MY_BUCKET: R2Bucket;
  JWT_AT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());
app.use(
  secureHeaders({
    crossOriginResourcePolicy: 'cross-origin',
  }),
);
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  }),
);

app.get(
  '/r2/*',
  cache({
    cacheName: 'retailify-worker',
    cacheControl: `max-age=${60 * 60 * 24}`,
  }),
);

const erpAuthMiddleware = (c: Context, next: Next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_AT_SECRET,
  });
  return jwtMiddleware(c, next);
};

app.notFound((c) => {
  return c.text('Not Found :(', 404);
});

function checkUser(c: Context, verifyRole = true) {
  const jwtPayload = c.get('jwtPayload');
  if (!jwtPayload) {
    return {
      ok: false,
      status: 401 as StatusCode,
    };
  }

  const organizationId = jwtPayload.organization?.id;
  const role = jwtPayload.organization?.role;

  if (verifyRole) {
    if (!role || !['ADMIN', 'OWNER'].includes(role)) {
      return {
        ok: false,
        status: 403 as StatusCode,
      };
    }
  }

  return {
    ok: true,
    organizationId,
    id: jwtPayload.id,
  };
}

function validateId(id: string | undefined, jwtId: string | undefined) {
  return id && jwtId && String(id) === String(jwtId);
}

app.get(
  '/r2/organizations/:organizationId/secure/:key',
  erpAuthMiddleware,
  async (c) => {
    const { ok, status, organizationId: jwtOrgId } = checkUser(c);
    if (!ok) {
      const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
      return c.text(msg, status);
    }

    const organizationId = c.req.param('organizationId');
    if (typeof organizationId !== 'string') {
      return c.text('Invalid organizationId', 400);
    }
    if (!validateId(organizationId, jwtOrgId)) {
      return c.text('Forbidden', 403);
    }

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
  },
);

app.get('/r2/*', async (c) => {
  const key = c.req.path.replace(`/r2/`, '');

  const object = await c.env.MY_BUCKET.get(key);
  if (object === null) {
    return c.text('Not Found', 404);
  }

  const headers = new Headers();
  object.httpMetadata &&
    headers.append('content-type', object.httpMetadata.contentType!);
  headers.append('cache-control', 'immutable, no-transform, max-age=31536000');
  headers.append('etag', object.httpEtag);
  headers.append('date', object.uploaded.toUTCString());

  return new Response(object.body, {
    headers,
  });
});

app.post('/r2/organizations/:organizationId', erpAuthMiddleware, async (c) => {
  const { ok, status, organizationId: jwtOrgId } = checkUser(c);
  if (!ok) {
    const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
    return c.text(msg, status);
  }

  const organizationId = c.req.param('organizationId');
  if (typeof organizationId !== 'string') {
    return c.text('Invalid organizationId', 400);
  }
  if (!validateId(organizationId, jwtOrgId)) {
    return c.text('Forbidden', 403);
  }

  const formData = await c.req.formData();
  const file = formData.get('file');
  const directory = formData.get('directory');

  if (!file || !(file instanceof File)) {
    return c.text('Invalid file', 400);
  }
  if (!directory || typeof directory !== 'string') {
    return c.text('Invalid directory', 400);
  }

  const buffer = await file.arrayBuffer();
  const key = `organizations/${organizationId}/${directory}/${nanoid()}`;

  await c.env.MY_BUCKET.put(key, buffer, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return c.json({ ok: true, key });
});

app.post('/r2/employees/:employeeId', erpAuthMiddleware, async (c) => {
  const { ok, status, id: jwtId } = checkUser(c, false);
  if (!ok) {
    const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
    return c.text(msg, status);
  }

  const employeeId = c.req.param('employeeId');
  if (typeof employeeId !== 'string') {
    return c.text('Invalid employeeId', 400);
  }
  if (!validateId(employeeId, jwtId)) {
    return c.text('Forbidden', 403);
  }

  const formData = await c.req.formData();
  const file = formData.get('file');
  const directory = formData.get('directory');

  if (!file || !(file instanceof File)) {
    return c.text('Invalid file', 400);
  }
  if (!directory || typeof directory !== 'string') {
    return c.text('Invalid directory', 400);
  }

  const buffer = await file.arrayBuffer();
  const key = `employees/${employeeId}/${directory}/${nanoid()}`;

  await c.env.MY_BUCKET.put(key, buffer, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return c.json({ ok: true, key });
});

app.delete(
  '/r2/organizations/:organizationId/*',
  erpAuthMiddleware,
  async (c) => {
    const { ok, status, organizationId: jwtOrgId } = checkUser(c);
    if (!ok) {
      const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
      return c.text(msg, status);
    }

    const organizationId = c.req.param('organizationId');
    const key = c.req.path.replace(`/r2/`, '');
    if (typeof key !== 'string') {
      return c.text('Invalid key', 400);
    }
    if (!validateId(organizationId, jwtOrgId)) {
      return c.text('Forbidden', 403);
    }

    await c.env.MY_BUCKET.delete(key);

    return c.json({ ok: true });
  },
);

app.delete('/r2/employees/:employeeId/*', erpAuthMiddleware, async (c) => {
  const { ok, status, id: jwtId } = checkUser(c, false);
  if (!ok) {
    const msg = status === 401 ? 'Unauthorized' : 'Forbidden';
    return c.text(msg, status);
  }

  const employeeId = c.req.param('employeeId');
  const key = c.req.path.replace(`/r2/`, '');
  if (typeof key !== 'string') {
    return c.text('Invalid key', 400);
  }
  if (!validateId(employeeId, jwtId)) {
    return c.text('Forbidden', 403);
  }

  await c.env.MY_BUCKET.delete(key);

  return c.json({ ok: true });
});

export default app;
