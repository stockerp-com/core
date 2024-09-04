import { Prisma } from '@core/db';
import { importSchemaSchema } from '@core/validation/erp/import/schema/schema.schema';
import { TRPCError } from '@trpc/server';

export function parseImportSchema(jsonData: Prisma.JsonValue) {
  const { data, error } = importSchemaSchema.safeParse(jsonData);

  if (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: error.message,
    });
  }

  return data;
}
