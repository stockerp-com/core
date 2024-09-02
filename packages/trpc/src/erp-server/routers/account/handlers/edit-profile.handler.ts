import { editProfileSchema } from '@core/validation/erp/account/edit-profile.schema';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { TRPCError } from '@trpc/server';

export const editProfileHandler = authenticatedProcedure
  .input(editProfileSchema)
  .mutation(async ({ ctx, input }) => {
    const employee =
      await ctx.prismaManager?.rootPrismaClient.employee.findUnique({
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
      const existingEmployee =
        await ctx.prismaManager?.rootPrismaClient.employee.findUnique({
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

    if ((hasUserChangedPicture || hasUserRemovedPicture) && employee.picture) {
      await Promise.all([
        ctx.aws?.s3.deleteObject({
          key: employee.picture.key,
        }),
        ctx.prismaManager?.rootPrismaClient.file.delete({
          where: {
            key: employee.picture.key,
          },
        }),
      ]);
    }

    await ctx.prismaManager?.rootPrismaClient.employee.update({
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
