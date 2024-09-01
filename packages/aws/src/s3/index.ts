import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import env from '../env.js';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { invalidateCache } from '../cloudfront/index.js';

// S3 client setup
const s3Client = new S3Client({
  credentials: {
    accessKeyId: env?.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: env?.AWS_SECRET_ACCESS_KEY as string,
  },
  region: env?.AWS_S3_REGION as string,
});

const S3_BUCKET_PATHS = [
  '/Tenants/<tenantId>/Private/Imports',
  '/Tenants/<tenantId>/Private/Documents',
  '/Tenants/<tenantId>/Private/Exports',
  '/Tenants/<tenantId>/Private/Analytics',
  '/Tenants/<tenantId>/Private/Messages/Attachments',
  '/Tenants/<tenantId>/Public/Exports',
  '/Tenants/<tenantId>/Public/Customers/Avatars',
  '/Tenants/<tenantId>/Public/Customers/Attachments',
  '/Tenants/<tenantId>/Public/Goods/Media/<goodId>/Compressed',
  '/Tenants/<tenantId>/Public/Goods/Media/<goodId>/Original',
  '/Tenants/<tenantId>/Public/Categories/Media/<categoryId>/Compressed',
  '/Tenants/<tenantId>/Public/Categories/Media/<categoryId>/Original',
  '/Shared/Employees/Avatars',
  '/Shared/Assets',
  '/Shared/Docs',
  '/System/Backups',
  '/System/Logs',
  '/System/Configs',
  '/System/Temp',
] as const;

// Get a key for a file in S3
export function getKey({
  path,
  categoryId,
  goodId,
  tenantId,
  fileName,
}: {
  path: (typeof S3_BUCKET_PATHS)[number];
  tenantId?: string;
  goodId?: string;
  categoryId?: string;
  fileName: string;
}) {
  if (path.includes('<tenantId>') && !tenantId) {
    throw new Error('Tenant ID is required');
  }
  if (path.includes('<goodId>') && !goodId) {
    throw new Error('Good ID is required');
  }
  if (path.includes('<categoryId>') && !categoryId) {
    throw new Error('Category ID is required');
  }

  const partialPath = path
    .replace('<tenantId>', tenantId ?? '')
    .replace('<goodId>', goodId ?? '')
    .replace('<categoryId>', categoryId ?? '');

  return `${partialPath}/${fileName}`;
}

export function putObject({
  key,
  body,
}: {
  key: string;
  body: StreamingBlobPayloadInputTypes;
}) {
  const command = new PutObjectCommand({
    Bucket: env?.AWS_S3_BUCKET as string,
    Key: key,
    Body: body,
  });

  return s3Client.send(command);
}

export async function deleteObject({ key }: { key: string }) {
  const command = new DeleteObjectCommand({
    Bucket: env?.AWS_S3_BUCKET as string,
    Key: key,
  });

  const deleteResult = await s3Client.send(command);
  await invalidateCache({ key });

  return deleteResult;
}
