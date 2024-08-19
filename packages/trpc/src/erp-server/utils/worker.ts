import { EmployeeSession } from '../../types/erp/auth/session.js';
import { env } from '../env.js';

export async function putObject(
  accessToken: string,
  session: EmployeeSession,
  path: 'employees' | 'organizations',
  directory: string,
  file: File,
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('directory', directory);

  const response = await fetch(
    `${env.WORKER_URL}/r2/${path}/${path === 'employees' ? session.id : session.organization?.id}`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.ok) {
    return response.json();
  }
}

export async function deleteObject(accessToken: string, key: string) {
  const response = await fetch(`${env.WORKER_URL}/r2/${key}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return response.json();
  }
}
