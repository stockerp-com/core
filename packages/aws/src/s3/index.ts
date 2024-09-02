import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import env from '../env.js';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { CloudFront } from '../cloudfront/index.js';
import { S3Path } from '@core/constants/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3 {
  // Environment variables
  private readonly ACESS_KEY_ID = env?.AWS_ACCESS_KEY_ID as string;
  private readonly SECRET_ACCESS_KEY = env?.AWS_SECRET_ACCESS_KEY as string;
  private readonly BUCKET = env?.AWS_S3_BUCKET as string;
  private readonly REGION = env?.AWS_S3_REGION as string;
  // AWS SDK clients
  private client: S3Client;
  private cloudFront: CloudFront;

  constructor({ cloudFront }: { cloudFront: CloudFront }) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.ACESS_KEY_ID,
        secretAccessKey: this.SECRET_ACCESS_KEY,
      },
      region: this.REGION,
    });
    this.cloudFront = cloudFront;
  }

  getKey({
    path,
    categoryId,
    goodId,
    tenantId,
    fileName,
  }: {
    path: S3Path;
    tenantId?: number;
    goodId?: number;
    categoryId?: number;
    fileName: string;
  }) {
    const partialPath = path;

    if (path.includes('<tenantId>')) {
      if (!tenantId) {
        throw new Error('Tenant ID is required');
      }

      partialPath.replace('<tenantId>', tenantId.toString());
    }
    if (path.includes('<goodId>')) {
      if (!goodId) {
        throw new Error('Good ID is required');
      }

      partialPath.replace('<goodId>', goodId.toString());
    }
    if (path.includes('<categoryId>')) {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      partialPath.replace('<categoryId>', categoryId.toString());
    }

    return `${partialPath}/${fileName}`;
  }

  async putObject({
    key,
    body,
  }: {
    key: string;
    body: StreamingBlobPayloadInputTypes;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET,
      Key: key,
      Body: body,
    });

    return this.client.send(command);
  }

  async presignPutObjectUrl({ key }: { key: string }) {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async deleteObject({ key }: { key: string }) {
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET,
      Key: key,
    });

    const deleteResult = await this.client.send(command);
    await this.cloudFront.invalidateCache({ keys: [key] });

    return deleteResult;
  }

  async deleteObjects({ keys }: { keys: string[] }) {
    await Promise.all(keys.map((key) => this.deleteObject({ key })));
    await this.cloudFront.invalidateCache({ keys });
  }
}

export { S3 };
