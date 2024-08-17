import { editProfileSchema } from '@retailify/validation/erp/account/edit-profile.schema';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { TRPCError } from '@trpc/server';
import { env } from '../../../env.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export const editProfileHandler = authenticatedProcedure
  .input(editProfileSchema)
  .mutation(async ({ ctx, input }) => {
    const employee = await ctx.db?.employee.findUnique({
      where: {
        id: ctx.session?.id,
      },
      include: {
        picture: true,
      },
    });
    if (!employee) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:account.edit_profile.failed'),
      });
    }

    if (input.email !== employee.email) {
      const existingEmployee = await ctx.db?.employee.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingEmployee) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: ctx.t?.('res:account.edit_profile.email_taken', {
            email: input.email,
          }),
        });
      }
    }

    const hasUserChangedPicture =
      input.picture &&
      employee.picture &&
      employee.picture?.key !== input.picture.key;
    const hasUserRemovedPicture = !input.picture && employee.picture?.key;

    if (hasUserChangedPicture || hasUserRemovedPicture) {
      await Promise.all([
        ctx.s3?.send(
          new DeleteObjectCommand({
            Bucket: env.AWS_S3_BUCKET!,
            Key: employee.picture?.key,
          }),
        ),
        ctx.db?.file.delete({
          where: {
            key: employee.picture?.key,
          },
        }),
      ]);
    }

    await ctx.db?.employee.update({
      where: {
        id: ctx.session?.id,
      },
      data: {
        fullName: input.fullName,
        email: input.email,
        picture: input.picture
          ? {
              connectOrCreate: {
                where: {
                  key: input.picture.key,
                },
                create: {
                  key: input.picture.key,
                  name: input.picture.name,
                  size: input.picture.size,
                  type: input.picture.type,
                },
              },
            }
          : undefined,
      },
    });

    return {
      message: ctx.t?.('res:account.edit_profile.success'),
    };
  });
