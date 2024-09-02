import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from '@aws-sdk/client-cloudfront';
import { randomUUID } from 'crypto';
import env from '../env.js';

class CloudFront {
  // Environment variables
  private readonly ACESS_KEY_ID = env?.AWS_ACCESS_KEY_ID as string;
  private readonly SECRET_ACCESS_KEY = env?.AWS_SECRET_ACCESS_KEY as string;
  private readonly DISTRIBUTION_ID =
    env?.AWS_CLOUDFRONT_DISTRIBUTION_ID as string;
  private readonly DOMAIN = env?.AWS_CLOUDFRONT_DOMAIN as string;
  private readonly KEY_PAIR_ID = env?.AWS_CLOUDFRONT_KEY_PAIR_ID as string;
  private readonly PRIVATE_KEY = env?.AWS_CLOUDFRONT_PRIVATE_KEY as string;
  // AWS SDK CloudFront client
  private client: CloudFrontClient;

  constructor() {
    this.client = new CloudFrontClient({
      credentials: {
        accessKeyId: this.ACESS_KEY_ID,
        secretAccessKey: this.SECRET_ACCESS_KEY,
      },
    });
  }

  public getPublicUrl({ key }: { key: string }): string {
    return `https://${this.DOMAIN}/${key}`;
  }

  public getPrivateUrl({ key }: { key: string }): string {
    const url = `https://${this.DOMAIN}/${key}`;
    const privateKey = this.PRIVATE_KEY;
    const keyPairId = this.KEY_PAIR_ID;
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 1000 * 60 * 60); // 1 hour from now

    return getSignedUrl({
      url,
      keyPairId,
      privateKey,
      dateLessThan: expirationDate.toUTCString(),
      dateGreaterThan: currentDate.toUTCString(),
    });
  }

  public async invalidateCache({ keys }: { keys: string[] }): Promise<void> {
    const command = new CreateInvalidationCommand({
      DistributionId: this.DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: randomUUID(),
        Paths: {
          Quantity: keys.length,
          Items: keys.map((key) => `/${key}`),
        },
      },
    });

    await this.client.send(command);
  }
}

export { CloudFront };
