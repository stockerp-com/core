import { presignPutUrlSchema } from '@core/validation/erp/aws/s3/presign-put-url.schema';
import { randomUUID } from 'crypto';
import { authenticatedProcedure } from '../../../../procedures/authenticated.js';
import { TRPCError } from '@trpc/server';

export const presignPutUrlHandler = authenticatedProcedure
  .input(presignPutUrlSchema)
  .query(async ({ ctx, input }) => {
    if (input.path.includes('<tenantId>')) {
      if (
        !ctx.session?.currentOrganization?.id ||
        ctx.session?.currentOrganization?.id !== input.tenantId
      ) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'errors:http:401',
        });
      }
    }

    const fileName = randomUUID();
    const key = ctx.aws?.s3.getKey({
      fileName,
      path: input.path,
      categoryId: input.categoryId,
      goodId: input.goodId,
      tenantId: input.tenantId,
    });

    if (!key) {
      throw new Error('Could not generate object key');
    }

    const url = await ctx.aws?.s3.presignPutObjectUrl({
      key,
    });

    if (!url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'errors:http:500',
      });
    }

    return {
      url,
      key,
    };
  });
