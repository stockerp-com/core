import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { presignPutUrlSchema } from '@retailify/validation/admin/s3/presign-put-url.schema';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { env } from '../../../env.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const presignPutUrlHandler = authenticatedProcedure
  .input(presignPutUrlSchema)
  .query(async ({ ctx, input }) => {
    if (ctx.s3) {
      const key = `${input.dir}/${ctx.session?.id}_${Date.now()}`;
      const options: PutObjectCommandInput = {
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
      };

      const command = new PutObjectCommand(options);
      const url = await getSignedUrl(ctx.s3, command);

      return {
        url,
        key,
      };
    }
  });
